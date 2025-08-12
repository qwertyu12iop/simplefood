import { Outlet } from 'react-router-dom';

// 基础空白布局组件（无底部导航栏）
const BlankLayout = () => {
  return (
    <div className="blank-layout">
      <Outlet />
    </div>
  );
};

export default BlankLayout; // 添加默认导出