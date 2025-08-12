import './App.css';
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import BlankLayout from '@/components/BlankLayout';
import Loading from './components/Loading';

// Tab 页
const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const Kitchen = lazy(() => import('@/pages/Kitchen'));
const Profile = lazy(() => import('@/pages/Profile'));
const Chat = lazy(() => import('@/pages/Chat'));

// 非 Tab 页
const Detail = lazy(() => import('@/pages/Detail'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/post" element={<Kitchen />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<BlankLayout />}>
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
