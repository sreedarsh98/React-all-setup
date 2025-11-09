import React from 'react';
import './Dashboard.css';

const Home = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard Home</h1>
        <p>Welcome to your dashboard! This is a protected page.</p>
      </div>
      
      <div className="cards-grid">
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Statistics</h3>
          <p>View your analytics and statistics</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">📈</div>
          <h3>Reports</h3>
          <p>Generate and view reports</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">⚡</div>
          <h3>Quick Actions</h3>
          <p>Access frequently used features</p>
        </div>
        
        <div className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h3>Notifications</h3>
          <p>Check your latest updates</p>
        </div>
      </div>
    </div>
  );
};

export default Home;


