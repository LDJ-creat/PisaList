import "./PersonalReview..css"
import { useSelector} from "react-redux";
import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import Nav from "../../components/Nav/Nav";
const PersonalReview = () => {
    let tasks=useSelector((state:any)=>state.tasks.tasks);
    const [finishTasks,setFinishTasks]=useState(tasks.filter((task:any)=>task.completed===true));
    useEffect(() => {
        // 对获取的数据进行排序
        if (finishTasks.length > 0) {
            const sortedData = finishTasks.sort((a: any, b: any) => {
                // 确保a和b都有有效的timestamp属性，若没有则给予默认值
                const dateA = a.timestamp? parseISO(a.timestamp) : new Date(0);
                const dateB = b.timestamp? parseISO(b.timestamp) : new Date(0);
                return dateB.getTime() - dateA.getTime();
            });
            setFinishTasks(sortedData);
        }
    }, []);
    return(
        <div className="personal-review-container">
            <div className="personal-review">
                {finishTasks.map((task:any,index:number)=>{
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