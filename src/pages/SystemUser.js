import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Modal, 
  Form, 
  Select, 
  Typography,
  Tooltip,
  Tag,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  KeyOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Option } = Select;
const { Title } = Typography;

// Mock Data
const generateUsers = () => {
  return [
    { key: '1', username: 'admin', fullName: 'Quản trị viên', role: 'Quản trị hệ thống', department: 'Phòng CNTT', status: 'Hoạt động' },
    { key: '2', username: 'kho.br', fullName: 'Thủ kho Bà Rịa', role: 'Thủ kho', department: 'Kho vật tư BR', status: 'Hoạt động' },
    { key: '3', username: 'nv.kiemke', fullName: 'Nguyễn Văn A', role: 'Nhân viên kiểm kê', department: 'Phòng TCKT', status: 'Hoạt động' },
    { key: '4', username: 'guest.atmt', fullName: 'Trần Thị B', role: 'Người dùng xem', department: 'Phòng ATMT', status: 'Bị khóa' },
  ];
};

const SystemUser = () => {
  const [data, setData] = useState(generateUsers());
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item => 
    item.username.toLowerCase().includes(searchText.toLowerCase()) ||
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'Hoạt động' });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingItem) {
        const newData = [...data];
        const index = newData.findIndex(item => editingItem.key === item.key);
        newData[index] = { ...newData[index], ...values };
        setData(newData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        setData([{ key: Date.now().toString(), ...values }, ...data]);
        toast.success('Thêm người dùng mới thành công!');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
    toast.success('Đã xóa người dùng');
  };

  const resetPassword = () => {
    toast.success('Đã reset mật khẩu về mặc định (123456)', { icon: '🔑' });
  };

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username', render: text => <strong>{text}</strong> },
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { 
      title: 'Vai trò (Role)', 
      dataIndex: 'role', 
      key: 'role',
      render: role => {
        let color = 'blue';
        if (role === 'Quản trị hệ thống') color = 'magenta';
        if (role === 'Thủ kho') color = 'orange';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <Tag color={status === 'Hoạt động' ? 'success' : 'error'}>{status}</Tag>
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Reset mật khẩu">
            <Button type="text" icon={<KeyOutlined />} onClick={resetPassword} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} style={{ color: '#1890ff' }} />
          </Tooltip>
          <Popconfirm title="Xóa người dùng này?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy">
            <Button type="text" danger icon={<DeleteOutlined />} disabled={record.username === 'admin'} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Quản Lý Người Dùng & Phân Quyền</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Tạo tài khoản
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Tìm kiếm tài khoản..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 350 }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </div>
        <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} size="middle" />
      </Card>

      <Modal
        title={editingItem ? "Sửa Tài Khoản" : "Tạo Tài Khoản Mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input disabled={!!editingItem} placeholder="Viết liền không dấu" />
          </Form.Item>
          {!editingItem && (
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
            <Input placeholder="Nhập họ tên đầy đủ" />
          </Form.Item>
          <Form.Item name="department" label="Phòng ban" rules={[{ required: true }]}>
            <Select>
              <Option value="Phòng CNTT">Phòng CNTT</Option>
              <Option value="Phòng TCKT">Phòng TCKT</Option>
              <Option value="Kho vật tư BR">Kho vật tư BR</Option>
              <Option value="Phòng ATMT">Phòng ATMT</Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Option value="Quản trị hệ thống">Quản trị hệ thống</Option>
              <Option value="Thủ kho">Thủ kho</Option>
              <Option value="Nhân viên kiểm kê">Nhân viên kiểm kê</Option>
              <Option value="Người dùng xem">Người dùng xem</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Bị khóa">Bị khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemUser;

