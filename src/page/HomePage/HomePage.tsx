import "./HomePage.css"
import Pisa from "../../images/披萨主图.svg"
import { useSelector,useDispatch } from "react-redux"
import { useEffect,useState,createRef, Suspense, lazy } from "react"
import Nav from "../../components/Nav/Nav.tsx"
import { useNavigate } from "react-router-dom"
import { setAppearance } from "../../redux/Store.tsx"
import {Drawer,Button,ConfigProvider, Spin} from "antd"
import axios from "../../utils/axios"
import {message} from "antd"
import { initialTasks,clearToken} from "../../redux/Store.tsx"
import { Skeleton } from 'antd';

interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;   
    description: string;
    importanceLevel:number;
    completed_date: string;
}
interface RootState {
    tasks:{
        tasks: Task[];
    }
}
interface RootState2{
    appearance:{
        appear:boolean;
    };
}

// 懒加载组件
const PieChart = lazy(() => import('../../components/PieChart/PieChart.tsx'));
const AddTaskMenu = lazy(() => import('../../components/AddTaskMenu/AddTaskMenu.tsx'));

const HomePage=()=>{
    const tasks = useSelector((state:RootState) => state.tasks.tasks);
    const appear=useSelector((state:RootState2)=>state.appearance.appear);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const addRef = createRef<HTMLDivElement>();
    const [date,setDate] = useState("");
    const [settingMenu,setSettingMenu]=useState(false);
    const [loading, setLoading] = useState(true);
    // const [dataLoaded, setDataLoaded] = useState(false);

    const openSettingMenu=()=>{
        setSettingMenu(true);
    }
    const closeSettingMenu=()=>{
        setSettingMenu(false);
    }
    // const [addTaskMenu,setAddTaskMenu] = useState(false);
    useEffect(()=>{
        const getDate=()=>{
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        setDate(getDate());
    },[])
    //过滤获取今天完成的任务
    const todayFinish=tasks.filter((task:Task)=>{
        if(task.completed && task.completed_date && task.completed_date !== 'null'){
            const taskDate=task.completed_date.split('T')[0];
            return taskDate==date;
        }
        return false;
    })

    //刷新页面时重新获取数据
    const [hasTriedFetch,setHasTriedFetch]=useState(false);
    useEffect(()=>{
        const loadData = async () => {
            // setLoading(true);
            try {
                if (tasks.length === 0 && !hasTriedFetch) {
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (token) {
                        const resTasks = await axios.get('/tasks/today');
                        dispatch(initialTasks(resTasks.data));
                        setHasTriedFetch(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [tasks,dispatch,hasTriedFetch]);
    
    //添加监听器，当添加任务菜单显示时，点击菜单外任意处，菜单消失
    useEffect(()=>{
        const handleClickOutside=(event: MouseEvent)=>{
          
            if(appear&&addRef.current&&!addRef.current.contains(event.target as Node)){
                dispatch(setAppearance());
            }
          }
            document.addEventListener('mousedown',handleClickOutside);
            return ()=>document.removeEventListener('mousedown',handleClickOutside);
  
        
      },[appear,addRef,dispatch])

      const handleLogout=()=>{
        const token=localStorage.getItem('token')||sessionStorage.getItem('token');
        if(!token){
            message.error('请先登录');
            return;
        }
        dispatch(clearToken());
        navigate("/Login_Register");
        //刷新页面
        window.location.reload();
      }



    if (loading) {
        return (
            <div className="HomePage-container">
                <Skeleton.Image active className="main-image-skeleton" />
                <div className="finish-content">
                    <Skeleton active paragraph={{ rows: 4 }} />
                </div>
                <Skeleton.Button active className="Setting-Icon" />
                <Skeleton.Button active className="addTask" />
                <div className="chart-skeleton">
                    <Skeleton.Image active />
                </div>
                <Nav />
            </div>
        );
    }

    return(
        <div className="HomePage-container">
            <img src={Pisa} alt="" className={`${appear?"blur":""}`}/>
            <div className={`finish-content   ${appear?"blur":""}`}>
                //{date}---今天完成了
                {todayFinish.map((task:Task, index:number) => {
                    return (
                    <div key={index} className="finish-item">
                        <p id="finish-item-event">{task.event}</p>
                        <p id="finish-item-description">{task.description}</p>  
                    </div>

                    )  
                })}
            </div>
            <div>
            <ConfigProvider
                theme={{
                    components: {
                    Button: {
                        colorIconHover:"#FFBB8E",
                        colorIcon:"#FFBB8E",
                    },
                    },
                }}
                >

                <Button type="primary" onClick={openSettingMenu} className="Setting-Icon Bgi" ></Button>
                <Drawer title="Self-Center" onClose={closeSettingMenu} open={settingMenu} >
                    <p><button className="Login_Register" onClick={()=>navigate("/Login_Register")}>登录/注册</button></p>
                    <p><button className="Review" onClick={()=>navigate("/Review")}>完成回顾</button></p> 
                    <p><button className="aboutUs" onClick={()=>navigate("/Review")}>关于我们</button></p> 
                    <p><button className="Logout" onClick={()=>handleLogout()}>退出登录</button></p> 
                     
                </Drawer>
            </ConfigProvider>    
            </div>
            {/* <button className="Setting-Icon Bgi" onClick={()=>setSettingMenu(!settingMenu)}></button>
            {settingMenu&&<div className="Setting-Menu-Container">
                <button className="Review" onClick={()=>navigate("/review")}>完成回顾</button>
                <button className="Self-Setting" onClick={()=>navigate("/selfSetting")}>个人中心</button>
            </div>} */}
            <button className="addTask Bgi" onClick={()=>dispatch(setAppearance())}></button>
            <Suspense fallback={<Spin className="chart-loading" />}>
                <PieChart/>
            </Suspense>
            {appear&&(
                <Suspense fallback={<Spin className="menu-loading" />}>
                    <AddTaskMenu ref={addRef}/>
                </Suspense>
            )}
            <Nav/>  
        </div>
    )

}
export default HomePage;  

