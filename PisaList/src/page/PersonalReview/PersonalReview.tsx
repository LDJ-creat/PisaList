import "./PersonalReview..css"
import { useSelector} from "react-redux";
import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import Nav from "../../components/Nav/Nav";
// import { Timeline } from "antd";
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
    }, [finishTasks]);
    return(
        <div className="personal-review-container">
            <p id="personal-review-title">{finishTasks.length? "--------------------------------------Time Line------------------------------------":"------------------------------------暂未有任何任务完成喔------------------------------------"}</p>
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
            {/* <Timeline mode="left" items={[{label:finishTasks.map((task:Task)=>{return(task.completed_Date)}),children:finishTasks.map((task:Task)=>{return(task.event)})}]}></Timeline> */}

            <Nav />
        </div>
    )
}
export default PersonalReview;