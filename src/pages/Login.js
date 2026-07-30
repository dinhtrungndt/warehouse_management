import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Layout, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    localStorage.setItem('isAuthenticated', 'true');
    toast.success('Đăng nhập thành công! Chào mừng trở lại.', {
      duration: 3000,
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    });
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Row style={{ flex: 1 }}>
        {/* Left Side - Branding / Image */}
        <Col
          xs={0} sm={0} md={12} lg={14} xl={16}
          style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: '40px'
          }}
        >
          <div style={{ maxWidth: 500, textAlign: 'center' }}>
            {/* VFT / TMTech / PVGAS Branding */}
            <Title style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>TMTech PVGAS</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
              Hệ thống Quản lý và Kiểm kê Tài sản, Vật tư bằng công nghệ RFID
            </Text>
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col
          xs={24} sm={24} md={12} lg={10} xl={8}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px',
            background: 'white',
            boxShadow: '-10px 0 20px -10px rgba(0,0,0,0.1)',
            zIndex: 1
          }}
        >
          <div style={{ maxWidth: 400, margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>Đăng Nhập</Title>
              <Text type="secondary">Chào mừng bạn quay lại hệ thống</Text>
            </div>

            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Tên đăng nhập (vd: admin)" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="#!" style={{ float: 'right' }}>
                  Quên mật khẩu?
                </a>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default Login;
