import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as we from '../wasm/witness_encryption_functional_commitment.js';

const Groups = ({ userId }) => {
    const [username, setUsername] = useState("");
    const [groupsCreated, setGroupsCreated] = useState([]);
    const [groupsAdded, setGroupsAdded] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
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
        const queryUser = async () => {
            try {
                const res = await fetch(`http://localhost:8000/routes/query/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                const data = await res.json();
                if (res.status === 200) {
                    setUsername(data.username);
                    setGroupsCreated(data.groupsCreated);
                    setGroupsAdded(data.groupsAdded);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        if (userId) {
            queryUser();
        } else {
            console.log("No user");
        }
    }, [userId]);

    const handleCreateGroup = async (event) => {
        event.preventDefault();
        if (!newGroupName) return;

        if (!wasmLoaded) { console.error("WASM not loaded"); return; }


        try {
            // Using unsafe setup here!!
            const params = we.setup_unsafe();
            const res = await fetch('http://localhost:8000/routes/group/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ groupName: newGroupName, params }),
            });

            const data = await res.json();
            if (res.status === 201) {
                console.log("Group created:", data);
                setNewGroupName("");
                navigate(`/add-members/${data.groupId}`);
            } else {
                console.error("Failed to create group:", data);
            }
        } catch (err) {
            console.error("Failed to create group:", err);
        }
    };

    return (
        <div className="groups-container">
            <div className="group-details">
                <h1>Welcome, {username}</h1>
                <div>
                    <h2 className="group-heading">Your Groups:</h2>
                    {groupsCreated.length + groupsAdded.length > 0 ? (
                        <ul className="group-list">
                            {groupsCreated.map(group => (
                                <li key={group._id} className="group-item">
                                    <Link to={`/group/${group._id}`}>{group.name}</Link>
                                </li>
                            ))}
                            {groupsAdded.map(group => (
                                <li key={group._id} className="group-item">
                                    <Link to={`/group/${group._id}`}>{group.name}</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You are not in any groups yet.</p>
                    )}
                </div>
            </div>
            <div className="create-group-form">
                <form onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        placeholder="Group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <button type="submit">Create new group</button>
                </form>
            </div>
        </div>
    );
}

export default Groups;
