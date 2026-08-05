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

const generateAssets = () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      key: i.toString(),
      assetId: `VTT010${i.toString().padStart(3, '0')}C`,
      name: i % 2 === 0 ? 'Laptop Dell Vostro 3510' : 'Bơm thủy lực',
      department: i % 3 === 0 ? 'Phòng TCKT' : 'Kho vật tư BR',
      hasRFID: i % 4 !== 0,
      rfidTag: i % 4 !== 0 ? `E2801170000000000000${i.toString().padStart(4, '0')}` : '',
    });
  }
  return data;
};

const RFIDPrint = () => {
  const [data] = useState(generateAssets());
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [form] = Form.useForm();

  const filteredData = data.filter(item => 
    item.assetId.toLowerCase().includes(searchText.toLowerCase()) ||
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePrint = () => {
    if (selectedRowKeys.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 tài sản để in tem!');
      return;
    }

    form.validateFields().then(values => {
      setIsPrinting(true);
      toast.loading(`Đang gửi lệnh in ${selectedRowKeys.length} tem đến máy in ${values.printer}...`, { id: 'printing' });
      
      setTimeout(() => {
        setIsPrinting(false);
        toast.success(`Đã in thành công ${selectedRowKeys.length} tem!`, { id: 'printing' });
        setSelectedRowKeys([]);
      }, 2000);
    });
  };

  const columns = [
    { title: 'Mã tài sản', dataIndex: 'assetId', key: 'assetId', render: text => <span style={{ fontWeight: 'bold' }}>{text}</span> },
    { title: 'Tên tài sản / Thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Vị trí', dataIndex: 'department', key: 'department' },
    { 
      title: 'Trạng thái RFID', 
      dataIndex: 'hasRFID', 
      key: 'hasRFID',
      render: (hasRFID, record) => (
        hasRFID ? <Tag color="success">Đã có Tag ({record.rfidTag.slice(-4)})</Tag> : <Tag color="warning">Chưa có Tag</Tag>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
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
              message={`Đã chọn: ${selectedRowKeys.length} tài sản`}
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
  );
};

export default RFIDPrint;

