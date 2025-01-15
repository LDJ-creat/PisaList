import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import './Login_Register.css';
import Nav from '../../components/Nav/Nav';
import { useState } from 'react';
import axios from 'axios';
import { setToken, initialTasks, initialWishes } from '../../redux/Store.tsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// 设置 axios 默认配置
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  remember?: string;
};

const Login_Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [remember, setRemember] = useState(true);

  const initialize = () => {
    const initialization = async () => {
      const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;
      
      try {
        // 在发送请求前验证必填字段
        if (isRegister) {
          if (!username || !password || !email) {
            message.error('请填写所有必填字段！');
            return;
          }

          const res = await axios.post(
            `${baseURL}/register`,
            {
              Username: username,
              Password: password,
              Email: email
            }
          );

          if (res.data.error) {
            message.error(res.data.error);
            return;
          }

          setToken(res.data.token);
          if (remember) {
            localStorage.setItem('token', res.data.token);
          } else {
            sessionStorage.setItem('token', res.data.token);
          }

          // 获取今日任务和用户心愿
          const resTasks = await axios.get(
            `${baseURL}/tasks/today`,
            {
              headers: {
                'Authorization': `Bearer ${res.data.token}`
              }
            }
          );

          const resWishes = await axios.get(
            `${baseURL}/wishes`,
            {
              headers: {
                'Authorization': `Bearer ${res.data.token}`
              }
            }
          );

          dispatch(initialTasks(resTasks.data));
          dispatch(initialWishes(resWishes.data));
          message.success("注册成功");
          navigate('/home');
        } else {
          const res = await axios.post(
            `${baseURL}/login`,
            {
              username,
              password
            }
          );

          if (res.data.error) {
            message.error(res.data.error);
            return;
          }

          setToken(res.data.token);
          if (remember) {
            localStorage.setItem('token', res.data.token);
          } else {
            sessionStorage.setItem('token', res.data.token);
          }

          // 获取今日任务和用户心愿
          const resTasks = await axios.get(
            `${baseURL}/tasks/today`,
            {
              headers: {
                'Authorization': `Bearer ${res.data.token}`
              }
            }
          );


          const resWishes = await axios.get(
            `${baseURL}/wishes`,
            {
              headers: {
                'Authorization': `Bearer ${res.data.token}`
              }
            }
          );

          dispatch(initialTasks(resTasks.data));
          dispatch(initialWishes(resWishes.data));
          message.success("登录成功");
          navigate('/home');
        }

        localStorage.removeItem('tasks');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || '操作失败，请重试';
          message.error(errorMessage);
          console.error('Error details:', error.response?.data);
        }
        console.error('Failed:', error);
        return; // 出错时提前返回，不清空表单
      }
    };

    initialization();
    // 只有在成功后才清空表单
    // setUsername('');
    // setEmail('');
    // setPassword('');
    // setPassword2('');
    // setIsRegister(false);
    // setRemember(true);
  };

  return (
    <div id="login_register">
      <div id="login_register_title">
        <button id="login_register_title_button" onClick={() => setIsRegister(false)}>登录</button>
        <button id="login_register_title_button" onClick={() => setIsRegister(true)}>注册</button>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>

        {isRegister && (
          <Form.Item<FieldType>
            name="email"
            label="Email"
            rules={[{ type: 'email' }]}
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
        )}

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
        </Form.Item>

        {isRegister && (
          <Form.Item
            label="Confirm Password"
            name="password2"
            dependencies={['password']}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password value={password2} onChange={(e) => setPassword2(e.target.value)} />
          </Form.Item>
        )}

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
        >
          <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" onClick={initialize}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Nav />
    </div>
  );
};

export default Login_Register; 