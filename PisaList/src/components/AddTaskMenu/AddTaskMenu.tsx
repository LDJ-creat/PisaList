import { useState, forwardRef } from 'react';
import './AddTaskMenu.css';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/Store.tsx';
import { setAppearance } from "../../redux/Store.tsx"

interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;
    description: string;
    importanceLevel: number;
    completed_Date: string;
}

const AddTask = forwardRef<HTMLDivElement, { [key: string]: unknown }>((_props, ref) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [isCycle, setIsCycle] = useState(false);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();//
        if (!value) return;
        setValue('');
        setDescription('');
        if (value.trim() !== '') {
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
