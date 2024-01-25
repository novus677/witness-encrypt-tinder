import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';
import * as we from '../wasm/witness_encryption_functional_commitment.js';
import localforage from 'localforage';

localforage.config({
    name: 'witness-encrypted-tinder',
    storeName: 'randomness',
});

const Commit = ({ userId }) => {
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const [committedMembers, setCommittedMembers] = useState({});
    const [params, setParams] = useState(null);
    const [wasmLoaded, setWasmLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadWasm = async () => {
            await we.default();
            setWasmLoaded(true);
        }
        loadWasm();
    }, []);

    useEffect(() => {
        const queryGroup = async () => {
            try {
                const res = await fetch(`http://localhost:8000/routes/query/group/${groupId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (res.status === 403) {
                    navigate('/');
                    return;
                }

                const data = await res.json();
                if (res.status === 200) {
                    setMembers(
                        data.members.filter(member => member._id !== userId).sort((a, b) => a.username.localeCompare(b.username))
                    );
                    setParams(data.params);
                    setCommittedMembers(await localforage.getItem(groupId) || {});
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching group data:", err);
            }
        };

        queryGroup();
    }, [groupId, navigate, userId]);

    const handleCommit = async (memberId) => {
        if (!wasmLoaded) { console.error("WASM not loaded"); return; }

        if (!params) { console.error("No setup parameters"); return; }

        try {
            const committedGroups = await localforage.getItem(groupId) || {};
            if (committedGroups[memberId]) {
                console.log("Already committed");
                return;
            }

            const commitment = we.commit(params["u1_bytes"].data, params["u2_bytes"].data, memberId);
            const res = await fetch('http://localhost:8000/routes/commit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ groupId, value: commitment['commit_bytes'] }),
            });

            const data = res.json();
            if (res.status === 201) {
                console.log("Commitment stored successfully");
                committedGroups[memberId] = commitment['r_commit_bytes'];
                await localforage.setItem(groupId, committedGroups);
                setCommittedMembers(prev => ({ ...prev, [memberId]: true }));
            } else {
                console.error("Failed to save commitment:", data);
            }
        } catch (err) {
            console.error("Failed to compute commitment:", err);
        }
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className='commit-page-container'>
            <div className='commit-container'>
                <h2 className='commit-heading'>Members</h2>
                <ul className='commit-member-list'>
                    {members.map(member => (
                        <li key={member._id} className='commit-member-item'>
                            {member.username}
                            {committedMembers[member._id] ?
                                <span className='already-committed'> Already committed</span> :
                                <button onClick={() => handleCommit(member._id)}>Commit</button>
                            }
                        </li>
                    ))}
                </ul>
                <button onClick={handleGoBack} className='commit-back-button'>Back to groups</button>
            </div>
            <div className='committed-members-container'>
                <h3>Committed members</h3>
                <ul>
                    {members.filter(member => committedMembers.hasOwnProperty(member._id)).map(member => (
                        <li key={member._id}>{member.username}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Commit;
