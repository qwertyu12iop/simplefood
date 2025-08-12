const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions';
const KIM_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export const chat = async (
    messages,
    api_url = DEEPSEEK_CHAT_API_URL,
    api_key = import.meta.env.VITE_DEEPSEEK_API_KEY,
    model = 'deepseek-chat',
    signal = null // 添加取消信号参数
) => {
    try {
        const healthPrompt = { role: "system", content: "你是一位专业的健康顾问..." };

        const response = await fetch(api_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api_key}` },
            body: JSON.stringify({ model, messages: [healthPrompt, ...messages], stream: false, temperature: 0.7, max_tokens: 1000 }),
            signal // 传递取消信号
        });
        const data = await response.json();
        return {
            code: 0,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content
            }
        }
    } catch (err) {
        console.error('API请求错误:', err);
        return {
            code: 1,
            msg: '服务暂时不可用，请稍后再试'
        }
    }
}

export const kimiChat = async (messages) => {
    const res = await chat(
        messages,
        KIM_CHAT_API_URL,
        import.meta.env.VITE_KIMI_API_KEY,
        'moonshot-v1-auto'
    )
    return res;
}