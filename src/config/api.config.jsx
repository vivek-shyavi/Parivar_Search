// src/config/api.config.js
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://34.203.168.60:5000/api' 
  : 'http://localhost:5000/api';

// export default BASE_URL;
