import "./PersonalReview..css"
import { useSelector} from "react-redux";
import { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { zhCN } from 'date-fns/locale';
import Nav from "../../components/Nav/Nav";
import axios from '../../utils/axios';
// import { Timeline } from "antd";
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
interface TokenState{
    token:{
        token:string;
    }
}
const PersonalReview = () => {
    const token=useSelector((state:TokenState)=>state.token.token);
    const tasks=useSelector((state:RootState)=>state.tasks.tasks);
    const [hasTriedFetch,setHasTriedFetch]=useState(false);
    const [finishTasks,setFinishTasks]=useState(token?[]:tasks.filter((task:Task)=>task.completed===true));
    useEffect(() => {
        if (token && !hasTriedFetch) {  // 只在未获取过数据时执行
            const getFinishTasks = async () => {
                try {
                    const res = await axios.get(
                        `/tasks/timeline`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    // 对获取的数据进行排序
                    // const sortedData = [...res.data].sort((a: Task, b: Task) => {
                    //     const dateA = a.completed_Date ? parseISO(a.completed_Date) : new Date(0);
                    //     const dateB = b.completed_Date ? parseISO(b.completed_Date) : new Date(0);
                    //     return dateB.getTime() - dateA.getTime();
                    // });
                    setFinishTasks(res.data);
                    setHasTriedFetch(true);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            };
            getFinishTasks();
        }
        if(!token&&!hasTriedFetch){
            const sortedData = [...tasks].sort((a: Task, b: Task) => {
                const dateA = a.completed_date && a.completed_date !== 'null' ? parseISO(a.completed_date) : new Date(0);
                const dateB = b.completed_date && b.completed_date !== 'null' ? parseISO(b.completed_date) : new Date(0);
                return dateB.getTime() - dateA.getTime();
            });
            setFinishTasks(sortedData);
            setHasTriedFetch(true);
        }
    }, [token, hasTriedFetch,tasks]);  // 移除 finishTasks 依赖
    return(
        <div className="personal-review-container">
            <p id="personal-review-title">{finishTasks.length? "--------------------------------------Time Line------------------------------------":"------------------------------------暂未有任何任务完成喔------------------------------------"}</p>
            <div className="personal-review">
                {finishTasks.map((task:Task,index:number)=>{
                    const formattedDate = task.completed_date && task.completed_date !== 'null' ? 
                        format(parseISO(task.completed_date), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN }) 
                        : '';
                    return(
                        <div className="personal-review-item" key={index}>
                            <div className="personal-review-node"></div>
                            <p className="personal-review-item-date">{formattedDate}</p>
                            <p className="personal-review-item-event">{task.event}</p>
                            <p className="personal-review-item-description">{task.description}</p>
                        </div>
                    )
                })}
            </div>
            {/* <Timeline mode="left" items={[{label:finishTasks.map((task:Task)=>{return(task.completed_Date)}),children:finishTasks.map((task:Task)=>{return(task.event)})}]}></Timeline> */}

            <Nav />
        </div>
    )
}
export default PersonalReview;