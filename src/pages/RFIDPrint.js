import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';
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
  Select,
  Alert,
  Form,
  InputNumber
} from 'antd';
import { 
  SearchOutlined, 
  PrinterOutlined,
  SettingOutlined,
  BarcodeOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const RFIDPrint = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState(location.state?.selectedRowKeys || []);
  const [isPrinting, setIsPrinting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/assets');
      if (res.data.success) {
        setData(res.data.data);
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

  const handlePrint = () => {
    if (selectedRowKeys.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 tài sản để in tem!');
      return;
    }

    form.validateFields().then(values => {
      setIsPrinting(true);
      
      setTimeout(() => {
        setIsPrinting(false);
        document.body.classList.add('printing-labels');
        window.print();
        document.body.classList.remove('printing-labels');
        toast.success(`Đã phát lệnh in thành công!`, { id: 'printing' });
      }, 500);
    });
  };

  const columns = [
    { title: 'Mã tài sản', dataIndex: 'id', key: 'id', render: text => <span style={{ fontWeight: 'bold' }}>{text}</span> },
    { title: 'Tên tài sản / Thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location', render: text => text || 'Kho vật tư BR' },
    { 
      title: 'Trạng thái RFID', 
      dataIndex: 'rfid', 
      key: 'rfid',
      render: (rfid) => (
        rfid ? <Tag color="success">Đã có Tag ({rfid.slice(-4)})</Tag> : <Tag color="warning">Chưa có Tag</Tag>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const selectedAssetsToPrint = data.filter(item => selectedRowKeys.includes(item.keyId));

  return (
    <>
      <div id="printable-area">
        {selectedAssetsToPrint.map((asset, idx) => (
          <div key={idx} style={{ 
            width: '8cm', 
            height: '4cm', 
            padding: '10px', 
            border: '1px solid #000', 
            margin: '10px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            pageBreakInside: 'avoid'
          }}>
            <strong style={{ fontSize: '14px', marginBottom: '4px' }}>Mã TS: {asset.id}</strong>
            <span style={{ fontSize: '10px', textAlign: 'center', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {asset.name}
            </span>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${asset.id}`} 
              alt={asset.id} 
              style={{ width: '60px', height: '60px' }}
            />
            {asset.rfid && (
              <span style={{ fontSize: '8px', marginTop: '4px' }}>RFID: {asset.rfid.slice(-6)}</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>In Tem Nhãn / Barcode RFID</Title>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Card 
            title="Danh sách Tài sản cần in tem" 
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
              rowSelection={rowSelection}
              columns={columns} 
              dataSource={filteredData}
              rowKey="keyId"
              loading={loading}
              pagination={{ pageSize: 8 }} 
              size="small"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card 
            title={<><SettingOutlined /> Cấu hình Lệnh in</>} 
            variant="borderless" 
            style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}
          >
            <Alert 
              title={`Đã chọn: ${selectedRowKeys.length} tài sản`}
              type="info" 
              showIcon 
              style={{ marginBottom: 24 }}
            />
            
            <Form form={form} layout="vertical" initialValues={{ printer: 'zebra1', copies: 1 }}>
              <Form.Item name="printer" label="Chọn máy in đích" rules={[{ required: true }]}>
                <Select placeholder="Chọn máy in Zebra">
                  <Option value="zebra1">Zebra ZT411 (192.168.1.100)</Option>
                  <Option value="zebra2">Zebra ZD621 (192.168.1.105)</Option>
                </Select>
              </Form.Item>

              <Form.Item name="template" label="Mẫu tem in (Template)" rules={[{ required: true }]}>
                <Select placeholder="Chọn mẫu thiết kế tem">
                  <Option value="temp1">Tem chuẩn 4x6 cm (Có Barcode & Text)</Option>
                  <Option value="temp2">Tem nhỏ 2x3 cm (Chỉ mã QR)</Option>
                </Select>
              </Form.Item>

              <Form.Item name="copies" label="Số bản sao mỗi tem">
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>

              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <BarcodeOutlined style={{ fontSize: 64, color: '#bfbfbf', marginBottom: 16 }} />
                <br />
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PrinterOutlined />} 
                  style={{ width: '100%' }}
                  onClick={handlePrint}
                  loading={isPrinting}
                  disabled={selectedRowKeys.length === 0}
                >
                  Phát Lệnh In Tem
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
      </div>
    </>
  );
};

export default RFIDPrint;
