import { useNavigate } from "react-router-dom"
import {useEffect} from "react";
import "./StartPage.css";
import StartImg from "../../images/开屏.svg";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getTasks,getWishes } from "../../redux/Store";
const StartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 获取token，如果有token，则获取todolist数据并更新redux
  useEffect(()=>{
    const getData=async()=>{
      const token = localStorage.getItem('token');
      if(token){
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/todolist`,{headers:{Authorization:`Bearer ${token}`}});
      const res=await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/todolist/wish`,{headers:{Authorization:`Bearer ${token}`}})
      dispatch(getTasks(response.data));
      dispatch(getWishes(res.data));
      }
    };
    getData();
  },[]);  
  useEffect(() => {
    // 设置定时器，3秒后执行跳转函数
    const timer = setTimeout(() => {
      navigate('/Home');
    }, 3000);

    // 在组件卸载时清除定时器，避免内存泄漏
    return () => clearTimeout(timer);
  }, []);
  return( 
  <div className="start-page">
    <img src={StartImg} alt="logo" className="Start-img"/>
  </div>
  );
};

export default StartPage;