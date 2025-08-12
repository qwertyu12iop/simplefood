import { useEffect, useRef, useState } from 'react';
import { Button, Input, Loading, Dialog } from 'react-vant';
import useTitle from '@/hooks/useTitle';
import { chat } from '@/llm';
import styles from './chat.module.css';
import { ChatO, UserO, ArrowLeft, DeleteO } from '@react-vant/icons';
import { useNavigate } from 'react-router-dom';
import useChatStore from '@/store/useChatStore';

const Chat = () => {
    useTitle('简食助手');
    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // 从 Zustand 获取全局消息
    const messages = useChatStore((state) => state.messages);
    const setMessages = useChatStore((state) => state.setMessages);
    const clearMessages = useChatStore((state) => state.clearMessages);

    const quickQuestions = [
        "如何做一道健康的家常菜？",
        "低卡路里的晚餐推荐",
        "如何保存蔬菜的新鲜度？",
        "简单快捷的早餐食谱",
        "素食的营养搭配建议",
        "健康替代传统调味品"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (content) => {
        if (!content.trim()) return;

        setIsSending(true);
        const userMessage = {
            role: 'user',
            content: content,
            id: Date.now()
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const newMessage = await chat([userMessage]);
            if (newMessage.code === 0) {
                setMessages((prev) => [
                    ...prev,
                    { ...newMessage.data, id: Date.now() + 1 }
                ]);
            } else {
                console.log(newMessage.msg || '获取回复失败');
            }
        } catch (error) {
            console.error('聊天错误:', error);
            console.log('服务异常，请稍后再试');
        } finally {
            setIsSending(false);
        }
    };

    const handleChat = async () => {
        if (text.trim() === "") {
            console.log('请输入内容');
            return;
        }
        const currentText = text;
        setText("");
        await sendMessage(currentText);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    };

    const confirmClear = () => {
        clearMessages();
        setShowClearDialog(false);
        console.log('聊天记录已清空');
    };

    const cancelClear = () => {
        setShowClearDialog(false);
    };

    const sendQuickQuestion = (question) => {
        sendMessage(question);
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.header}>
                <Button
                    icon={<ArrowLeft />}
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                />
                <h2 className={styles.title}>简食助手</h2>
                <Button
                    icon={<DeleteO />}
                    onClick={() => setShowClearDialog(true)}
                    className={styles.clearButton}
                />
            </div>

            <div className={styles.chatArea}>
                {messages.length === 1 && (
                    <div className={styles.quickQuestions}>
                        <h3 className={styles.quickTitle}>猜你想问：</h3>
                        <div className={styles.quickGrid}>
                            {quickQuestions.map((question, index) => (
                                <div
                                    key={index}
                                    className={styles.quickItem}
                                    onClick={() => sendQuickQuestion(question)}
                                >
                                    {question}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${msg.role === 'user'
                                ? styles.userMessage
                                : styles.assistantMessage
                            }`}
                    >
                        <div className={styles.avatar}>
                            {msg.role === 'assistant' ? (
                                <div className={styles.assistantAvatar}>
                                    <ChatO color="#fff" />
                                </div>
                            ) : (
                                <div className={styles.userAvatar}>
                                    <UserO color="#fff" />
                                </div>
                            )}
                        </div>
                        <div className={styles.messageContent}>
                            {msg.content.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {isSending && (
                    <div className={`${styles.message} ${styles.assistantMessage}`}>
                        <div className={styles.avatar}>
                            <div className={styles.assistantAvatar}>
                                <ChatO color="#fff" />
                            </div>
                        </div>
                        <div className={styles.messageContent}>
                            <Loading type="spinner" size="20px" />
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.inputArea}>
                <Input
                    value={text}
                    onChange={setText}
                    placeholder="输入食谱或烹饪问题..."
                    className={styles.input}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    autosize
                    type="textarea"
                />
                <Button
                    type="primary"
                    onClick={handleChat}
                    className={styles.sendButton}
                    disabled={isSending}
                >
                    发送
                </Button>
            </div>

            <Dialog
                visible={showClearDialog}
                title="确认清空"
                message="确定要清空聊天记录吗？此操作不可恢复"
                confirmButtonText="清空"
                cancelButtonText="取消"
                confirmButtonColor="#ff4d4f"
                onConfirm={confirmClear}
                onCancel={cancelClear}
            />
        </div>
    );
};

export default Chat;
