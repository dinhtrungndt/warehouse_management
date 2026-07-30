import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { Pie } from '@ant-design/plots';
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  const data = [
    { type: 'Đang rảnh', value: 45 },
    { type: 'Đang sử dụng', value: 30 },
    { type: 'Đang bảo trì', value: 15 },
    { type: 'Hỏng hóc', value: 10 },
  ];

  const config = {
    data,
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
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const tableData = [
    { key: '1', type: 'Nhập kho', location: 'Kho A', time: '2026-07-30 08:00' },
    { key: '2', type: 'Xuất kho', location: 'Kho B', time: '2026-07-30 08:15' },
    { key: '3', type: 'Cảnh báo RFID', location: 'Cổng 1', time: '2026-07-30 09:10' },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Bảng Điều Khiển</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Tổng số thiết bị"
              value={1128}
              prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Thiết bị sẵn sàng"
              value={930}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Đang bảo trì"
              value={112}
              prefix={<SyncOutlined spin style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic
              title="Cần chú ý"
              value={86}
              prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Biểu đồ trạng thái thiết bị" bordered={false} style={{ borderRadius: 8, height: '100%' }}>
            <Pie {...config} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Danh sách sự kiện gần đây" bordered={false} style={{ borderRadius: 8, height: '100%' }}>
            <Table columns={columns} dataSource={tableData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
