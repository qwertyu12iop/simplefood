import axios from './config';
import { envConfig } from './config';
import Mock from 'mockjs';

// 生成模拟搜索建议数据 - 保持您原有的逻辑
const generateSuggestList = (keyword) => {
    // 生成0-9个随机建议
    const count = Mock.Random.integer(0, 9);
    const list = [];

    for (let i = 0; i < count; i++) {
        const randomTitle = Mock.Random.title(2, 8);
        list.push(`${keyword}${randomTitle}`);
    }
    return list;
};

export const getSuggestList = async (keyword) => {
    // 在 Vercel 环境下使用前端生成的 mock 数据
    if (envConfig.isVercel) {
        return {
            code: 0,
            data: generateSuggestList(keyword)
        };
    }

    // 在开发环境和其他生产环境下使用 API 请求
    return axios.get(`/search?keyword=${encodeURIComponent(keyword)}`);
};

export const getHotList = async () => {
    // 在 Vercel 环境下使用固定的热词数据
    if (envConfig.isVercel) {
        return {
            code: 0,
            data: [
                { id: '101', keyword: "低卡食谱", count: "1280万热度" },
                { id: '102', keyword: "健身餐", count: "980万热度" },
                { id: '103', keyword: "素食", count: "750万热度" },
                { id: '104', keyword: "高蛋白早餐", count: "620万热度" },
                { id: '105', keyword: "减脂汤", count: "580万热度" },
                { id: '106', keyword: "鸡胸肉做法", count: "520万热度" },
                { id: '107', keyword: "沙拉搭配", count: "480万热度" },
                { id: '108', keyword: "低糖甜点", count: "430万热度" }
            ]
        };
    }

    // 在开发环境和其他生产环境下使用 API 请求
    return axios.get('/hotList');
};