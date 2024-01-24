import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';

const Commit = () => {
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

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

                const data = await res.json();
                if (res.status === 200) {
                    setMembers(data.members);
                } else {
                    console.error("Query failed:", data);
                }
            } catch (err) {
                console.error("Error fetching group data:", err);
            }
        };

        queryGroup();
    }, [groupId]);

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className='commit-container'>
            <h2 className='commit-heading'>Members</h2>
            <ul className='commit-member-list'>
                {members.map(member => (
                    <li key={member._id} className='commit-member-item'>{member.username}</li>
                ))}
            </ul>
            <button onClick={handleGoBack} className='commit-back-button'>Back to groups</button>
        </div>
    );
};

export default Commit;
