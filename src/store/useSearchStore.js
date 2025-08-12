// src/store/useSearchStore.js
import {create} from 'zustand';
import { getSuggestList, getHotList } from '@/api/search';

// 创建搜索状态存储
const useSearchStore = create((set, get) => ({
    // 状态变量
    query: '', // 当前搜索关键词
    hotList: [], // 热门搜索列表
    suggestList: [], // 搜索建议列表
    searchHistory: [], // 搜索历史记录
    isLoading: false, // 加载状态
    error: null, // 错误信息

    // 获取热门搜索列表
    fetchHotList: async () => {
        set({ isLoading: true, error: null });

        try {
            const res = await getHotList();
            if (res.code === 0) {
                set({
                    hotList: res.data,
                    isLoading: false
                });
            } else {
                set({
                    error: res.msg || '获取热门搜索失败',
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('获取热门搜索失败:', error);
            set({
                error: '网络请求失败，请稍后重试',
                isLoading: false
            });
        }
    },

    // 获取搜索建议
    fetchSuggestList: async (keyword) => {
        if (!keyword) {
            set({ suggestList: [] });
            return;
        }

        set({
            query: keyword,
            isLoading: true,
            error: null
        });

        try {
            const res = await getSuggestList(keyword);
            if (res.code === 0) {
                set({
                    suggestList: res.data,
                    isLoading: false
                });
            } else {
                set({
                    error: res.msg || '获取搜索建议失败',
                    isLoading: false,
                    suggestList: []
                });
            }
        } catch (error) {
            console.error('获取搜索建议失败:', error);
            set({
                error: '网络请求失败，请稍后重试',
                isLoading: false,
                suggestList: []
            });
        }
    },

    // 添加搜索历史
    addSearchHistory: (keyword) => {
        if (!keyword) return;

        set(state => {
            // 避免重复添加
            const newHistory = [
                keyword,
                ...state.searchHistory.filter(item => item !== keyword)
            ];

            // 最多保留10条历史记录
            return {
                searchHistory: newHistory.slice(0, 10)
            };
        });
    },

    // 清除搜索历史
    clearSearchHistory: () => {
        set({ searchHistory: [] });
    },

    // 清除错误信息
    clearError: () => {
        set({ error: null });
    }
}));

export default useSearchStore;