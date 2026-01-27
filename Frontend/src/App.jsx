import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<div>Signup Page </div>} />
      <Route path="/login" element={<div>Login Page </div>} />
    </Routes>
  );
}

export default App;
