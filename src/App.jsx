import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SetPassword from './components/SetPassword';
import Overview from './components/Overview';
import Memories from './components/Memories';
import Help from './components/Help';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import FamilyTree from './components/FamilyTree';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AboutUs from './components/AboutUs';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Features />
                  <GetStarted />
                </>
              }
            />
            <Route path="/overview" element={<Overview />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/help" element={<Help />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/set-password/:token" element={<SetPassword />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute allowedUserTypes={['USER']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
  path="/family-tree/:imageNumber/:recordNumber"
  element={
    <ProtectedRoute allowedUserTypes={['USER']}>
      <FamilyTree />
    </ProtectedRoute>
  }
/>
<Route
  path="/family-tree/:metadataId"
  element={
    <ProtectedRoute allowedUserTypes={['USER']}>
      <FamilyTree />
    </ProtectedRoute>
  }
/>
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
