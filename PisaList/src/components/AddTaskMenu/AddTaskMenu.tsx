import { useState, forwardRef } from 'react';
import './AddTaskMenu.css';
import { useDispatch,useSelector } from 'react-redux';
import { addTask,modify_Task } from '../../redux/Store.tsx';
import { setAppearance} from "../../redux/Store.tsx"

interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;
    description: string;
    importanceLevel: number;
    completed_Date: string;
}

interface ModifyTask{
    modifyTask:{
        modifyTask:{
            id:string;
            event:string;
            description:string;
            isCycle:boolean;
            completed:boolean;
            importanceLevel:number;
            completed_Date:string;
        }
    }
}

const AddTask = forwardRef<HTMLDivElement, { [key: string]: unknown,taskId?:string }>(({taskId}, ref) => {
    const dispatch = useDispatch();
    const modifyTask=useSelector((state:ModifyTask)=>state.modifyTask.modifyTask)
    const [value, setValue] = useState(modifyTask.event);
    const [description, setDescription] = useState(modifyTask.description);
    const [isCycle, setIsCycle] = useState(modifyTask.isCycle);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // e.stopPropagation();
        if (taskId) {
            if (!value&&value.trim() === '') return;
            if(typeof taskId!=='string') return;
            // dispatch(modify({id:taskId,event:value,description:description,isCycle:isCycle}))
            const newTask: Task = {
                id: taskId,
                event: value,
                completed: modifyTask.completed,
                is_cycle: isCycle,
                description: description,
                importanceLevel: modifyTask.importanceLevel,
                completed_Date: modifyTask.completed_Date,
            };
            dispatch(modify_Task(newTask))//这样写无法实现修改，因为执行这步时modifyTask还未被修改，所以还是原来的值
            dispatch(setAppearance());
            // setValue('');
            // setDescription('');
        }else{
            if (!value&&value.trim() === '') return;
            // setValue('');
            // setDescription('');
        
            const newTask: Task = {
                id: Date.now().toString(),
                event: value,
                completed: false,
                is_cycle: isCycle,
                description: description,
                importanceLevel: 0,
                completed_Date: '',
            };
            dispatch(addTask(newTask));
            dispatch(setAppearance());
            
        }
    };

    return (
        <div id='addTaskMenu' className='Bgi' ref={ref}>
            <input 
                type="text"  
                placeholder="输入代办名称" 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                id='taskName'
            ></input>
            <div id='Rectangle'>————————————————</div>
            <input 
                type="text"  
                placeholder="描述or详细介绍(例如具体项目、时间)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                id='taskDescription'
            ></input>
            <div id='setTaskCycle'>
                <button 
                    id='isTaskCycle' 
                    className='Bgi' 
                    onClick={() => setIsCycle(!isCycle)}
                ></button>
                {isCycle && <button 
                    id='TaskCycle' 
                    className='Bgi' 
                    onClick={() => setIsCycle(!isCycle)}
                ></button>}
            </div>
            <button 
                onClick={handleSubmit} 
                id='addTaskButton' 
                className='Bgi' 
            ></button>
        </div>
    );
});

export default AddTask;
