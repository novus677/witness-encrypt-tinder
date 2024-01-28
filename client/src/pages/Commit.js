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
    const [committed, setCommitted] = useState(false);
    const [allCommitted, setAllCommitted] = useState(false);
    const [encrypted, setEncrypted] = useState(false);
    const [allEncrypted, setAllEncrypted] = useState(false);
    const [members, setMembers] = useState([]);
    const [committedMembers, setCommittedMembers] = useState({});
    const [messages, setMessages] = useState({});
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
        const queryMembers = async () => {
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

        const queryAllEncrypted = async () => {
            try {
                const res = await fetch(`http://localhost:8000/routes/message/all-done/${groupId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                const data = await res.json();
                if (res.status === 200) {
                    setAllEncrypted(data.allDone);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching group data:", err);
            }
        }

        const queryEncrypted = async () => {
            try {
                const res = await fetch(`http://localhost:8000/routes/message/is-done/${groupId}/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                const data = await res.json();
                if (res.status === 200) {
                    setEncrypted(data.done);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching message data:", err);
            }
        }

        const queryAllCommitted = async () => {
            try {
                const res = await fetch(`http://localhost:8000/routes/group/all-done/${groupId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                const data = await res.json();
                if (res.status === 200) {
                    setAllCommitted(data.allDone);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching group data:", err);
            }
        }

        const queryCommitted = async () => {
            try {
                const res = await fetch(`http://localhost:8000/routes/group/is-done/${groupId}/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                const data = await res.json();
                if (res.status === 200) {
                    setCommitted(data.done);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching group data:", err);
            }
        }

        queryMembers();
        queryAllEncrypted();
        queryEncrypted();
        queryAllCommitted();
        queryCommitted();
    }, [groupId, navigate, userId]);

    useEffect(() => {
        if (allEncrypted) {
            const fetchMessages = async () => {
                try {
                    const res = await fetch(`http://localhost:8000/routes/query/messages/${userId}/${groupId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                    });

                    const data = await res.json();
                    if (res.status === 200) {
                        setMessages(data.messages);
                    } else {
                        console.error("Query failed:", data);
                    }
                } catch (err) {
                    console.error("Error fetching messages:", err);
                }
            }

            fetchMessages();
        }
    }, [allEncrypted, groupId, userId]);

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

            const data = await res.json();
            if (res.status === 201) {
                console.log("Commitment stored successfully");
                committedGroups[memberId] = { r_commit_bytes: commitment['r_commit_bytes'], commitmentId: data.commitmentId };
                await localforage.setItem(groupId, committedGroups);
                setCommittedMembers(prev => ({ ...prev, [memberId]: true }));
            } else {
                console.error("Failed to save commitment:", data);
            }
        } catch (err) {
            console.error("Failed to compute commitment:", err);
        }
    };

    const handleDone = async () => {
        try {
            const res = await fetch('http://localhost:8000/routes/group/done', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ groupId, userId }),
            });

            const data = await res.json();
            if (res.status === 200) {
                console.log("Marked user as done");
                setCommitted(true);
            } else {
                console.error("Failed to mark as done:", data);
            }
        } catch (err) {
            console.error("Failed to mark as done:", err);
        }
    }

    const handleEncrypt = async () => {
        if (!wasmLoaded) { console.error("WASM not loaded"); return; }

        if (!params) { console.error("No setup parameters"); return; }

        try {
            const res = await fetch(`http://localhost:8000/routes/query/commitment/${groupId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();
            if (res.status === 200) {
                const commitments = data.commitments;

                const r_commit_bytes = await localforage.getItem(groupId) || {};
                for (let i = 0; i < commitments.length; i++) {
                    try {
                        const message = we.encrypt(params["u1_bytes"].data, params["u2_bytes"].data, commitments[i].value.data, userId, r_commit_bytes.hasOwnProperty(commitments[i].user._id) ? 1 : 0);
                        const res = await fetch('http://localhost:8000/routes/message/send', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({ sender: userId, receiver: commitments[i].user._id, group: groupId, commitment: commitments[i]._id, content: message }),
                        });
                    } catch (err) {
                        console.error("Failed to save encrypted message:", err);
                    }
                }

                try {
                    const res = await fetch('http://localhost:8000/routes/message/done', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ groupId, userId }),
                    });

                    const data = await res.json();
                    if (res.status === 200) {
                        console.log("Updated membersEncrypted");
                    } else {
                        console.error("Failed to update membersEncrypted:", data)
                    }
                } catch (err) {
                    console.error("Failed to update membersEncrypted:", err);
                }

                setEncrypted(true);
            } else {
                console.error("Failed to get commitments:", data);
            }
        } catch (err) {
            console.error("Failed to send encrypted messages:", err);
        }
    };

    const handleReveal = async (memberId) => {
        if (!wasmLoaded) { console.error("WASM not loaded"); return; }

        if (!params) { console.error("No setup parameters"); return; }

        const r_commit_bytes = await localforage.getItem(groupId).then(val => val[memberId]) || {};
        for (const message of messages) {
            if (message.sender._id === memberId && message.commitment._id === r_commit_bytes.commitmentId) {
                try {
                    const decrypted = we.decrypt(
                        params["u1_bytes"].data,
                        params["u2_bytes"].data,
                        message.content["proj_key_bytes"].data,
                        message.content["rand_bytes"].data,
                        message.content["ciphertext"],
                        memberId,
                        r_commit_bytes.r_commit_bytes,
                    )
                    console.log("Decrypted message:", decrypted);
                } catch (err) {
                    console.error("Failed to decrypt message:", err);
                }
            }
        }
    }

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
                {committed && <p>You have finished committing members.</p>}
                {!committed && <button onClick={handleDone}>Done</button>}
                {encrypted && <p>You have finished encrypting messages.</p>}
                {allCommitted && !encrypted && <button onClick={handleEncrypt}>Encrypt</button>}
            </div>
            <div className='committed-members-container'>
                <h3>Committed members</h3>
                <ul>
                    {members.filter(member => committedMembers.hasOwnProperty(member._id)).map(member => (
                        <li key={member._id}>
                            {member.username}
                            {allEncrypted && <button onClick={() => handleReveal(member._id)}>Reveal</button>}
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    );
};

export default Commit;
