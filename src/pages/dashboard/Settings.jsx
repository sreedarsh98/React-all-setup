import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your application preferences</p>
      </div>
      
      <div className="settings-card">
        <h3>Preferences</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Email Notifications</label>
            <p>Receive email updates about your account</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Theme</label>
            <p>Choose your preferred theme</p>
          </div>
          <div className="setting-control">
            <select
              value={theme}
              onChange={(e) => toggleTheme(e.target.value)}
              className="theme-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <h3>Account</h3>
        <div className="settings-actions">
          <button className="settings-button danger">Delete Account</button>
          <button className="settings-button">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

