const base_url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:3000"
  : "https://nexthire-mainproject-backend.onrender.com";

export default base_url;