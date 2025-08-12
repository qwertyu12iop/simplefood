import { useState, useEffect } from 'react';
import { Tabbar } from 'react-vant';
import { HomeO, CommentO, GiftO,  UserO } from '@react-vant/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// 菜单栏配置
const tabs = [
    { icon: <HomeO />, title: '首页', path: '/home' },
    { icon: <CommentO />, title: '智能聊天', path: '/chat' },
    { icon: <GiftO />, title: '创意厨房', path: '/post' },
    { icon: <UserO />, title: '个人中心', path: '/profile' }
];

const MainLayout = () => {
    const [active, setActive] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const index = tabs.findIndex(
            tab => location.pathname.startsWith(tab.path)
        );
        setActive(index);
    }, [location.pathname]);

    return (
        <div className='flex flex-col h-screen'>
            {/* 内容区域 - 添加 padding-bottom 避免被 Tabbar 遮挡 */}
            <div className='flex-1 pb-[60px] overflow-y-auto'>
                <Outlet />
            </div>

            {/* Tabbar - 固定在底部 */}
            <div className='fixed bottom-0 w-full z-10'>
                <Tabbar
                    value={active}
                    onChange={(key) => {
                        setActive(key);
                        navigate(tabs[key].path);
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tabbar.Item key={index} icon={tab.icon}>
                            {tab.title}
                        </Tabbar.Item>
                    ))}
                </Tabbar>
            </div>
        </div>
    );
};

export default MainLayout;