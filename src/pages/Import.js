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
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

// Mock Data for Import Slips
const generateSlips = () => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i.toString(),
      slipId: `TSN22000${i.toString().padStart(3, '0')}`,
      date: dayjs().subtract(i, 'day').format('DD/MM/YYYY HH:mm'),
      department: i % 2 === 0 ? '5-04 - Phòng ATMT' : 'Kho vật tư BR',
      creator: 'ADMIN',
      purpose: i % 2 === 0 ? 'Nhập mua mới' : 'Nhập điều chuyển',
      totalItems: Math.floor(Math.random() * 10) + 1,
      status: i % 3 === 0 ? 'Đang xử lý' : 'Hoàn thành',
    });
  }
  return data;
};

const Import = () => {
  const [data, setData] = useState(generateSlips());
  const [searchText, setSearchText] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  
  // State for items inside the import slip
  const [slipItems, setSlipItems] = useState([]);

  // Handle Search
  const filteredData = data.filter(item => 
    item.slipId.toLowerCase().includes(searchText.toLowerCase()) ||
    item.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const showDrawer = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date, 'DD/MM/YYYY HH:mm'),
      });
      // Mock some items for editing view
      setSlipItems([
        { key: '1', assetId: 'VTT010332C', name: '261 SBS Control CR2', unit: 'Cái', quantity: 1 }
      ]);
    } else {
      form.resetFields();
      form.setFieldsValue({
        slipId: `TSN${dayjs().format('YYMMDDHHmm')}`,
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
        toast.error('Vui lòng thêm ít nhất một tài sản/vật tư vào phiếu!');
        return;
      }
      
      const formattedValues = {
        ...values,
        date: values.date.format('DD/MM/YYYY HH:mm'),
        totalItems: slipItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
        status: 'Hoàn thành'
      };

      if (editingItem) {
        const newData = [...data];
        const index = newData.findIndex(item => editingItem.key === item.key);
        newData[index] = { ...newData[index], ...formattedValues };
        setData(newData);
        toast.success('Cập nhật phiếu nhập thành công!');
      } else {
        setData([{ key: Date.now().toString(), ...formattedValues }, ...data]);
        toast.success('Tạo phiếu nhập kho thành công!');
      }
      onClose();
    });
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
    toast.success('Đã xóa phiếu nhập');
  };

  // Logic for adding items to the slip
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
        // Auto fill name if ID is entered (mock behavior)
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

  // Columns for main list
  const columns = [
    {
      title: 'Mã chứng từ',
      dataIndex: 'slipId',
      key: 'slipId',
      render: text => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>,
    },
    { title: 'Ngày chứng từ', dataIndex: 'date', key: 'date' },
    { title: 'Kho / Phòng ban nhận', dataIndex: 'department', key: 'department' },
    { title: 'Mục đích', dataIndex: 'purpose', key: 'purpose' },
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
          <Popconfirm title="Xóa phiếu này?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Columns for inner slip items table
  const itemColumns = [
    {
      title: 'Mã tài sản/vật tư',
      dataIndex: 'assetId',
      width: '25%',
      render: (text, record) => (
        <Input 
          value={text} 
          placeholder="Nhập mã..." 
          onChange={e => handleSlipItemChange(record.key, 'assetId', e.target.value)} 
        />
      )
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'name',
      width: '35%',
      render: (text, record) => (
        <Input 
          value={text} 
          placeholder="Tên tự động nhảy..." 
          onChange={e => handleSlipItemChange(record.key, 'name', e.target.value)} 
        />
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
        <InputNumber 
          min={1} 
          value={text} 
          onChange={val => handleSlipItemChange(record.key, 'quantity', val)} 
          style={{ width: '100%' }} 
        />
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
        <Title level={3} style={{ margin: 0 }}>Nghiệp Vụ Nhập Kho</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer()}>
            Tạo phiếu nhập
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
        title={editingItem ? `Chi tiết phiếu nhập: ${editingItem.slipId}` : "Tạo Phiếu Nhập Kho Mới"}
        width={900}
        onClose={onClose}
        open={isDrawerVisible}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="primary" onClick={handleSave}>Lưu Phiếu</Button>
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
              <Form.Item name="department" label="Kho nhận / Phòng ban" rules={[{ required: true, message: 'Vui lòng chọn kho nhận!' }]}>
                <Select placeholder="Chọn vị trí nhập">
                  <Option value="Kho vật tư BR">Kho vật tư BR</Option>
                  <Option value="5-04 - Phòng ATMT">5-04 - Phòng ATMT</Option>
                  <Option value="5-01 - Phòng TCKT">5-01 - Phòng TCKT</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="purpose" label="Mục đích nhập" rules={[{ required: true }]}>
                <Select placeholder="Chọn mục đích">
                  <Option value="Nhập mua mới">Nhập mua mới</Option>
                  <Option value="Nhập điều chuyển">Nhập điều chuyển</Option>
                  <Option value="Nhập trả lại">Nhập trả lại</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 24, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: 16 }}>Danh sách tài sản / vật tư nhập kho</Text>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddSlipItem}>
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

export default Import;
