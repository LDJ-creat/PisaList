import "./PersonalReview..css"
import { useSelector} from "react-redux";
import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import Nav from "../../components/Nav/Nav";
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
const PersonalReview = () => {
    const tasks=useSelector((state:RootState)=>state.tasks.tasks);
    const [finishTasks,setFinishTasks]=useState(tasks.filter((task:Task)=>task.completed===true));
    useEffect(() => {
        // 对获取的数据进行排序
        if (finishTasks.length > 0) {
            const sortedData = finishTasks.sort((a: Task, b: Task) => {
                // 确保a和b都有有效的timestamp属性，若没有则给予默认值
                const dateA = a.completed_Date? parseISO(a.completed_Date) : new Date(0);
                const dateB = b.completed_Date? parseISO(b.completed_Date) : new Date(0);
                return dateB.getTime() - dateA.getTime();//用getTime()方法获取时间戳(毫秒)，进行比较
            });
            setFinishTasks(sortedData);
        }
    }, []);
    return(
        <div className="personal-review-container">
            <div className="personal-review">
                {finishTasks.map((task:Task,index:number)=>{
                    return(
                        <div className="personal-review-item" key={index}>
                            <div className="personal-review-node"></div>
                            <p className="personal-review-item-date">{task.completed_Date}</p>
                            <p className="personal-review-item-event">{task.event}</p>
                            <p className="personal-review-item-description">{task.description}</p>
                        </div>
                    )
                })}
            </div>
            <Nav />
        </div>
    )
}
export default PersonalReview;