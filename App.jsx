// App.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={handleLogout}
        user={user}
        isLoggedIn={isLoggedIn}
        onShowLogin={() => setCurrentView('login')}
      />
      
      <div className="main-content">
        {currentView === 'dashboard' && <Dashboard user={user} isLoggedIn={isLoggedIn} />}
        {currentView === 'alerts' && <AlertSystem />}
        {currentView === 'safety-status' && <SafetyStatus />}
        {currentView === 'emergency' && <EmergencyButton />}
        {currentView === 'profile' && <ProfileManagement user={user} setUser={setUser} isLoggedIn={isLoggedIn} />}
        {currentView === 'location' && <LocationSharing />}
        {currentView === 'predictions' && <CrowdPredictions />}
        {currentView === 'login' && <LoginSignup onLogin={handleLogin} onClose={() => setCurrentView('dashboard')} />}
      </div>
    </div>
  );
}

// Navbar Component with Login Option
const Navbar = ({ currentView, setCurrentView, onLogout, user, isLoggedIn, onShowLogin }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>SafeTour</h1>
      </div>
      
      <ul className="nav-menu">
        <li 
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </li>
        <li 
          className={`nav-item ${currentView === 'alerts' ? 'active' : ''}`}
          onClick={() => setCurrentView('alerts')}
        >
          Alerts
        </li>
        <li 
          className={`nav-item ${currentView === 'safety-status' ? 'active' : ''}`}
          onClick={() => setCurrentView('safety-status')}
        >
          Safety Status
        </li>
        <li 
          className={`nav-item ${currentView === 'emergency' ? 'active' : ''}`}
          onClick={() => setCurrentView('emergency')}
        >
          Emergency
        </li>
        <li 
          className={`nav-item ${currentView === 'predictions' ? 'active' : ''}`}
          onClick={() => setCurrentView('predictions')}
        >
          Predictions
        </li>
        <li 
          className={`nav-item ${currentView === 'location' ? 'active' : ''}`}
          onClick={() => setCurrentView('location')}
        >
          Location
        </li>
      </ul>
      
      <div className="nav-user">
        {isLoggedIn ? (
          <>
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span>{user?.name || 'User'}</span>
            <li 
              className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentView('profile')}
            >
              Profile
            </li>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="login-btn" onClick={onShowLogin}>
            Login / Signup
          </button>
        )}
      </div>
    </nav>
  );
};

// Dashboard Component (Public)

const Dashboard = ({ user, isLoggedIn }) => {

  const [locations, setLocations] = useState([]);

  // 📍 Coordinates added
  const placeCoords = {
    "City Center": [17.3850, 78.4867],
    "Temple Area": [17.3833, 78.4816],
    "Beach Side": [17.3700, 78.4800]
  };

  // 🔥 Live Crowd Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const data = [
        { name: "City Center", count: Math.floor(Math.random() * 100) },
        { name: "Temple Area", count: Math.floor(Math.random() * 100) },
        { name: "Beach Side", count: Math.floor(Math.random() * 100) }
      ];
      setLocations(data);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 Status Logic
  const getStatus = (count) => {
    if (count <= 30) return { text: "Low 🟢", color: "#4caf50" };
    if (count <= 50) return { text: "Medium 🟡", color: "#ff9800" };
    if (count <= 80) return { text: "High 🔴", color: "#f44336" };
    return { text: "Danger 🚨", color: "#b71c1c" };
  };

  // 📢 Alerts
  const alerts = locations
    .filter(loc => loc.count > 50)
    .map((loc, index) => ({
      id: index,
      title: "High Crowd Density",
      message: `${loc.name} is overcrowded (${loc.count} people). Avoid this area.`,
      time: "Just now"
    }));

  // 📊 Avg
  const avgCrowd = locations.length
    ? locations.reduce((sum, loc) => sum + loc.count, 0) / locations.length
    : 0;

  const overallStatus = getStatus(avgCrowd);

  return (
    <div>

      {/* HEADER */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {isLoggedIn ? `Welcome, ${user?.name}!` : 'Welcome to SafeTour!'}
          </h2>
          <span>Current Location: City Center</span>
        </div>
        <p>Real-time AI crowd monitoring for tourist safety.</p>
      </div>

      <div className="dashboard-grid">

        {/* 🗺️ MAP */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Live Crowd Map</h2>
          </div>

          <MapContainer
            center={[17.3850, 78.4867]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map((loc, i) => {
              const status = getStatus(loc.count);
              return (
                <Marker key={i} position={placeCoords[loc.name]}>
                  <Popup>
                    <strong>{loc.name}</strong><br />
                    People: {loc.count}<br />
                    Status: {status.text}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* 🔥 LIVE STATUS */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Live Crowd Status</h2>
          </div>

          {locations.map((loc, index) => {
            const status = getStatus(loc.count);

            return (
              <div key={index} style={{ marginBottom: "10px" }}>
                <strong>{loc.name}</strong><br/>
                People: {loc.count}<br/>
                Status: <span style={{ color: status.color }}>{status.text}</span>

                {loc.count > 50 && (
                  <p style={{ color: "red" }}>⚠️ Overcrowded Area</p>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 🔥 ALERTS */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Live Alerts</h2>
        </div>

        {alerts.length === 0 ? (
          <p>No alerts. Area is safe ✅</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="alert-item alert-danger">
              <div className="alert-header">
                <span className="alert-title">{alert.title}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
              <p>{alert.message}</p>
            </div>
          ))
        )}
      </div>

      {/* 🔥 SAFETY */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Overall Safety Status</h2>
        </div>

        <h3 style={{ color: overallStatus.color }}>
          {overallStatus.text}
        </h3>

        <div className="safety-meter">
          <div
            className="meter-fill"
            style={{
              width: `${avgCrowd}%`,
              background: overallStatus.color
            }}
          ></div>
        </div>

        <p>Based on real-time crowd density analysis.</p>
      </div>

    </div>
  );
};

// LoginSignup Component (Modal Style)
const LoginSignup = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login data:', { email: formData.email, password: formData.password });
      onLogin({ name: 'John Doe', email: formData.email });
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Signup data:', formData);
      onLogin({ name: formData.name, email: formData.email });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="login-header">
          <h1 className="login-title">SafeTour</h1>
          <p className="login-subtitle">Smart Crowd Safety Management System</p>
        </div>
        
        <div className="form-section">
          <div className="form-header">
            <h2>{isLogin ? 'Login to Your Account' : 'Create New Account'}</h2>
            <div className="toggle-container">
              <button 
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            )}
            
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            )}
            
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
          
          <div className="form-footer">
            <a href="#" className="forgot-link">Forgot Password?</a>
            <div className="social-auth">
              <div className="divider">
                <span>Or continue with</span>
              </div>
              <div className="social-buttons">
                <button className="social-btn google-btn">
                  <span className="social-icon">G</span>
                  Google
                </button>
                <button className="social-btn facebook-btn">
                  <span className="social-icon">f</span>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Other components (AlertSystem, SafetyStatus, EmergencyButton, etc.) remain the same
// as in the previous implementation, but make sure to check if user is logged in
// for features that require authentication

const AlertSystem = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Alert System</h2>
    </div>
    <div className="alert-list">
      <div className="alert-item alert-info">
        <div className="alert-header">
          <span className="alert-title">System Update</span>
          <span className="alert-time">Today</span>
        </div>
        <p>Alert system is functioning normally. You will receive notifications for any safety concerns.</p>
      </div>
    </div>
  </div>
);

const SafetyStatus = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Safety Status</h2>
    </div>
    <div className="safety-status">
      <h3>Current Area Safety: Good</h3>
      <div className="safety-meter">
        <div className="meter-fill" style={{width: '30%', background: '#4caf50'}}></div>
      </div>
      <p>Your current location has low crowd density and no safety issues detected.</p>
    </div>
  </div>
);

const EmergencyButton = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Emergency Assistance</h2>
    </div>
    <div className="emergency-container">
      <button className="emergency-btn">EMERGENCY</button>
      <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        <div className="contact-list">
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <span>Police: 100</span>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🏥</div>
            <span>Ambulance: 108</span>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🚒</div>
            <span>Fire: 101</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfileManagement = ({ user, setUser, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Profile Management</h2>
        </div>
        <div className="guest-message">
          <h3>Please login to access your profile</h3>
          <p>You need to be logged in to view and edit your profile information.</p>
          <button className="btn btn-primary">Login Now</button>
        </div>
      </div>
    );
  }

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    emergencyContact: '+91 9123456789'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: profileData.name, email: profileData.email });
    alert('Profile updated successfully!');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Profile Management</h2>
      </div>
      
      <div className="profile-header">
        <div className="profile-avatar">
          {profileData.name?.charAt(0) || 'U'}
        </div>
        <div className="profile-info">
          <h2>{profileData.name || 'User'}</h2>
          <p>{profileData.email || 'user@example.com'}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            name="name"
            className="form-input" 
            value={profileData.name}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            name="email"
            className="form-input" 
            value={profileData.email}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            className="form-input" 
            value={profileData.phone}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Emergency Contact</label>
          <input 
            type="tel" 
            name="emergencyContact"
            className="form-input" 
            value={profileData.emergencyContact}
            onChange={handleInputChange}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

const LocationSharing = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Location Sharing</h2>
    </div>
    <div className="location-card">
      <div className="location-icon">📍</div>
      <div className="location-info">
        <div className="location-name">City Center</div>
        <div className="location-status">Sharing with emergency contacts</div>
      </div>
    </div>
    <button className="btn btn-primary">Manage Sharing Settings</button>
  </div>
);

const CrowdPredictions = () => (
  <div className="card">
    <div className="card-header">
      <h2 className="card-title">Crowd Predictions</h2>
    </div>
    <div className="prediction-chart">
      <div className="chart-bar" style={{height: '40%'}}>
        <div className="bar-label">Now</div>
      </div>
      <div className="chart-bar" style={{height: '60%'}}>
        <div className="bar-label">1h</div>
      </div>
      <div className="chart-bar" style={{height: '80%'}}>
        <div className="bar-label">2h</div>
      </div>
      <div className="chart-bar" style={{height: '75%'}}>
        <div className="bar-label">3h</div>
      </div>
      <div className="chart-bar" style={{height: '50%'}}>
        <div className="bar-label">4h</div>
      </div>
    </div>
    <p>Peak crowd expected in 2 hours. Plan your visit accordingly.</p>
  </div>
);

export default App;