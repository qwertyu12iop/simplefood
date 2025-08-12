import { memo } from 'react';
import styles from './loading.module.css';

const Loading = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
            </div>
            <p className={styles.text}>简食 · 健康生活</p>
        </div>
    );
};

export default memo(Loading);