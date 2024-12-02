import "./HomePage.css"
import Pisa from "../../images/披萨主图.svg"
import { useSelector,useDispatch } from "react-redux"
import { useEffect,useState} from "react"
import Nav from "../../components/Nav/Nav.tsx"
import PieChart from "../../components/PieChart/PieChart.tsx"
import { useNavigate } from "react-router-dom"
import AddTaskMenu from "../../components/AddTaskMenu/AddTaskMenu.tsx";
import { setAppearance } from "../../redux/Store.tsx"

interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;
    description: string;
    importanceLevel:number;
    completed_Date: string;
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
const HomePage=()=>{
    const tasks = useSelector((state:RootState) => state.tasks.tasks);
    const appear=useSelector((state:RootState2)=>state.appearance.appear)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [date,setDate] = useState("");
    const [settingMenu,setSettingMenu]=useState(false);
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
    return(
        <div className="HomePage-container">
            <img src={Pisa} alt="" className={`${appear?"blur":""}`}/>
            <div className={`finish-content   ${appear?"blur":""}`}>
                //{date}---今天完成了
                {tasks.map((task:Task, index:number) => {
                    return task.completed&&task.completed_Date==date?(
                    <div key={index} className="finish-item">
                        {task.event}---{task.description}
                    </div>

                    ):null;
                })}
            </div>

            <button className="Setting-Icon Bgi" onClick={()=>setSettingMenu(!settingMenu)}></button>
            {settingMenu&&<div className="Setting-Menu-Container">
                <button className="Review" onClick={()=>navigate("/review")}>完成回顾</button>
                <button className="Self-Setting" onClick={()=>navigate("/selfSetting")}>个人中心</button>
            </div>}
            <button className="addTask Bgi" onClick={()=>dispatch(setAppearance())}></button>
            <PieChart/>
            {appear&&<AddTaskMenu/>}
            <Nav/>
        </div>
    )

}
export default HomePage;