// src/store/homeStore.js
import { create } from 'zustand';

const useHomeStore = create((set) => ({
    activeTab: '',
    setActiveTab: (tab) => set({ activeTab: tab }),

    tabs: [],
    setTabs: (tabs) => set({ tabs }),

    tabData: {},
    setTabData: (tabId, patch) =>
        set((state) => {
            const currentData = state.tabData[tabId] || {
                list: [],
                page: 1,
                hasMore: true,
                loading: false,
                loadingMore: false
            };

            const newData = typeof patch === 'function'
                ? patch(currentData)
                : patch;

            return {
                tabData: {
                    ...state.tabData,
                    [tabId]: {
                        ...currentData,
                        ...newData
                    }
                }
            };
        }),

    clearTabData: (tabId) =>
        set((state) => {
            const next = { ...state.tabData };
            delete next[tabId];
            return { tabData: next };
        }),
}));

export default useHomeStore;