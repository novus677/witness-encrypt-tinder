import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddMembers = () => {
    const [username, setUsername] = useState("");
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const { groupId } = useParams();

    const handleAddMember = () => {
        if (username && !members.includes(username)) {
            setMembers([...members, username]);
            setUsername("");
        }
    };

    const finalizeGroup = async () => {
        try {
            await fetch('http://localhost:8000/routes/group/add-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ groupId, usernames: members }),
            });
            console.log("Added members successfully");
            navigate('/');
        } catch (err) {
            console.error("Error adding members:", err);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
            />
            <button onClick={handleAddMember}>Add member</button>
            <div>
                <h3>Current Members</h3>
                <ul>
                    {members.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
            </div>
            <button onClick={finalizeGroup}>Create group</button>
        </div>
    );
};

export default AddMembers;
