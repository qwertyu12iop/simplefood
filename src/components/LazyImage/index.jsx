// src/components/LazyImage.jsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './LazyImage.module.css';

const LazyImage = ({ src, aspectRatio = '300/200', alt }) => {
    const containerRef = useRef(null);
    const [inView, setInView] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '100px 0px',
                threshold: 0.01
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // 当进入视口且未加载时，开始加载图片
    useEffect(() => {
        if (inView && !imageLoaded && src) {
            const img = new Image();
            img.src = src;
            img.onload = () => setImageLoaded(true);
        }
    }, [inView, src, imageLoaded]);

    const calculatePadding = () => {
        try {
            if (!aspectRatio) return '66.67%';
            const [width, height] = aspectRatio.split('/').map(Number);
            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                return '66.67%';
            }
            return `${(height / width) * 100}%`;
        } catch (error) {
            return '66.67%';
        }
    };

    const paddingBottom = calculatePadding();

    return (
        <div
            ref={containerRef}
            className={styles.imageContainer}
            style={{ paddingBottom }}
        >
            {/* 图片加载前的颜色占位 */}
            {!imageLoaded && inView && (
                <div
                    className={styles.pixelBlock}
                    style={{ backgroundColor:'#ffffff' }}

                />
            )}

            {/* 图片加载完成后的真实图片 */}
            {imageLoaded && (
                <img
                    className={`${styles.realImage} ${styles.loaded}`}
                    src={src}
                    alt={alt || '图片'}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default LazyImage;