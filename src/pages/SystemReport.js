import React from 'react';
import { 
  Card, 
  Typography,
  Row,
  Col,
  Statistic,
  Button,
  DatePicker,
  Table,
  Space
} from 'antd';
import { 
  DownloadOutlined, 
  BarChartOutlined,
  FileExcelOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/plots';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const SystemReport = () => {

  // Mock data for charts
  const categoryData = [
    { type: 'Tài sản', value: 270 },
    { type: 'Vật tư', value: 150 },
    { type: 'CCDC', value: 80 },
  ];

  const pieConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    height: 300,
    autoFit: true,
  };

  const monthlyData = [
    { month: 'T1', type: 'Nhập', value: 30 },
    { month: 'T1', type: 'Xuất', value: 20 },
    { month: 'T2', type: 'Nhập', value: 45 },
    { month: 'T2', type: 'Xuất', value: 30 },
    { month: 'T3', type: 'Nhập', value: 60 },
    { month: 'T3', type: 'Xuất', value: 50 },
    { month: 'T4', type: 'Nhập', value: 40 },
    { month: 'T4', type: 'Xuất', value: 25 },
  ];

  const columnConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'value',
    colorField: 'type',
    group: true,
    height: 300,
    autoFit: true,
  };

  // Mock data for table
  const recentTransactions = [
    { key: '1', slip: 'TSN2200045', type: 'Nhập', date: '30/07/2026', items: 15, dept: 'Kho vật tư BR' },
    { key: '2', slip: 'TSX2200088', type: 'Xuất', date: '29/07/2026', items: 4, dept: 'Phòng TCKT' },
    { key: '3', slip: 'TDC2200012', type: 'Điều chuyển', date: '28/07/2026', items: 10, dept: 'Phòng ATMT' },
  ];

  const columns = [
    { title: 'Mã chứng từ', dataIndex: 'slip', key: 'slip', render: text => <b>{text}</b> },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Ngày', dataIndex: 'date', key: 'date' },
    { title: 'Số lượng TS', dataIndex: 'items', key: 'items' },
    { title: 'Phòng ban', dataIndex: 'dept', key: 'dept' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Hệ Thống Báo Cáo - Thống Kê</Title>
        <Space>
          <RangePicker format="DD/MM/YYYY" />
          <Button type="primary" icon={<DownloadOutlined />}>
            Tải Báo Cáo
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <Statistic title="Tổng Số Tài Sản (Web)" value={500} suffix="cái" valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <Statistic title="Đã Gắn Thẻ RFID" value={420} suffix="cái" valueStyle={{ color: '#52c41a', fontWeight: 'bold' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <Statistic title="Tổng Phiếu Nhập Tháng Này" value={14} valueStyle={{ color: '#faad14', fontWeight: 'bold' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <Statistic title="Tổng Phiếu Xuất Tháng Này" value={22} valueStyle={{ color: '#f5222d', fontWeight: 'bold' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Cơ cấu theo phân loại" variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ Nhập - Xuất theo tháng" variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<><BarChartOutlined /> Biến động giao dịch gần đây</>} 
        variant="borderless" 
        style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
        extra={
          <Space>
            <Button icon={<FileExcelOutlined />} size="small">Xuất Excel</Button>
            <Button icon={<PrinterOutlined />} size="small">In</Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={recentTransactions} pagination={false} size="middle" />
      </Card>
    </div>
  );
};

export default SystemReport;
