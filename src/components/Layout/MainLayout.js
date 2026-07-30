import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, theme, Typography, Space } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ImportOutlined,
  ExportOutlined,
  SwapOutlined,
  ScanOutlined,
  FileDoneOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Bảng Điều Khiển',
    },
    {
      key: 'danhmuc',
      icon: <AppstoreOutlined />,
      label: 'Quản Lý Danh Mục',
      children: [
        { key: '/danh-muc/tai-san', label: 'Tài Sản / Vật Tư' },
        { key: '/danh-muc/phong-ban', label: 'Phòng Ban - Kho' },
      ],
    },
    {
      key: 'kho',
      icon: <SwapOutlined />,
      label: 'Nghiệp Vụ Kho',
      children: [
        { key: '/kho/nhap', icon: <ImportOutlined />, label: 'Nhập Kho' },
        { key: '/kho/xuat', icon: <ExportOutlined />, label: 'Xuất Kho' },
        { key: '/kho/dieu-chuyen', icon: <SwapOutlined />, label: 'Điều Chuyển' },
      ],
    },
    {
      key: 'rfid',
      icon: <ScanOutlined />,
      label: 'Quản Lý Thẻ RFID',
      children: [
        { key: '/rfid/in-the', label: 'In Tem Nhãn' },
        { key: '/rfid/phat-hanh', label: 'Phát Hành Thẻ' },
      ],
    },
    {
      key: 'kiemke',
      icon: <FileDoneOutlined />,
      label: 'Kiểm Kê',
      children: [
        { key: '/kiem-ke/thuc-hien', label: 'Phiếu Kiểm Kê' },
        { key: '/kiem-ke/tong-hop', label: 'Tổng Hợp Kiểm Kê' },
      ],
    },
    {
      key: 'hethong',
      icon: <SettingOutlined />,
      label: 'Hệ Thống',
      children: [
        { key: '/he-thong/user', label: 'Phân Quyền User' },
        { key: '/he-thong/may-in', label: 'Cấu Hình Máy In' },
        { key: '/he-thong/bao-cao', label: 'Báo Cáo' },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Đổi Mật Khẩu',
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Đăng Xuất',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === '2') {
      // Logout
      localStorage.removeItem('isAuthenticated');
      toast.success('Đã đăng xuất khỏi hệ thống', {
        duration: 3000,
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        width={260}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {collapsed ? (
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              TM
            </Title>
          ) : (
            <Title level={4} style={{ margin: 0, color: '#1890ff', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              TMTech PVGAS
            </Title>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            zIndex: 9,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
            style: { fontSize: '18px', cursor: 'pointer', transition: 'color 0.3s' },
          })}
          
          <Space size="large">
            <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 500 }}>Admin VFT</span>
              </div>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
