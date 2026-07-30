import React from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Typography,
  Tag,
  DatePicker,
  Select
} from 'antd';
import { 
  SearchOutlined, 
  FileExcelOutlined,
  PrinterOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Mock Data
const generateSummary = () => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    const isMatched = i % 4 === 0;
    const diff = isMatched ? 0 : (i % 2 === 0 ? -1 : 2);
    
    data.push({
      key: i.toString(),
      code: `KK2300${(i % 5) + 1}`, // groups of sessions
      assetId: `VTT010${i.toString().padStart(3, '0')}C`,
      name: `Tài sản / Vật tư Demo ${i}`,
      department: i % 2 === 0 ? 'Phòng TCKT' : 'Kho vật tư BR',
      sysCount: 10 + i,
      scanCount: 10 + i + diff,
      diff: diff
    });
  }
  return data;
};

const InventorySummary = () => {
  const data = generateSummary();

  const columns = [
    { title: 'Kỳ kiểm kê', dataIndex: 'code', key: 'code', render: text => <strong style={{ color: '#13c2c2' }}>{text}</strong> },
    { title: 'Mã tài sản', dataIndex: 'assetId', key: 'assetId' },
    { title: 'Tên tài sản / Thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Kho / Vị trí', dataIndex: 'department', key: 'department' },
    { title: 'Sổ sách', dataIndex: 'sysCount', key: 'sysCount', align: 'center' },
    { title: 'Thực tế', dataIndex: 'scanCount', key: 'scanCount', align: 'center', render: text => <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{text}</span> },
    { 
      title: 'Chênh lệch', 
      key: 'diff',
      align: 'center',
      render: (_, record) => {
        if (record.diff === 0) return <Tag color="success">Khớp</Tag>;
        if (record.diff < 0) return <Tag color="error">Thiếu {Math.abs(record.diff)}</Tag>;
        return <Tag color="warning">Thừa {record.diff}</Tag>;
      }
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Báo Cáo Tổng Hợp Kiểm Kê</Title>
        <Space>
          <Button icon={<FileExcelOutlined />} type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>Xuất Excel</Button>
          <Button icon={<PrinterOutlined />}>In Báo Cáo</Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Input 
            placeholder="Tìm kiếm tài sản..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 250 }}
            allowClear
          />
          <Select placeholder="Chọn kỳ kiểm kê" style={{ width: 200 }} allowClear>
            <Option value="KK23001">KK23001 (Tháng 7)</Option>
            <Option value="KK23002">KK23002 (Tháng 8)</Option>
          </Select>
          <Select placeholder="Lọc trạng thái" style={{ width: 150 }} allowClear>
            <Option value="match">Đã khớp (0)</Option>
            <Option value="missing">Thiếu (&lt; 0)</Option>
            <Option value="surplus">Thừa (&gt; 0)</Option>
          </Select>
          <RangePicker format="DD/MM/YYYY" placeholder={['Từ ngày', 'Đến ngày']} />
        </div>

        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 10, showTotal: total => `Tổng cộng ${total} kết quả` }} 
          size="middle"
        />
      </Card>
    </div>
  );
};

export default InventorySummary;
