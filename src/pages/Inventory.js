import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Modal, 
  Form, 
  Select, 
  DatePicker, 
  Typography,
  Tooltip,
  Tag,
  Row,
  Col,
  Statistic,
  Divider,
  Popconfirm,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import apiClient from '../services/apiClient';

const { Option } = Select;
const { Title } = Typography;

const Inventory = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/inventory/sessions');
      if (res.data.success) {
        setData(res.data.data.map(item => ({
          key: item.TaiSanKiemKe_id.toString(),
          code: item.MaKiemKe,
          title: `Kiểm kê đợt ${item.MaKiemKe}`,
          date: dayjs(item.NgayLapPhieu).format('DD/MM/YYYY'),
          department: item.NguoiKiemKe || 'Hệ thống',
          status: item.scannedItems >= item.totalItems && item.totalItems > 0 ? 'Hoàn thành' : 'Đang thực hiện',
          systemTotal: item.totalItems,
          scannedTotal: item.scannedItems,
          missing: Math.max(0, item.totalItems - item.scannedItems),
        })));
      }
    } catch (error) {
      message.error('Lỗi khi lấy danh sách kỳ kiểm kê');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    try {
      setDetailLoading(true);
      const res = await apiClient.get(`/inventory/details?sessionId=${sessionId}`);
      if (res.data.success) {
        setDetailItems(res.data.data.map((item, index) => ({
          key: index.toString(),
          assetId: item.MaTaiSan,
          name: item.TenThietBi,
          sysCount: item.SoLuong,
          scanCount: item.DaXacNhan ? item.SoLuong : 0,
        })));
      }
    } catch (error) {
      message.error('Lỗi khi lấy chi tiết kiểm kê');
    } finally {
      setDetailLoading(false);
    }
  };

  // Filter
  const filteredData = data.filter(item => 
    item.code.toLowerCase().includes(searchText.toLowerCase()) ||
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const showCreateModal = () => {
    form.resetFields();
    form.setFieldsValue({
      code: `KK${dayjs().format('YYMMDDHHmm')}`,
      date: dayjs(),
    });
    setIsModalVisible(true);
  };

  const showDetailModal = (record) => {
    setEditingItem(record);
    setIsDetailVisible(true);
    fetchSessionDetails(record.key);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDetailVisible(false);
    setEditingItem(null);
    setDetailItems([]);
  };

  const handleCreate = () => {
    form.validateFields().then(values => {
      // Vì phase này ưu tiên Read, ta chỉ báo message và đóng modal
      message.info('Chức năng tạo mới trên Web đang được nâng cấp, vui lòng dùng hệ thống cũ!');
      setIsModalVisible(false);
    });
  };

  const handleDelete = (key) => {
    message.info('Chức năng xóa trên Web đang được nâng cấp!');
  };

  const columns = [
    {
      title: 'Mã KK',
      dataIndex: 'code',
      key: 'code',
      render: text => <span style={{ fontWeight: 600, color: '#13c2c2' }}>{text}</span>,
    },
    { title: 'Tên kỳ kiểm kê', dataIndex: 'title', key: 'title' },
    { title: 'Ngày tạo', dataIndex: 'date', key: 'date' },
    { title: 'Phòng ban / Người tạo', dataIndex: 'department', key: 'department' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: status => (
        <Tag color={status === 'Hoàn thành' ? 'success' : 'processing'} icon={status === 'Hoàn thành' ? <CheckCircleOutlined /> : <SyncOutlined spin />}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showDetailModal(record)} style={{ color: '#1890ff' }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Detailed items for the Detail Modal
  const detailColumns = [
    { title: 'Mã tài sản', dataIndex: 'assetId', key: 'assetId' },
    { title: 'Tên tài sản', dataIndex: 'name', key: 'name' },
    { title: 'Tồn hệ thống', dataIndex: 'sysCount', key: 'sysCount', align: 'center' },
    { title: 'Thực tế (Quét được)', dataIndex: 'scanCount', key: 'scanCount', align: 'center' },
    { 
      title: 'Chênh lệch', 
      key: 'diff',
      align: 'center',
      render: (_, record) => {
        const diff = record.scanCount - record.sysCount;
        if (diff === 0) return <Tag color="success">Khớp</Tag>;
        if (diff < 0) return <Tag color="error">Thiếu {Math.abs(diff)}</Tag>;
        return <Tag color="warning">Thừa {diff}</Tag>;
      }
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Quản Lý Kiểm Kê Tài Sản</Title>
        <Space>
          <Button onClick={fetchSessions} loading={loading}>Làm mới</Button>
          <Button type="primary" style={{ backgroundColor: '#13c2c2', borderColor: '#13c2c2' }} icon={<PlusOutlined />} onClick={showCreateModal}>
            Tạo kỳ kiểm kê
          </Button>
        </Space>
      </div>

      <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Tìm kiếm theo mã, tên kỳ kiểm kê..." 
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
          pagination={{ pageSize: 10 }} 
          size="middle"
        />
      </Card>

      {/* Modal Tạo Kỳ Kiểm Kê */}
      <Modal
        title="Tạo Kỳ Kiểm Kê Mới"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={handleCancel}
        okText="Tạo Mới"
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: '#13c2c2', borderColor: '#13c2c2' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="code" label="Mã kiểm kê" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="title" label="Tên đợt kiểm kê" rules={[{ required: true, message: 'Vui lòng nhập tên đợt kiểm kê!' }]}>
            <Input placeholder="VD: Kiểm kê quý 3 năm 2026" />
          </Form.Item>
          <Form.Item name="date" label="Ngày chốt tồn" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="department" label="Kho / Phòng ban cần kiểm kê" rules={[{ required: true }]}>
            <Select placeholder="Chọn khu vực">
              <Option value="Kho vật tư BR">Kho vật tư BR</Option>
              <Option value="Phòng TCKT">Phòng TCKT</Option>
              <Option value="Phòng ATMT">Phòng ATMT</Option>
              <Option value="Toàn Công Ty">Toàn Công Ty</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chi Tiết Kiểm Kê */}
      <Modal
        title={`Chi Tiết Kiểm Kê - ${editingItem?.code}`}
        open={isDetailVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>Đóng</Button>
        ]}
        width={900}
      >
        {editingItem && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24, marginTop: 16 }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic title="Tổng Tồn Sổ Sách" value={editingItem.systemTotal} suffix="Tài sản" />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic title="Đã Quét (Thực tế)" value={editingItem.scannedTotal} suffix="Tài sản" valueStyle={{ color: '#1890ff' }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic 
                    title="Chênh Lệch Thiếu" 
                    value={editingItem.missing} 
                    suffix="Tài sản" 
                    valueStyle={{ color: editingItem.missing > 0 ? '#cf1322' : '#3f8600' }} 
                    prefix={editingItem.missing > 0 ? <WarningOutlined /> : <CheckCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            
            <Divider orientation="left">Chi Tiết Bảng Kê</Divider>
            
            <Table 
              columns={detailColumns} 
              dataSource={detailItems} 
              loading={detailLoading}
              pagination={false} 
              size="small"
              bordered
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;
