import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddMembers = ({ userId }) => {
    const [username, setUsername] = useState("");
    const [usernameToAdd, setUsernameToAdd] = useState("");
    const [members, setMembers] = useState([]);
    const [addMemberError, setAddMemberError] = useState("");
    const navigate = useNavigate();
    const { groupId } = useParams();

    useEffect(() => {
        const queryUsername = async () => {
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

    const handleAddMember = async (event) => {
        event.preventDefault();

        if (usernameToAdd && !members.includes(usernameToAdd)) {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/query/is-user/${usernameToAdd}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                const data = await res.json();
                if (res.status === 200) {
                    if (!data.isUser) {
                        setAddMemberError("User not found");
                    } else {
                        setMembers([...members, usernameToAdd]);
                        setUsernameToAdd("");
                        setAddMemberError("");
                    }
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        } else if (members.includes(usernameToAdd)) {
            setAddMemberError("User already added");
        }
    };

    const handleRemoveMember = (memberToRemove) => {
        setMembers(members.filter(member => member !== memberToRemove));
    };

    const finalizeGroup = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/group/add-users`, {
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
            <div className='current-members'>
                <h2>Current members</h2>
                <ul className='member-list'>
                    {members.map((member, index) => (
                        <li key={index} className='member-item'>
                            <span className='member-name'>{member}</span>
                            {member !== username && <button onClick={() => handleRemoveMember(member)} className='remove-button'>Remove</button>}
                        </li>
                    ))}
                </ul>
                <button onClick={finalizeGroup} className='finalize-group-button'>Create group</button>
            </div>

            <div className='add-member-form'>
                <h2>Add member</h2>
                <form onSubmit={handleAddMember} className='member-form'>
                    <div className='input-container'>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={usernameToAdd}
                            onChange={(event) => setUsernameToAdd(event.target.value)}
                            className='member-input'
                        />
                        <button type="submit" className='member-button'>Add</button>
                    </div>
                    {addMemberError && <p className='error-message'>{addMemberError}</p>}
                </form>
            </div>
        </div>
    );
};

export default AddMembers;
