import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, } from 'antd';
import './Login_Register.css';
import Nav from '../../components/Nav/Nav';
import { useState } from 'react';
import axios from 'axios';
import {setToken,initialTasks,initialWishes} from '../../redux/Store.tsx';
import { useDispatch } from 'react-redux';

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login_Register: React.FC = () => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister]=useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [remember, setRemember] = useState(true);

  const initialize=()=>{
    const initialization = async () => {
      //發送用戶信息
      try {
        if(isRegister){
          const res= await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/register`,
            JSON.stringify({username, email, password}),
          )
          setToken(res.data.token);
          if(remember){
            localStorage.setItem('token',res.data.token );
          }
          //獲取今日任務和用戶心願
          const resTasks= await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks`,{
            headers:{
              Authorization: `Bearer ${res.data.token}`
            }
          })
          const resWishes= await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes`,{
            headers:{
              Authorization: `Bearer ${res.data.token}`
            }
          })
          dispatch(initialTasks(resTasks.data));
          dispatch(initialWishes(resWishes.data));
        }else{
          const res= await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/login`,
            JSON.stringify( {username, password}),
          )
          setToken(res.data.token);
          if(remember){
            localStorage.setItem('token',res.data.token );
          }
          //獲取今日任務和用戶心願
          const resTasks= await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks`,{
            headers:{
              Authorization: `Bearer ${res.data.token}`
            }
          })
          const resWishes= await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes`,{
            headers:{
              Authorization: `Bearer ${res.data.token}`
            }
          })
          dispatch(initialTasks(resTasks.data));
          dispatch(initialWishes(resWishes.data));
        }

        // Clear localStorage when logged in
        localStorage.removeItem('tasks');
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    };

    initialization();
    setUsername('');
    setEmail('');
    setPassword('');
    setPassword2('');
    setIsRegister(false);
    setRemember(true);
  }
  return(
  <div id="login_register">
  <div id="login_register_title"><button id="login_register_title_button" onClick={()=>setIsRegister(false)}>登录</button><button id="login_register_title_button" onClick={()=>setIsRegister(true)}>注册</button></div>
  <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item<FieldType>
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
    </Form.Item>

    {isRegister && (<Form.Item<FieldType> name="email"label="Email" rules={[{ type: 'email' }]}>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
    </Form.Item>
    )}

    <Form.Item<FieldType>
      label="password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
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
        <Input value={password2} onChange={(e) => setPassword2(e.target.value)} />
        </Form.Item>
    )}

    <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
      <Checkbox value={remember} onChange={(e) => setRemember(e.target.checked)}>Remember me</Checkbox>
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit" onClick={()=>initialize()}>
        Submit
      </Button >
    </Form.Item>
  </Form>
  <Nav />
  </div>  
  )
};    

export default Login_Register;