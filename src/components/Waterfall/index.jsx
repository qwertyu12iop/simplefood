// src/components/Waterfall/index.jsx
import React, { useRef, useEffect } from 'react';
import LazyImage from '../LazyImage';
import styles from './waterfall.module.css';
import { StarO } from '@react-vant/icons';

const Waterfall = ({ items, onCollect, onItemClick }) => {
    // 创建两列数据
    const leftColumn = [];
    const rightColumn = [];

    items.forEach((item, index) => {
        if (index % 2 === 0) {
            leftColumn.push(item);
        } else {
            rightColumn.push(item);
        }
    });

    return (
        <div className={styles.waterfallContainer}>
            <div className={styles.column}>
                {leftColumn.map(item => (
                    <WaterfallItem
                        key={item.id}
                        item={item}
                        onCollect={onCollect}
                        onItemClick={onItemClick}
                    />
                ))}
            </div>
            <div className={styles.column}>
                {rightColumn.map(item => (
                    <WaterfallItem
                        key={item.id}
                        item={item}
                        onCollect={onCollect}
                        onItemClick={onItemClick}
                    />
                ))}
            </div>
        </div>
    );
};

const WaterfallItem = ({ item, onCollect, onItemClick }) => {
    return (
        <div
            className={styles.item}
            onClick={() => onItemClick(item.id)}
        >
            <div className={styles.imageWrapper}>
                <LazyImage
                    src={item.coverImg} // 添加src属性传递图片URL
                    color={item.coverColor}
                    aspectRatio={item.aspectRatio}
                    alt={item.title}
                />
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.meta}>
                    <span className={styles.author}>by {item.author}</span>
                    <div className={styles.stats}>
                        <button
                            className={`${styles.collectBtn} ${item.collected ? styles.collected : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onCollect(item.id);
                            }}
                        >
                            <StarO fontSize={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };
export default Waterfall;