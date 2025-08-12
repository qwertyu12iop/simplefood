// src/api/home.js
import axios from './config';

// 获取首页Tab列表
export const getHomeTabs = () => {
    return axios.get('/home/tabs');
};

// 获取首页feed流数据
export const getHomeFeed = (tabId) => {
    return axios.get('/home/feed', { params: { tab: tabId } });
};

// 收藏/取消收藏帖子
export const toggleCollect = (postId) => {
    return axios.post('/collect', { postId });
};