// src/pages/Search/Search.jsx
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Cell, Tag, Button } from 'react-vant';
import { ArrowLeft, FireO, ClockO, DeleteO } from '@react-vant/icons';
import useSearchStore from '@/store/useSearchStore';
import { debounce } from '@/utils';
import styles from './search.module.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const {
    query,
    hotList,
    suggestList,
    searchHistory,
    isLoading,
    error,
    fetchHotList,
    fetchSuggestList,
    addSearchHistory,
    clearSearchHistory
  } = useSearchStore();

  const [searchValue, setSearchValue] = React.useState(query);

  useEffect(() => {
    fetchHotList();
  }, [fetchHotList]);

  useEffect(() => {
    if (error) {
      // Toast.fail(error);
      console.log(error);

    }
  }, [error]);

  const debouncedFetchSuggest = useCallback(
    debounce((keyword) => {
      fetchSuggestList(keyword);
    }, 300),
    [fetchSuggestList]
  );

  const handleSearch = (val = searchValue) => {
    const value = val.trim();
    if (!value) {
      // Toast.info('请输入搜索内容');
      console.log('请输入搜索内容');
      return;
    }
    addSearchHistory(value);
    navigate(`/search-result?keyword=${encodeURIComponent(value)}`);
  };

  const handleClear = () => {
    setSearchValue('');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    handleSearch(suggestion);
  };

  const handleHotSearchClick = (keyword) => {
    setSearchValue(keyword);
    handleSearch(keyword);
  };

  const handleHistoryClick = (history) => {
    setSearchValue(history);
    handleSearch(history);
  };

  return (
    <div className={styles.searchContainer}>
      {/* 顶部搜索栏 */}
      <div className={styles.searchHeader}>
        <div className={styles.backButton} onClick={() => { setSearchValue('') ;navigate(-1); }}>
          <ArrowLeft fontSize={20} color="#4a6d60" />
        </div>
        <div className={styles.searchInputWrapper}>
          <Search
            value={searchValue}
            placeholder="搜索美食、菜谱、食材..."
            onChange={(val) => {
              setSearchValue(val);
              debouncedFetchSuggest(val);
            }}
            onSearch={handleSearch}
            onClear={handleClear}
            shape="round"
            background="#f9fbf8"
          />
        </div>
        <Button
          className={styles.searchButton}
          type="primary"
          size="small"
          onClick={() => handleSearch()}
        >
          搜索
        </Button>
      </div>

      {/* 内容区域 */}
      <div className={styles.searchContent}>
        {searchValue ? (
          <div className={styles.suggestionsContainer}>
            {isLoading ? (
              <div className={styles.loading}>加载中...</div>
            ) : suggestList.length > 0 ? (
              <>
                <div className={styles.sectionTitle}>搜索建议</div>
                {suggestList.map((suggestion, index) => (
                  <Cell
                    key={index}
                    title={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={styles.suggestionItem}
                    titleStyle={{ color: '#4a6d60' }}
                  />
                ))}
              </>
            ) : (
              <div className={styles.emptyState}>没有找到相关建议</div>
            )}
          </div>
        ) : (
          <>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FireO color="#e67e22" />
                <span className={styles.sectionTitle}>热门搜索</span>
              </div>
              <div className={styles.hotTags}>
                {hotList.map(item => (
                  <Tag
                    key={item.id}
                    color="#f0f7f4"
                    textColor="#4a6d60"
                    className={styles.hotTag}
                    onClick={() => handleHotSearchClick(item.keyword)}
                  >
                    {item.keyword}
                    <span className={styles.hotCount}>{item.count}</span>
                  </Tag>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <ClockO color="#3498db" />
                <span className={styles.sectionTitle}>搜索历史</span>
                {searchHistory.length > 0 && (
                  <div
                    className={styles.clearHistory}
                    onClick={clearSearchHistory}
                  >
                    <DeleteO fontSize={14} color="#95a5a6" />
                    <span>清空</span>
                  </div>
                )}
              </div>
              {searchHistory.length > 0 ? (
                <div className={styles.historyList}>
                  {searchHistory.map((item, index) => (
                    <Cell
                      key={index}
                      title={item}
                      icon={<ClockO color="#95a5a6" />}
                      onClick={() => handleHistoryClick(item)}
                      className={styles.historyItem}
                      titleStyle={{ color: '#4a6d60' }}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyHistory}>暂无搜索历史</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
