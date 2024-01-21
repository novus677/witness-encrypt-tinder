import React, { useState, useEffect } from 'react';

const MainPage = ({ userId }) => {
    const [username, setUsername] = useState("");
    const [groupsCreated, setGroupsCreated] = useState([]);
    const [groupsAdded, setGroupsAdded] = useState([]);

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

    return (
        <div>
            <h1>Welcome, {username}</h1>
            <div>
                <h2>Your Groups:</h2>
                {groupsCreated.length + groupsAdded.length > 0 ? (
                    <u1>
                        {groupsCreated.map(group => (
                            <li key={group._id}>{group.name}</li>
                        ))}
                        {groupsAdded.map(group => (
                            <li key={group._id}>{group.name}</li>
                        ))}
                    </u1>
                ) : (
                    <p>You are not in any groups yet.</p>
                )}
            </div>
        </div>
    );
}

export default MainPage;
