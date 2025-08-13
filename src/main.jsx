import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'lib-flexible';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import axios from 'axios';

// 配置 axios
axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
  return config;
});

axios.interceptors.response.use(response => {
  return response.data;
}, error => {
  console.error('API Error:', error);
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);