import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Drawer,
  Form,
  Select,
  DatePicker,
  Typography,
  Tooltip,
  Row,
  Col,
  InputNumber,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  PrinterOutlined,
  DeleteOutlined,
  SwapOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

const generateSlips = () => {
  const data = [];
  for (let i = 1; i <= 8; i++) {
    data.push({
      key: i.toString(),
      slipId: `TDC22000${i.toString().padStart(3, '0')}`,
      date: dayjs().subtract(i * 5, 'hour').format('DD/MM/YYYY HH:mm'),
      fromDept: 'Kho vật tư BR',
      toDept: i % 2 === 0 ? 'Phòng TCKT' : 'Phòng ATMT',
      creator: 'ADMIN',
      totalItems: Math.floor(Math.random() * 5) + 1,
    });
  }
  return data;
};

const Transfer = () => {
  const [data, setData] = useState(generateSlips());
  const [searchText, setSearchText] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [slipItems, setSlipItems] = useState([]);

  // Handle Search
  const filteredData = data.filter(item =>
    item.slipId.toLowerCase().includes(searchText.toLowerCase()) ||
    item.fromDept.toLowerCase().includes(searchText.toLowerCase()) ||
    item.toDept.toLowerCase().includes(searchText.toLowerCase())
  );

  const showDrawer = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date, 'DD/MM/YYYY HH:mm'),
      });
      setSlipItems([
        { key: '1', assetId: 'VTT010332C', name: '261 SBS Control CR2', unit: 'Cái', quantity: 1 }
      ]);
    } else {
      form.resetFields();
      form.setFieldsValue({
        slipId: `TDC${dayjs().format('YYMMDDHHmm')}`,
        date: dayjs(),
        creator: 'ADMIN',
      });
      setSlipItems([]);
    }
    setIsDrawerVisible(true);
  };

  const onClose = () => {
    setIsDrawerVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (slipItems.length === 0) {
        toast.error('Phiếu điều chuyển phải có ít nhất một tài sản/vật tư!');
        return;
      }
      if (values.fromDept === values.toDept) {
        toast.error('Kho xuất và Kho nhập không được trùng nhau!');
        return;
      }

      const formattedValues = {
        ...values,
        date: values.date.format('DD/MM/YYYY HH:mm'),
        totalItems: slipItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
      };

      if (editingItem) {
        const newData = [...data];
        const index = newData.findIndex(item => editingItem.key === item.key);
        newData[index] = { ...newData[index], ...formattedValues };
        setData(newData);
        toast.success('Cập nhật phiếu điều chuyển thành công!');
      } else {
        setData([{ key: Date.now().toString(), ...formattedValues }, ...data]);
        toast.success('Tạo phiếu điều chuyển thành công!');
      }
      onClose();
    });
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
    toast.success('Đã xóa phiếu điều chuyển');
  };

  const handleAddSlipItem = () => {
    const newItem = {
      key: Date.now().toString(),
      assetId: '',
      name: '',
      unit: 'Cái',
      quantity: 1,
    };
    setSlipItems([...slipItems, newItem]);
  };

  const handleSlipItemChange = (key, field, value) => {
    const newData = slipItems.map(item => {
      if (item.key === key) {
        if (field === 'assetId' && value.length > 5) {
          return { ...item, [field]: value, name: 'Tài sản Demo ' + value };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setSlipItems(newData);
  };

  const removeSlipItem = (key) => {
    setSlipItems(slipItems.filter(item => item.key !== key));
  };

  const columns = [
    {
      title: 'Mã chứng từ',
      dataIndex: 'slipId',
      key: 'slipId',
      render: text => <span style={{ fontWeight: 600, color: '#fa8c16' }}>{text}</span>, // Orange for Transfer
    },
    { title: 'Ngày chứng từ', dataIndex: 'date', key: 'date' },
    { title: 'Từ Kho / Phòng', dataIndex: 'fromDept', key: 'fromDept' },
    {
      title: '',
      key: 'arrow',
      align: 'center',
      render: () => <SwapOutlined style={{ color: '#bfbfbf' }} />
    },
    { title: 'Đến Kho / Phòng', dataIndex: 'toDept', key: 'toDept' },
    { title: 'Người tạo', dataIndex: 'creator', key: 'creator' },
    { title: 'Tổng SL', dataIndex: 'totalItems', key: 'totalItems', align: 'center' },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem / Sửa">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showDrawer(record)} style={{ color: '#1890ff' }} />
          </Tooltip>
          <Tooltip title="In phiếu">
            <Button type="text" icon={<PrinterOutlined />} onClick={() => toast('Đang kết nối máy in...', { icon: '🖨️' })} />
          </Tooltip>
          <Popconfirm title="Xóa phiếu điều chuyển này?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Mã tài sản/vật tư',
      dataIndex: 'assetId',
      width: '25%',
      render: (text, record) => (
        <Input value={text} placeholder="Nhập mã..." onChange={e => handleSlipItemChange(record.key, 'assetId', e.target.value)} />
      )
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'name',
      width: '35%',
      render: (text, record) => (
        <Input value={text} placeholder="Tên tự động nhảy..." onChange={e => handleSlipItemChange(record.key, 'name', e.target.value)} />
      )
    },
    {
      title: 'ĐVT',
      dataIndex: 'unit',
      width: '15%',
      render: (text, record) => (
        <Select value={text} style={{ width: '100%' }} onChange={val => handleSlipItemChange(record.key, 'unit', val)}>
          <Option value="Cái">Cái</Option>
          <Option value="Bộ">Bộ</Option>
          <Option value="Thùng">Thùng</Option>
        </Select>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '15%',
      render: (text, record) => (
        <InputNumber min={1} value={text} onChange={val => handleSlipItemChange(record.key, 'quantity', val)} style={{ width: '100%' }} />
      )
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeSlipItem(record.key)} />
      )
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Nghiệp Vụ Điều Chuyển</Title>
        <Space>
          <Button type="primary" style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }} icon={<SwapOutlined />} onClick={() => showDrawer()}>
            Tạo phiếu điều chuyển
          </Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo mã chứng từ, phòng ban..."
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
          pagination={{ pageSize: 10, showTotal: total => `Tổng cộng ${total} phiếu` }}
          size="middle"
        />
      </Card>

      <Drawer
        title={editingItem ? `Chi tiết phiếu điều chuyển: ${editingItem.slipId}` : "Tạo Phiếu Điều Chuyển Mới"}
        width={900}
        onClose={onClose}
        open={isDrawerVisible}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="primary" style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }} onClick={handleSave}>Lưu Phiếu</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="slipId" label="Mã chứng từ" rules={[{ required: true }]}>
                <Input disabled style={{ fontWeight: 'bold' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="date" label="Ngày chứng từ" rules={[{ required: true }]}>
                <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="creator" label="Người tạo">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fromDept" label="Từ Kho / Phòng ban (Xuất)" rules={[{ required: true, message: 'Vui lòng chọn nơi xuất!' }]}>
                <Select placeholder="Chọn nơi xuất">
                  <Option value="Kho vật tư BR">Kho vật tư BR</Option>
                  <Option value="Phòng TCKT">Phòng TCKT</Option>
                  <Option value="Phòng ATMT">Phòng ATMT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="toDept" label="Đến Kho / Phòng ban (Nhập)" rules={[{ required: true, message: 'Vui lòng chọn nơi nhập!' }]}>
                <Select placeholder="Chọn nơi nhập">
                  <Option value="Phòng TCKT">Phòng TCKT</Option>
                  <Option value="Phòng ATMT">Phòng ATMT</Option>
                  <Option value="Kho vật tư BR">Kho vật tư BR</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 24, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: 16 }}>Danh sách tài sản / vật tư điều chuyển</Text>
            <Button type="dashed" style={{ color: '#fa8c16', borderColor: '#fa8c16' }} icon={<PlusOutlined />} onClick={handleAddSlipItem}>
              Thêm dòng
            </Button>
          </div>

          <Table
            columns={itemColumns}
            dataSource={slipItems}
            pagination={false}
            size="small"
            bordered
            locale={{ emptyText: 'Chưa có tài sản nào trong phiếu' }}
          />

        </Form>
      </Drawer>
    </div>
  );
};

export default Transfer;
