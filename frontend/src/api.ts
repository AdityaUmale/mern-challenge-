import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // Change this to match your backend port
});

export default API;
