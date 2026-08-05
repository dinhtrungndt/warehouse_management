import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Modal, 
  Form, 
  Typography,
  Tag,
  Popconfirm,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PrinterOutlined,
  ApiOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const generatePrinters = () => {
  return [
    { key: '1', name: 'Zebra ZT411 (Phòng TCKT)', ip: '192.168.1.100', port: '9100', status: 'online', resolution: '300dpi' },
    { key: '2', name: 'Zebra ZD621 (Kho BR)', ip: '192.168.1.105', port: '9100', status: 'offline', resolution: '203dpi' },
  ];
};

const SystemPrinter = () => {
  const [data, setData] = useState(generatePrinters());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [isTesting, setIsTesting] = useState(false);

  const showModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ port: '9100', resolution: '203dpi' });
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
        newData[index] = { ...newData[index], ...values, status: 'online' };
        setData(newData);
        toast.success('Cập nhật cấu hình máy in thành công!');
      } else {
        setData([{ key: Date.now().toString(), ...values, status: 'online' }, ...data]);
        toast.success('Thêm máy in Zebra thành công!');
      }
      setIsModalVisible(false);
    });
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
    toast.success('Đã xóa máy in khỏi hệ thống');
  };

  const testConnection = (ip) => {
    setIsTesting(true);
    toast.loading(`Đang kết nối đến ${ip}...`, { id: 'test-print' });
    setTimeout(() => {
      setIsTesting(false);
      toast.success(`Kết nối tới ${ip} thành công!`, { id: 'test-print' });
    }, 1500);
  };

  const columns = [
    { 
      title: 'Tên máy in', 
      dataIndex: 'name', 
      key: 'name',
      render: text => <><PrinterOutlined style={{ marginRight: 8 }} /><strong>{text}</strong></> 
    },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: text => <Tag color="blue">{text}</Tag> },
    { title: 'Port', dataIndex: 'port', key: 'port' },
    { title: 'Độ phân giải', dataIndex: 'resolution', key: 'resolution' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: status => (
        <Badge 
          status={status === 'online' ? 'success' : 'error'} 
          text={status === 'online' ? 'Sẵn sàng' : 'Mất kết nối'} 
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" ghost icon={<ApiOutlined />} onClick={() => testConnection(record.ip)} loading={isTesting}>
            Test IP
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Xóa máy in này?" onConfirm={() => handleDelete(record.key)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Cấu Hình Máy In Zebra (RFID)</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm máy in
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 20 }}>
          Quản lý danh sách các máy in mã vạch / in thẻ RFID qua giao thức mạng LAN/Wifi (ZPL TCP/IP).
        </Typography.Paragraph>
        <Table columns={columns} dataSource={data} pagination={false} size="middle" />
      </Card>

      <Modal
        title={editingItem ? "Sửa Cấu Hình Máy In" : "Thêm Máy In Mới"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item name="name" label="Tên máy in / Vị trí" rules={[{ required: true }]}>
            <Input placeholder="VD: Zebra ZT411 - Kho BR" />
          </Form.Item>
          <Form.Item name="ip" label="Địa chỉ IP (LAN/Wifi)" rules={[{ required: true }]}>
            <Input placeholder="192.168.1.x" />
          </Form.Item>
          <Form.Item name="port" label="Port (Mặc định ZPL là 9100)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="resolution" label="Độ phân giải">
            <Input placeholder="VD: 203dpi hoặc 300dpi" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemPrinter;

