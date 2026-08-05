import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
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

const { Title, Text } = Typography;

// Mock Data for Assets that need RFID Issuance
const generateUnissuedAssets = () => {
  const data = [];
  for (let i = 1; i <= 8; i++) {
    data.push({
      key: i.toString(),
      assetId: `VTT010${i.toString().padStart(3, '0')}C`,
      name: i % 2 === 0 ? 'Laptop Dell Vostro 3510' : 'Máy In Laser HP',
      department: i % 3 === 0 ? 'Phòng TCKT' : 'Kho vật tư BR',
      status: 'Chưa gắn Tag',
      currentTag: '', // Empty initially
    });
  }
  return data;
};

const RFIDIssue = () => {
  const [data, setData] = useState(generateUnissuedAssets());
  const [searchText, setSearchText] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [rfidForm] = Form.useForm();
  const [isScanning, setIsScanning] = useState(false);

  // Filter
  const filteredData = data.filter(item => 
    item.assetId.toLowerCase().includes(searchText.toLowerCase()) ||
    item.name.toLowerCase().includes(searchText.toLowerCase())
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

  const handleIssueTag = () => {
    rfidForm.validateFields().then(values => {
      const { rfidTag } = values;
      
      // Update data array
      const newData = data.map(item => {
        if (item.key === selectedAsset.key) {
          return { ...item, status: 'Đã gắn Tag', currentTag: rfidTag };
        }
        return item;
      });
      
      setData(newData);
      setSelectedAsset(null);
      rfidForm.resetFields();
      toast.success('Phát hành mã RFID cho tài sản thành công!');
    });
  };

  const columns = [
    { title: 'Mã tài sản', dataIndex: 'assetId', key: 'assetId' },
    { title: 'Tên tài sản / Thiết bị', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Vị trí', dataIndex: 'department', key: 'department' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: status => (
        <Tag color={status === 'Chưa gắn Tag' ? 'default' : 'success'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          type="primary" 
          ghost 
          size="small"
          onClick={() => handleSelectAsset(record)}
          disabled={record.status === 'Đã gắn Tag'}
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
                message="Chưa chọn tài sản" 
                description="Vui lòng nhấn nút Chọn ở danh sách bên trái để tiến hành gán thẻ RFID." 
                type="info" 
                showIcon 
              />
            ) : (
              <div>
                <Alert 
                  message={`Đang thao tác: ${selectedAsset.name}`} 
                  description={`Mã TS: ${selectedAsset.assetId}`} 
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
                      onClick={handleIssueTag}
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
