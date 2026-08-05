import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, message, Spin } from 'antd';
import { Pie } from '@ant-design/plots';
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    readyAssets: 0,
    maintenanceAssets: 0,
    warningAssets: 0,
    statuses: [],
    recentEvents: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/dashboard/stats');
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê từ máy chủ.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const config = {
    data: stats.statuses,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      text: 'value',
      position: 'outside',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Vị trí / Mã Phiếu',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" description="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Bảng Điều Khiển</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Tổng số thiết bị"
              value={stats.totalAssets}
              prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Thiết bị sẵn sàng"
              value={stats.readyAssets}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Đang bảo trì/Điều chuyển"
              value={stats.maintenanceAssets}
              prefix={<SyncOutlined spin style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Hỏng hóc/Cần chú ý"
              value={stats.warningAssets}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ trạng thái thiết bị" variant="borderless" style={{ borderRadius: 8, height: '100%' }}>
            {stats.statuses.length > 0 ? (
              <Pie {...config} />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu biểu đồ</div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Danh sách sự kiện gần đây" variant="borderless" style={{ borderRadius: 8, height: '100%' }}>
            <Table
              columns={columns}
              dataSource={stats.recentEvents}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

