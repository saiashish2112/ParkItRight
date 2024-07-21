import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const GetProfile = () => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (err) {
                setMessage(err.response.data.message);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="get-profile">
            <h2>Profile</h2>
            {profile ? (
                <div>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                </div>
            ) : (
                <p>{message}</p>    
            )}
        </div>
    );
};

export default GetProfile;