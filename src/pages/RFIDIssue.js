import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { 
  Table, 
  Button, 
  Input, 
  Card, 
  Typography,
  Tag,
  Row,
  Col,
  Alert,
  Form
} from 'antd';
import { 
  SearchOutlined, 
  BarcodeOutlined,
  SaveOutlined,
  WifiOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title } = Typography;

const RFIDIssue = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [rfidForm] = Form.useForm();
  const [isScanning, setIsScanning] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/assets');
      if (res.data.success) {
        // Filter assets that don't have RFID tag
        const unissuedAssets = res.data.data.filter(item => !item.rfid);
        setData(unissuedAssets);
      }
    } catch (error) {
      toast.error('Lỗi tải dữ liệu tài sản');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    (item.id || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (item.name || '').toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectAsset = (record) => {
    setSelectedAsset(record);
    rfidForm.resetFields();
  };

  const simulateScan = () => {
    if (!selectedAsset) {
      toast.error('Vui lòng chọn tài sản cần gán mã ở bảng bên trái trước!');
      return;
    }
    setIsScanning(true);
    toast('Đang chờ thiết bị đầu đọc...', { icon: '📡' });
    
    setTimeout(() => {
      // Simulate reading a tag
      const mockTag = `E28011700000${Math.floor(10000000 + Math.random() * 90000000)}`;
      rfidForm.setFieldsValue({ rfidTag: mockTag });
      setIsScanning(false);
      toast.success('Đã đọc thẻ thành công!');
    }, 1500);
  };

  const handleSaveRFID = async () => {
    try {
      const values = await rfidForm.validateFields();
      if (!selectedAsset) return;

      const payload = {
        ...selectedAsset,
        rfid: values.rfidTag
      };

      await apiClient.put(`/assets/${selectedAsset.keyId}`, payload);
      
      toast.success('Đã gắn mã RFID thành công!');
      setSelectedAsset(null);
      rfidForm.resetFields();
      fetchData();
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi lưu RFID!');
      } else {
        toast.error('Vui lòng nhập hoặc quét mã RFID');
      }
    }
  };

  const columns = [
    { title: 'Mã tài sản', dataIndex: 'id', key: 'id', render: text => <span style={{ fontWeight: 'bold' }}>{text}</span> },
    { title: 'Tên tài sản / Thiết bị', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Vị trí', dataIndex: 'location', key: 'location', render: text => text || 'Kho vật tư BR' },
    { 
      title: 'Trạng thái', 
      key: 'status',
      render: () => (
        <Tag color="warning">Chưa có Tag</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          type={selectedAsset?.keyId === record.keyId ? "primary" : "default"}
          size="small"
          onClick={() => handleSelectAsset(record)}
        >
          Chọn
        </Button>
      ),
    },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Phát Hành / Gán Mã RFID</Title>
      </div>

      <Row gutter={24}>
        {/* Cột trái: Danh sách tài sản chờ gán thẻ */}
        <Col span={16}>
          <Card 
            title="Danh sách tài sản (Chưa có RFID)" 
            variant="borderless" 
            style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Input 
                placeholder="Tìm kiếm tài sản theo mã, tên..." 
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ width: 350 }}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            
            <Table 
              columns={columns} 
              dataSource={filteredData} 
              rowKey="keyId"
              loading={loading}
              pagination={{ pageSize: 8 }} 
              size="small"
            />
          </Card>
        </Col>

        {/* Cột phải: Khu vực quét thẻ và gán */}
        <Col span={8}>
          <Card 
            title="Khu Vực Gán Thẻ" 
            variant="borderless" 
            style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)', height: '100%' }}
          >
            {!selectedAsset ? (
              <Alert 
                title="Chưa chọn tài sản" 
                description="Vui lòng nhấn nút Chọn ở danh sách bên trái để tiến hành gán thẻ RFID." 
                type="info" 
                showIcon 
              />
            ) : (
              <div>
                <Alert 
                  title={`Đang thao tác: ${selectedAsset.name}`} 
                  description={`Mã TS: ${selectedAsset.id}`} 
                  type="success" 
                  showIcon 
                  style={{ marginBottom: 24 }}
                />
                
                <Form form={rfidForm} layout="vertical">
                  <Form.Item 
                    name="rfidTag" 
                    label="Mã số Thẻ (EPC)" 
                    rules={[{ required: true, message: 'Mã thẻ không được để trống!' }]}
                  >
                    <Input 
                      placeholder="Quét hoặc nhập thủ công..." 
                      size="large"
                      prefix={<BarcodeOutlined />}
                      addonAfter={
                        <Button 
                          type="primary" 
                          icon={<WifiOutlined />} 
                          loading={isScanning}
                          onClick={simulateScan}
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        >
                          Quét
                        </Button>
                      }
                    />
                  </Form.Item>

                  <div style={{ marginTop: 32 }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<SaveOutlined />} 
                      style={{ width: '100%', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                      onClick={handleSaveRFID}
                    >
                      Lưu / Gán Thẻ Hệ Thống
                    </Button>
                    <Button 
                      size="large" 
                      style={{ width: '100%', marginTop: 12 }}
                      onClick={() => setSelectedAsset(null)}
                    >
                      Hủy Bỏ
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RFIDIssue;
