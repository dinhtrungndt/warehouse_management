import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Modal, 
  Form, 
  Switch, 
  Typography,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

// Mock data generator for Departments
const generateMockData = () => {
  return [
    { key: '1', code: '5-01', name: '5-01 - Phòng TCKT', notes: '', isActive: true },
    { key: '2', code: '5-02', name: '5-02 - Phòng TCHC', notes: '', isActive: true },
    { key: '3', code: '5-03', name: '5-03 - Phòng KTSX', notes: '', isActive: true },
    { key: '4', code: '5-04', name: '5-04 - Phòng ATMT', notes: '', isActive: true },
    { key: '5', code: '5-05', name: '5-05 - BDSC', notes: '', isActive: true },
    { key: '6', code: '5-06', name: '5-06 - Trạm Bà Rịa', notes: '', isActive: true },
    { key: '7', code: '5-07', name: '5-07 - Vận hành Phú Mỹ', notes: '', isActive: true },
    { key: '8', code: '5-08', name: '5-08 - PCCC Bà Rịa', notes: '', isActive: false },
    { key: '9', code: 'KhoBR', name: 'Kho vật tư BR', notes: 'Kho chính', isActive: true },
  ];
};

const DepartmentCatalog = () => {
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
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle Modal Open
  const showModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true }); // Default to active
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
          toast.success('Cập nhật phòng ban/kho thành công!');
        }
      } else {
        // Add new
        const newDept = {
          key: Date.now().toString(),
          ...values,
        };
        setData([newDept, ...data]);
        toast.success('Thêm mới phòng ban/kho thành công!');
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
    toast.success('Đã xóa dữ liệu thành công');
  };

  const columns = [
    {
      title: 'Mã kho / Mã PB',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: text => <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>,
    },
    {
      title: 'Tên phòng ban - Kho',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Trạng thái',
      key: 'isActive',
      dataIndex: 'isActive',
      width: 150,
      render: isActive => (
        <Switch 
          checked={isActive} 
          checkedChildren="Hoạt động" 
          unCheckedChildren="Tạm ngưng"
          disabled
        />
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
                  content: `Bạn có chắc muốn xóa phòng ban/kho [${record.code}] không?`,
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

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Danh Mục Phòng Ban - Kho</Typography.Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Tạo mới
          </Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Input 
            placeholder="Tìm kiếm theo mã, tên phòng ban..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 350 }}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            size="large"
            value={searchText}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục` 
          }} 
          size="middle"
        />
      </Card>

      <Modal
        title={editingItem ? "Chỉnh Sửa Phòng Ban - Kho" : "Thêm Mới Phòng Ban - Kho"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu Dữ Liệu"
        cancelText="Hủy Bỏ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item name="code" label="Mã Phòng Ban / Kho" rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}>
            <Input placeholder="Nhập mã (VD: 5-01)" />
          </Form.Item>
          <Form.Item name="name" label="Tên Phòng Ban / Kho" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nhập tên phòng ban hoặc kho" />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái hoạt động" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm ngưng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentCatalog;
