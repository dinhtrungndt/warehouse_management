import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AssetCatalog from './pages/AssetCatalog';

const EmptyPage = ({ title }) => (
  <div style={{ padding: 24, background: '#fff', minHeight: 360, borderRadius: 8 }}>
    <h2>{title}</h2>
    <p>Chức năng đang được phát triển...</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: `'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
        },
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="danh-muc/tai-san" element={<AssetCatalog />} />
            <Route path="danh-muc/phong-ban" element={<EmptyPage title="Danh Mục Phòng Ban - Kho" />} />
            <Route path="kho/nhap" element={<EmptyPage title="Nhập Kho" />} />
            <Route path="kho/xuat" element={<EmptyPage title="Xuất Kho" />} />
            <Route path="kho/dieu-chuyen" element={<EmptyPage title="Điều Chuyển Nhanh" />} />
            <Route path="rfid/in-the" element={<EmptyPage title="In Tem Nhãn Tag RFID" />} />
            <Route path="rfid/phat-hanh" element={<EmptyPage title="Phát Hành Tag ID RFID" />} />
            <Route path="kiem-ke/thuc-hien" element={<EmptyPage title="Kiểm Kê Tài Sản" />} />
            <Route path="kiem-ke/tong-hop" element={<EmptyPage title="Tổng Hợp Kiểm Kê" />} />
            <Route path="he-thong/user" element={<EmptyPage title="Phân Quyền User" />} />
            <Route path="he-thong/may-in" element={<EmptyPage title="Cấu Hình Máy In Zebra" />} />
            <Route path="he-thong/bao-cao" element={<EmptyPage title="Hệ Thống Báo Cáo" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
