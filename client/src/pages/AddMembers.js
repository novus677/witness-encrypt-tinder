import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddMembers = ({ userId }) => {
    const [username, setUsername] = useState("");
    const [usernameToAdd, setUsernameToAdd] = useState("");
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const { groupId } = useParams();

    useEffect(() => {
        const queryUsername = async () => {
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
                    setMembers([data.username]);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        queryUsername();
    }, [userId]);

    const handleAddMember = () => {
        if (usernameToAdd && !members.includes(usernameToAdd)) {
            setMembers([...members, usernameToAdd]);
            setUsernameToAdd("");
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
        <div className='add-members-container'>
            <div className='add-member-form'>
                <input
                    type="text"
                    value={usernameToAdd}
                    onChange={(event) => setUsernameToAdd(event.target.value)}
                    placeholder="Enter username"
                />
                <button onClick={handleAddMember}>Add member</button>
            </div>
            <div className='current-members'>
                <h3>Current Members</h3>
                <ul>
                    {members.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
            </div>
            <button onClick={finalizeGroup} className='finalize-group-button'>Create group</button>
        </div>
    );
};

export default AddMembers;
