import axios from './config';
import { envConfig } from './config';
import Mock from 'mockjs';

// 生成首页feed流模拟数据
const generateFeedData = (tabId, page = 1) => {
    const pageSize = 10;
    const count = Mock.mock('@integer(20, 30)');
    const allItems = [];

    for (let i = 0; i < count; i++) {
        const imgHeight = Mock.mock('@integer(200, 400)');
        const imageUrl = Mock.Random.image(`300x${imgHeight}`, Mock.Random.color(), '#fff', 'png');
        allItems.push({
            id: Mock.mock('@id'),
            title: Mock.mock('@ctitle(3, 8)'),
            coverImg: imageUrl,
            author: Mock.mock('@cname'),
            aspectRatio: `300/${imgHeight}`,
            likes: Mock.mock('@integer(100, 1000)'),
            comments: Mock.mock('@integer(0, 100)'),
            description: Mock.mock('@csentence(10, 20)')
        });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = allItems.slice(start, end);
    const hasMore = end < allItems.length;

    return {
        code: 0,
        data: {
            tabId,
            list,
            page,
            pageSize,
            total: allItems.length,
            hasMore
        }
    };
};

// 获取首页Tab列表

export const getHomeTabs = async () => {
    // 在 Vercel 环境下使用固定的标签数据
    if (envConfig.isVercel) {
        return Promise.resolve({
            code: 0,
            data: [
                { id: '1', name: '今日推荐' },
                { id: '2', name: '减肥餐' },
                { id: '3', name: '早餐' },
                { id: '4', name: '午餐' },
                { id: '5', name: '晚餐' },
                { id: '6', name: '甜点' }
            ]
        });
    }

    // 在开发环境和其他生产环境下使用 API 请求
    return axios.get('/home/tabs').catch(error => {
        // 添加错误处理，开发环境返回模拟数据
        if (import.meta.env.DEV) {
            console.warn('API请求失败，返回模拟数据', error);
            return {
                code: 0,
                data: [
                    { id: '1', name: '今日推荐' },
                    { id: '2', name: '减肥餐' },
                    { id: '3', name: '早餐' },
                    { id: '4', name: '午餐' },
                    { id: '5', name: '晚餐' },
                    { id: '6', name: '甜点' }
                ]
            };
        }
        throw error;
    });
};
  

// 获取首页feed流数据
export const getHomeFeed = (tabId, page = 1) => {
    // 在 Vercel 环境下使用生成的模拟数据
    if (envConfig.isVercel) {
        return Promise.resolve(generateFeedData(tabId, page));
    }

    // 在开发环境和其他生产环境下使用 API 请求
    return axios.get('/home/feed', { params: { tab: tabId, page } });
};

// 收藏/取消收藏帖子
export const toggleCollect = (postId) => {
    // 在 Vercel 环境下简单返回成功
    if (envConfig.isVercel) {
        return Promise.resolve({ code: 0, message: '操作成功' });
    }

    // 在开发环境和其他生产环境下使用 API 请求
    return axios.post('/collect', { postId });
};