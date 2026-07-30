import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AssetCatalog from './pages/AssetCatalog';
import DepartmentCatalog from './pages/DepartmentCatalog';
import Import from './pages/Import';
import Export from './pages/Export';
import Transfer from './pages/Transfer';
import Inventory from './pages/Inventory';
import RFIDIssue from './pages/RFIDIssue';
import RFIDPrint from './pages/RFIDPrint';
import SystemUser from './pages/SystemUser';
import SystemPrinter from './pages/SystemPrinter';
import SystemReport from './pages/SystemReport';
import InventorySummary from './pages/InventorySummary';

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
            <Route path="danh-muc/phong-ban" element={<DepartmentCatalog />} />
            <Route path="kho/nhap" element={<Import />} />
            <Route path="kho/xuat" element={<Export />} />
            <Route path="kho/dieu-chuyen" element={<Transfer />} />
            <Route path="rfid/in-the" element={<RFIDPrint />} />
            <Route path="rfid/phat-hanh" element={<RFIDIssue />} />
            <Route path="kiem-ke/thuc-hien" element={<Inventory />} />
            <Route path="kiem-ke/tong-hop" element={<InventorySummary />} />
            <Route path="he-thong/user" element={<SystemUser />} />
            <Route path="he-thong/may-in" element={<SystemPrinter />} />
            <Route path="he-thong/bao-cao" element={<SystemReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
