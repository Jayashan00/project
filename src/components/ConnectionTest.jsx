import { useEffect, useState } from 'react';
import api from '../api/client';
import React from "react";

const ConnectionTest = () => {
  const [status, setStatus] = useState('Checking connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.get('/health');
        setStatus(`Connected to backend! Server time: ${response.data.timestamp}`);
        setError(null);
      } catch (err) {
        setError(`Connection failed: ${err.message}`);
      }
    };

    checkConnection();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Backend Connection Status</h3>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p style={{ color: 'green' }}>{status}</p>
      )}
    </div>
  );
};

export default ConnectionTest;
