import React from 'react';
import { useAuth } from '../../context/Authcontext';
import './Dashboard.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </div>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <h2>{user?.firstName && user?.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user?.email || 'User'}</h2>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>
          
          <div className="detail-item">
            <label>Phone Number</label>
            <p>{user?.phoneNumber || 'N/A'}</p>
          </div>
          
          <div className="detail-item">
            <label>First Name</label>
            <p>{user?.firstName || 'N/A'}</p>
          </div>
          
          <div className="detail-item">
            <label>Last Name</label>
            <p>{user?.lastName || 'N/A'}</p>
          </div>
          
          <div className="detail-item">
            <label>User ID</label>
            <p>{user?.id || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

