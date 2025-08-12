// src/pages/SearchResult/SearchResult.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar, Button } from 'react-vant';
import { ArrowLeft } from '@react-vant/icons';
import './SearchResult.module.css';

const SearchResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';

    return (
        <div className="result-container">
            <NavBar
                title="搜索结果"
                leftText="返回"
                leftArrow
                onClickLeft={() => navigate(-1)}
            />

            <div className="result-content">
                <div className="result-header">
                    <h2>搜索结果</h2>
                    <p>搜索关键词: <span className="keyword">{keyword}</span></p>
                </div>

                <div className="placeholder-content">
                    <div className="placeholder-image" />
                    <p>搜索结果页面开发中...</p>
                    <p>这里将显示与 <strong>{keyword}</strong> 相关的菜谱和美食</p>
                    <Button
                        type="primary"
                        round
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        返回搜索
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;