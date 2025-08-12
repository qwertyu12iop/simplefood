import { create } from 'zustand';

const initialMessages = [
    {
        id: 1,
        content:
            '您好！我是您的简食助手小简。我可以为您提供健康食谱、烹饪技巧、食材搭配等方面的专业建议。请问有什么可以帮您的吗？',
        role: 'assistant'
    }
];

const useChatStore = create((set) => ({
    messages: initialMessages,
    setMessages: (fn) =>
        set((state) => ({
            messages: typeof fn === 'function' ? fn(state.messages) : fn
        })),
    clearMessages: () => set({ messages: initialMessages })
}));

export default useChatStore;