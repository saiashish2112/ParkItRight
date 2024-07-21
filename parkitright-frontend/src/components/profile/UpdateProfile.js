import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const UpdateProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/update-profile/:id', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
                setEmail(response.data.email);
            } catch (err) {
                setMessage(err.response.data.message);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/api/auth/update-profile/:id', {
                username,
                email,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response.data.message);
        }
    };

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            <h2>Update Profile</h2>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <button type="submit">Update</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UpdateProfile;
