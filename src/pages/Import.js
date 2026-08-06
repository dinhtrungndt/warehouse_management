import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Drawer, 
  Typography,
  Tooltip,
  Row,
  Col,
  message,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import apiClient from '../services/apiClient';

const { Title, Text } = Typography;

const Import = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [slipItems, setSlipItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/import/sessions');
      if (res.data.success) {
        setData(res.data.data.map(item => ({
          key: item.TS_ChungTuNhap_id.toString(),
          slipId: item.MaChungTuNhap,
          date: dayjs(item.NgayLapPhieu).format('DD/MM/YYYY HH:mm'),
          creator: item.NguoiTao || 'ADMIN',
          totalItems: item.totalItems,
          scannedItems: item.scannedItems,
          status: item.scannedItems >= item.totalItems && item.totalItems > 0 ? 'Hoàn thành' : 'Đang xử lý',
          rawDate: item.NgayLapPhieu
        })));
      }
    } catch (error) {
      message.error('Lỗi khi lấy danh sách phiếu nhập');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    try {
      setDetailLoading(true);
      const res = await apiClient.get(`/import?sessionId=${sessionId}`);
      if (res.data.success) {
        setSlipItems(res.data.data.map((item, index) => ({
          key: index.toString(),
          assetId: item.MaTaiSan,
          name: item.TenThietBi,
          unit: 'Cái', // Thường hệ thống không trả về đơn vị, mặc định Cái
          quantity: item.SoLuong,
          epc: item.SoThe,
          isScanned: item.DaXacNhan
        })));
      }
    } catch (error) {
      message.error('Lỗi khi lấy chi tiết phiếu nhập');
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.slipId.toLowerCase().includes(searchText.toLowerCase()) ||
    item.creator.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  const showDrawer = (record) => {
    setViewingItem(record);
    setIsDrawerVisible(true);
    fetchSessionDetails(record.key);
  };

  const onClose = () => {
    setIsDrawerVisible(false);
    setViewingItem(null);
    setSlipItems([]);
  };

  // Columns for main list
  const columns = [
    {
      title: 'Mã chứng từ',
      dataIndex: 'slipId',
      key: 'slipId',
      render: text => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>,
    },
    { title: 'Ngày chứng từ', dataIndex: 'date', key: 'date' },
    { title: 'Người tạo', dataIndex: 'creator', key: 'creator' },
    { 
      title: 'Tiến độ', 
      key: 'progress', 
      align: 'center',
      render: (_, record) => (
        <Text strong style={{ color: record.scannedItems >= record.totalItems && record.totalItems > 0 ? '#52c41a' : '#faad14' }}>
          {record.scannedItems} / {record.totalItems}
        </Text>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      align: 'center',
      render: text => (
        <Tag color={text === 'Hoàn thành' ? 'success' : 'processing'}>{text}</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showDrawer(record)} style={{ color: '#1890ff' }} />
          </Tooltip>
          <Tooltip title="In phiếu">
            <Button type="text" icon={<PrinterOutlined />} onClick={() => {
              showDrawer(record);
              setTimeout(() => {
                window.print();
              }, 500);
            }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Columns for inner slip items table
  const itemColumns = [
    {
      title: 'Mã tài sản',
      dataIndex: 'assetId',
      width: '20%',
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'name',
      width: '35%',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '10%',
      align: 'center'
    },
    {
      title: 'Mã thẻ (RFID)',
      dataIndex: 'epc',
      width: '25%',
      render: text => text ? <Text code>{text}</Text> : <Text type="secondary">Chưa gán thẻ</Text>
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Tag color={record.isScanned ? 'success' : 'default'}>
          {record.isScanned ? 'Đã quét' : 'Chưa quét'}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Nghiệp Vụ Nhập Kho</Title>
        <Button onClick={fetchSessions} loading={loading}>Làm mới</Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Tìm kiếm theo mã chứng từ..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 350 }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          loading={loading}
          pagination={{ pageSize: 10, showTotal: total => `Tổng cộng ${total} phiếu` }} 
          size="middle"
        />
      </Card>

      <Drawer
        title={viewingItem ? `Chi tiết phiếu nhập: ${viewingItem.slipId}` : "Chi Tiết Phiếu Nhập"}
        size="large"
        onClose={onClose}
        open={isDrawerVisible}
      >
        {viewingItem && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Text type="secondary">Mã chứng từ:</Text>
              <div><Text strong>{viewingItem.slipId}</Text></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Ngày lập phiếu:</Text>
              <div><Text strong>{viewingItem.date}</Text></div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Tiến độ quét:</Text>
              <div>
                <Text strong style={{ color: viewingItem.scannedItems >= viewingItem.totalItems && viewingItem.totalItems > 0 ? '#52c41a' : '#faad14' }}>
                  {viewingItem.scannedItems} / {viewingItem.totalItems}
                </Text>
              </div>
            </Col>
          </Row>
        )}
        
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 16 }}>Danh sách tài sản / vật tư nhập kho</Text>
        </div>
        
        <Table 
          columns={itemColumns} 
          dataSource={slipItems} 
          loading={detailLoading}
          pagination={false} 
          size="small"
          bordered
          locale={{ emptyText: 'Chưa có tài sản nào trong phiếu' }}
        />
      </Drawer>
    </div>
  );
};

export default Import;
