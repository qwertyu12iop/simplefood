// src/pages/Home/index.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Tabs } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import useTitle from '@/hooks/useTitle';
import Waterfall from '@/components/Waterfall';
import { getHomeTabs, getHomeFeed } from '@/api/home';
import styles from './home.module.css';
import useHomeStore from '@/store/homeStore';

const defaultTabState = { list: [], page: 1, hasMore: true, loading: false, loadingMore: false };

const Home = () => {
  useTitle('简食首页');
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  // 从 store 获取状态
  const activeTab = useHomeStore((s) => s.activeTab);
  const setActiveTab = useHomeStore((s) => s.setActiveTab);
  const tabs = useHomeStore((s) => s.tabs);
  const setTabs = useHomeStore((s) => s.setTabs);
  const tabData = useHomeStore((s) => s.tabData);
  const setTabData = useHomeStore((s) => s.setTabData);

  // 获取 Tab 列表
  useEffect(() => {
    if (tabs && tabs.length > 0) return;

    const fetchTabs = async () => {
      try {
        const res = await getHomeTabs();
        if (res && res.code === 0 && Array.isArray(res.data)) {
          setTabs(res.data);
          if (res.data.length > 0) {
            setActiveTab(String(res.data[0].id));
          }
        }
      } catch (err) {
        console.error('getHomeTabs error', err);
      }
    };

    fetchTabs();
  }, [tabs, setTabs, setActiveTab]);

  // 获取数据
  const fetchData = useCallback(
    async (reset = false) => {
      if (!activeTab) return;

      const currentState = tabData[activeTab] || defaultTabState;

      // 防止重复加载
      if ((reset && currentState.loading) ||
        (!reset && (currentState.loadingMore || !currentState.hasMore))) {
        return;
      }

      // 设置加载状态
      setTabData(activeTab, {
        ...currentState,
        loading: reset,
        loadingMore: !reset
      });

      try {
        const pageToRequest = reset ? 1 : currentState.page;
        const res = await getHomeFeed(Number(activeTab), pageToRequest);

        if (res?.code === 0) {
          const list = res.data?.list?.map(item => ({
            ...item,
            coverColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
          })) || [];

          setTabData(activeTab, {
            list: reset ? list : [...(currentState.list || []), ...list],
            page: reset ? 2 : currentState.page + 1,
            hasMore: !!res.data?.hasMore,
            loading: false,
            loadingMore: false
          });
        }
      } catch (err) {
        console.error('fetchData error', err);
        setTabData(activeTab, {
          ...currentState,
          loading: false,
          loadingMore: false
        });
      }
    },
    [activeTab, tabData, setTabData]
  );

  // 切换标签时加载数据
  useEffect(() => {
    if (activeTab) {
      const current = tabData[activeTab];
      if (!current || current.list.length === 0) {
        fetchData(true);
      }
    }
  }, [activeTab, tabData, fetchData]);

  // 无限滚动
  useEffect(() => {
    const node = bottomRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchData();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchData, activeTab]);

  const handleSearchClick = () => navigate('/search');

  const handleCollect = (id) => {
    const current = tabData[activeTab] || defaultTabState;
    const nextList = current.list.map(item =>
      item.id === id ? { ...item, collected: !item.collected } : item
    );
    setTabData(activeTab, { ...current, list: nextList });
  };

  const handleItemClick = (id) => navigate(`/detail/${id}`);

  // 骨架屏渲染
  const renderSkeleton = () => (
    <div className={styles.skeletonContainer}>
      {[...Array(2)].map((_, colIndex) => (
        <div key={colIndex} className={styles.skeletonColumn}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonTextShort}></div>
              <div className={styles.skeletonMeta}>
                <div className={styles.skeletonCircle}></div>
                <div className={styles.skeletonButton}></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const currentData = activeTab ? (tabData[activeTab] || defaultTabState) : defaultTabState;
  const isLoadingInitialData = tabs.length === 0 || (currentData.loading && currentData.list.length === 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.brand}>简食</h1>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBox} onClick={handleSearchClick}>
          <div className={styles.searchPlaceholder}>
            <span className={styles.searchIcon}>🔍</span>
            搜索美食、菜谱、食材...
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {tabs.length > 0 ? (
          <Tabs
            active={activeTab}
            onChange={setActiveTab}
            lineWidth={20}
            lineHeight={3}
            color="#00b578"
            swipeable
          >
            {tabs.map((tab) => (
              <Tabs.TabPane
                key={tab.id}
                name={String(tab.id)}
                title={tab.name}
              />
            ))}
          </Tabs>
        ) : (
          <div className={styles.tabsLoading}>加载中...</div>
        )}
      </div>

      <div className={styles.content}>
        {isLoadingInitialData ? (
          renderSkeleton()
        ) : currentData.list.length > 0 ? (
          <>
            <Waterfall
              items={currentData.list}
              onCollect={handleCollect}
              onItemClick={handleItemClick}
            />
            <div ref={bottomRef} className={styles.loadMoreTrigger}>
              {currentData.loadingMore && (
                <div className={styles.loadingMore}>加载中...</div>
              )}
              {!currentData.hasMore && (
                <div className={styles.noMore}>没有更多内容了</div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🍽️</div>
            <p>暂无数据</p>
            <button
              className={styles.refreshButton}
              onClick={() => fetchData(true)}
            >
              刷新页面
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;