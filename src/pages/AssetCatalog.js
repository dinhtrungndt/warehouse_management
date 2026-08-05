import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Card,
  Modal,
  Form,
  Select,
  InputNumber,
  Row,
  Col,
  Tooltip,
  Typography
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Option } = Select;

const generateMockData = () => {
  const data = [];
  for (let i = 1; i <= 45; i++) {
    data.push({
      key: i.toString(),
      id: `VTT${i.toString().padStart(6, '0')}C`,
      name: i % 3 === 0 ? `Máy tính bàn Dell Optiplex 5070` : (i % 2 === 0 ? `Bình Thủy Điện Panasonic` : `Gas heater, Display module`),
      category: i % 3 === 0 ? 'Tài sản' : 'Vật tư',
      rfid: `E280117000000213CEEE${i.toString().padStart(4, '0')}`,
      unit: 'Cái',
      quantity: Math.floor(Math.random() * 20) + 1,
      location: i % 2 === 0 ? 'Kho vật tư BR' : 'Phòng TCKT',
      status: i % 5 === 0 ? 'inactive' : 'active',
    });
  }
  return data;
};

const AssetCatalog = () => {
  const [data, setData] = useState(generateMockData());
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Handle Search
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Filtered Data
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toLowerCase().includes(searchText.toLowerCase()) ||
    item.rfid.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle Modal Open
  const showModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle Modal Close
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  // Handle Form Submit
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        // Edit existing
        const newData = [...data];
        const index = newData.findIndex(item => editingItem.key === item.key);
        if (index > -1) {
          newData[index] = { ...newData[index], ...values };
          setData(newData);
          toast.success('Cập nhật tài sản thành công!');
        }
      } else {
        // Add new
        const newAsset = {
          key: (data.length + 1).toString(),
          ...values,
        };
        setData([newAsset, ...data]);
        toast.success('Thêm mới tài sản thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  // Handle Delete
  const handleDelete = (key) => {
    const newData = data.filter(item => item.key !== key);
    setData(newData);
    toast.success('Đã xóa tài sản khỏi danh mục');
  };

  const columns = [
    {
      title: 'Mã tài sản',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: text => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>,
    },
    {
      title: 'Tên thiết bị / Vật tư',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: category => {
        let color = category === 'Tài sản' ? 'blue' : 'green';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'Số Thẻ (RFID)',
      dataIndex: 'rfid',
      key: 'rfid',
      width: 220,
      ellipsis: true,
      render: text => <Text type="secondary" copyable>{text}</Text>,
    },
    {
      title: 'ĐVT',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right',
    },
    {
      title: 'Vị trí / Phòng ban',
      dataIndex: 'location',
      key: 'location',
      width: 150,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      width: 120,
      render: status => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Xác nhận xóa',
                  content: `Bạn có chắc muốn xóa tài sản ${record.id} không?`,
                  okText: 'Xóa',
                  okType: 'danger',
                  cancelText: 'Hủy',
                  onOk: () => handleDelete(record.key)
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Helper text component to avoid TS/react issues
  const { Text } = Typography;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Danh Mục Tài Sản / CCDC / Vật Tư</Typography.Title>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={() => toast('Tính năng in đang phát triển', { icon: '🖨️' })}>
            In Tem
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Tạo mới
          </Button>
        </Space>
      </div>

      <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Input
            placeholder="Tìm kiếm theo mã, tên thiết bị, RFID..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 350 }}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="large"
          />
          <Button size="large" icon={<ReloadOutlined />} onClick={() => { setSearchText(''); toast.success('Đã làm mới dữ liệu'); }}>
            Làm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tài sản`
          }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`);
            }
          }}
          size="middle"
        />
      </Card>

      <Modal
        title={editingItem ? "Chỉnh Sửa Tài Sản" : "Thêm Mới Tài Sản"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id" label="Mã Tài Sản/Vật Tư" rules={[{ required: true }]}>
                <Input placeholder="Nhập mã (VD: VTT010048C)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Tên Thiết Bị/Vật Tư" rules={[{ required: true }]}>
                <Input placeholder="Nhập tên thiết bị" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Phân Loại" rules={[{ required: true }]}>
                <Select placeholder="Chọn phân loại">
                  <Option value="Tài sản">Tài sản</Option>
                  <Option value="Vật tư">Vật tư</Option>
                  <Option value="CCDC">CCDC</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rfid" label="Mã Số Thẻ (RFID)">
                <Input placeholder="Nhập hoặc quét RFID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="unit" label="Đơn Vị Tính" rules={[{ required: true }]}>
                <Select placeholder="ĐVT">
                  <Option value="Cái">Cái</Option>
                  <Option value="Bộ">Bộ</Option>
                  <Option value="Thùng">Thùng</Option>
                  <Option value="Mét">Mét</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quantity" label="Số Lượng" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="SL" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng Thái">
                <Select defaultValue="active">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Tạm ngưng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="location" label="Phòng Ban / Kho Vị Trí" rules={[{ required: true }]}>
                <Input placeholder="VD: Kho vật tư BR / K1/10" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AssetCatalog;
