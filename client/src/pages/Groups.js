import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as we from '../wasm/witness_encryption_functional_commitment.js';

const Groups = ({ userId }) => {
    const [username, setUsername] = useState("");
    const [groupsCreated, setGroupsCreated] = useState([]);
    const [groupsAdded, setGroupsAdded] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupError, setNewGroupError] = useState("");
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
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/query/user/${userId}`, {
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
            // // Using unsafe setup here!!
            // const params = we.setup_unsafe();
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/group/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ groupName: newGroupName }),
            });

            const data = await res.json();
            if (res.status === 201) {
                console.log("Group created:", data);
                setNewGroupName("");
                setNewGroupError("");
                navigate(`/add-members/${data.groupId}`);
            } else if (res.status === 409) {
                setNewGroupError("Group name already exists");
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
                    <h2 className="group-heading">Your groups:</h2>
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
                <h2 style={{ marginLeft: "10px" }}>Create new group</h2>
                <form onSubmit={handleCreateGroup} className='group-form' style={{ marginLeft: "10px" }}>
                    <div className='input-container'>
                        <input
                            type="text"
                            placeholder="Group name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className='group-input'
                        />
                        <button type="submit" className='group-button'>Create</button>
                    </div>
                    {newGroupError && <p className='error-message'>{newGroupError}</p>}
                </form>
                <div className="instructions">
                    <h3>How to use:</h3>
                    <ol>
                        <li>Create a new group and add your friends.</li>
                        <li>In your group, heart the people that you're interested in. Then, click "Done".</li>
                        <li>Once everyone's done, each person then needs to click "Match!".</li>
                        <li>Once everyone's matched, click the question mark to reveal!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default Groups;
