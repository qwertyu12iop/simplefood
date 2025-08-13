import axios from "axios";

// 获取当前主机名
const hostname = window.location.hostname;
const port = window.location.port;

// 判断环境
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isVercel = hostname.includes('vercel.app');

// 设置基础URL
let baseURL;

if (isLocalhost) {
    // 开发环境 - 使用当前主机和端口
    baseURL = `http://${hostname}:${port}/api`;
} else if (isVercel) {
    // Vercel 生产环境 - 使用相对路径
    baseURL = '/api';
} else {
    // 其他生产环境（如自定义域名）
    baseURL = '/api'; // 或者使用你的生产环境API地址
}

axios.defaults.baseURL = baseURL;

// 请求拦截器
axios.interceptors.request.use(config => {
    // 可以在这里添加 token 等全局请求处理
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

// 响应拦截器
axios.interceptors.response.use(
    response => response.data,
    error => {
        // 统一错误处理
        console.error('API 请求错误:', error);
        return Promise.reject(error);
    }
);

// 导出环境变量，供其他模块使用
export const envConfig = {
    isLocalhost,
    isVercel,
    baseURL
};

console.log(`当前运行环境: ${isLocalhost ? '开发环境' : isVercel ? 'Vercel生产环境' : '其他生产环境'}`);
console.log(`API基础地址: ${baseURL}`);

export default axios;