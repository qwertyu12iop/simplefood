import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBox.module.css';

const SearchBox = ({
    value,
    onChange,
    onSearch,
    onFocus,
    autoFocus = false,
    showBackButton = true
}) => {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        if (value.trim()) {
            onSearch(value.trim());
        }
    };

    return (
        <div className={styles.searchContainer}>
            {showBackButton && (
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    &lt;
                </button>
            )}

            <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={onFocus}
                    placeholder="搜索美食、菜谱、食材..."
                    className={styles.searchInput}
                
                />
                {value && (
                    <button
                        className={styles.clearButton}
                        onClick={() => onChange('')}
                    >
                        ×
                    </button>
                )}
            </div>

            <button
                className={styles.searchButton}
                onClick={handleSearch}
            >
                搜索
            </button>
        </div>
    );
};

export default SearchBox;