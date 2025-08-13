import React, { useEffect, useRef, useState } from 'react';
import styles from './coze.module.css';
import useTitle from '@/hooks/useTitle';

export default function CreativeKitchen() {
    useTitle('创意厨房');

    const [inputValue, setInputValue] = useState('');
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const patToken = import.meta.env.VITE_PAT_TOKEN;
    const workflowUrl = 'https://api.coze.cn/v1/workflow/run';
    const workflow_id = '7537130191790571529';

    // 精选健康食材列表，数量适中避免过多滚动
    const availableIngredients = [
        '鸡蛋', '萝卜', '土豆', '番茄', '黄瓜', '菠菜', '洋葱', '胡萝卜', '玉米',
        '白菜', '芹菜', '韭菜', '西兰花', '青椒', '红椒', '豆角', '茄子',
        '生菜', '油菜', '豆腐', '豆芽', '猪肉', '牛肉',
        '鸡肉', '鱼肉', '虾', '海带', '红薯', '山药'
    ];

    const extractScore = (text) => {
        const scoreMatch = text && text.match(/(\d+(\.\d+)?)分/);
        if (scoreMatch) return Number(scoreMatch[1]);

        const colonMatch = text && text.match(/分数[:：]\s*(\d+(\.\d+)?)/);
        return colonMatch ? Number(colonMatch[1]) : null;
    };

    const addToInput = (name) => {
        const ingredients = inputValue.split(',').map(s => s.trim()).filter(Boolean);
        const isSelected = ingredients.includes(name);

        // 如果已选中则移除，否则添加
        let newIngredients;
        if (isSelected) {
            newIngredients = ingredients.filter(ingredient => ingredient !== name);
        } else {
            // 未选中且数量未满才添加
            if (ingredients.length >= 5) return;
            newIngredients = [...ingredients, name];
        }

        const newInputValue = newIngredients.join(',');
        setInputValue(newInputValue);
        setSelected(newIngredients);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        const ingredients = value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5);
        setSelected(ingredients);
    };

    const runWorkflow = async () => {
        if (loading) return;
        if (!selected.length) return setResult({ error: '请先选择 1-5 种食材' });

        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(workflowUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${patToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ workflow_id, parameters: { input: selected.join('，') } }),
            });

            if (!res.ok) throw new Error('请求失败');
            const { code, data, msg } = await res.json();
            if (code !== 0) throw new Error(msg || '工作流执行失败');

            let text = typeof data === 'string' ? tryParseJSON(data)?.text || data : (data?.text || JSON.stringify(data));
            text = text.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim();

            const score = extractScore(text);
            const sharpComment = text.replace(/.*犀利点评[:：]/s, '').trim();
            setResult({ score, comment: sharpComment });
        } catch (err) {
            setResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    const tryParseJSON = (str) => {
        try { return JSON.parse(str); } catch { return null; }
    };

    const ScoreNumber = ({ value }) => {
        const [num, setNum] = useState(0);
        const rafRef = useRef(null);

        useEffect(() => {
            if (value == null) return setNum(0);
            let start = null;
            const duration = 700;
            const from = 0;
            const to = Number(value);

            const step = (t) => {
                if (!start) start = t;
                const progress = Math.min((t - start) / duration, 1);
                setNum((from + (to - from) * progress).toFixed(1));
                if (progress < 1) rafRef.current = requestAnimationFrame(step);
            };

            rafRef.current = requestAnimationFrame(step);
            return () => cancelAnimationFrame(rafRef.current);
        }, [value]);

        return <span className={styles.scoreAnimated}>{num}</span>;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <span>🍃 创意厨房</span>
                </div>
                <p className={styles.subtitle}>邀请1~5位‘食材嘉宾’，接受美味（或翻车）鉴定！</p>
            </header>

            <section className={styles.selectorSection}>
                <div className={styles.inputRow}>
                    <input
                        className={styles.inputField}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="输入食材（逗号分隔）或点击下方食材"
                    />
                </div>

                <div className={styles.chipsWrap}>
                    {availableIngredients.map(name => {
                        const active = selected.includes(name);
                        return (
                            <button
                                key={name}
                                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                                onClick={() => addToInput(name)}
                                aria-pressed={active}
                            >
                                <span className={styles.chipText}>{name}</span>
                                <span className={styles.chipBadge}>{active ? '✓' : '+'}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.actionRow}>
                    <div className={styles.hint}>已选 <strong>{selected.length}</strong> / 5</div>
                    <button className={styles.primaryBtn} onClick={runWorkflow} disabled={loading}>
                        {loading ? 'AI 思考中...' : '开始生成'}
                    </button>
                </div>
            </section>

            <section className={styles.resultSection}>
                {!result && (
                    <div className={styles.placeholderCard}>
                        <div className={styles.placeholderTitle}>等待鉴赏...</div>
                    </div>
                )}

                {result && result.error && (
                    <div className={styles.errorCard}>⚠️ {result.error}</div>
                )}

                {result && !result.error && (
                    <div className={styles.aiCard}>
                        <div className={styles.scoreBlock}>
                            <div className={styles.scoreLabel}>评分</div>
                            <div className={styles.scoreValueWrap}>
                                <ScoreNumber value={result.score ?? 0} />
                                <span className={styles.scoreOutOf}>/10</span>
                            </div>
                        </div>

                        <div className={styles.commentBox}>
                            <div className={styles.commentHeader}>评价</div>
                            <pre className={styles.commentText}>{result.comment}</pre>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}