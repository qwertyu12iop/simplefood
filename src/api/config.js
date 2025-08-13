import axios from 'axios';

const isProduction = window.location.hostname !== 'localhost';
const isVercel = window.location.hostname.includes('vercel.app');

// 统一使用 /api 前缀
axios.defaults.baseURL = isProduction
    ? (isVercel ? '/api' : '/api') // Vercel 和其他生产环境都使用 /api
    : `http://${window.location.hostname}:${window.location.port}/api`; // 开发环境

export const envConfig = {
    isProduction,
    isVercel
};

export default axios;