import { useState, forwardRef } from 'react';
import './AddTaskMenu.css';
import { useDispatch, useSelector } from 'react-redux';
import { modify_Task, addTaskAsync} from '../../redux/Store.tsx';
import { setAppearance } from "../../redux/Store.tsx";
import axios from '../../utils/axios';
import { AxiosError } from 'axios';
import { message } from 'antd';
import { AppDispatch } from '../../redux/Store';

// 设置 axios 默认配置
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;
    description: string;
    importanceLevel: number;
    completed_date: string;
}

interface ModifyTask {
    modifyTask: {
        modifyTask: {
            id: string;
            event: string;
            description: string;
            isCycle: boolean;
            completed: boolean;
            importanceLevel: number;
            completed_date: string;
        }
    }
}

const AddTask = forwardRef<HTMLDivElement, { [key: string]: unknown, taskId?: string }>(({ taskId }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const modifyTask = useSelector((state: ModifyTask) => state.modifyTask.modifyTask);
    const [value, setValue] = useState(modifyTask.event);
    const [description, setDescription] = useState(modifyTask.description);
    const [isCycle, setIsCycle] = useState(modifyTask.isCycle);



    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!value || value.trim() === '') {
            message.error('请输入任务名称');
            return;
        }

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        try {
            if (taskId && typeof taskId === 'string') {
                // 修改任务
               
                const newTask: Task = {
                    id: modifyTask.id,
                    event: value,
                    completed: modifyTask.completed,
                    is_cycle: isCycle,
                    description: description,
                    importanceLevel: modifyTask.importanceLevel,
                    completed_date: modifyTask.completed_date,
                };
                if(token){
                await axios.put(
                    `/tasks/${modifyTask.id}`,
                    {
                        event: value,
                        description: description,
                        is_cycle: isCycle,
                        importance_level: modifyTask.importanceLevel,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }

                dispatch(modify_Task(newTask));
                message.success('修改成功');
            } else {
                const newTask = {
                    id: Date.now().toString(),
                    event: value,
                    completed: false,
                    is_cycle: isCycle,
                    description: description,
                    importanceLevel: 0,
                    completed_date: '',
                };

                await dispatch(addTaskAsync(newTask)).unwrap();
                message.success('添加成功');
            }

            dispatch(setAppearance());
            setValue('');
            setDescription('');
            setIsCycle(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error || '操作失败，请重试';
                message.error(errorMessage);
                console.error('Error details:', error.response?.data);
            }
            console.error('Failed:', error);
        }
        }

    // 修改事件处理函数名和类型
    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!value || value.trim() === '') {
                message.error('请输入任务名称');
                return;
            }
            await handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    return (
        <div id='addTaskMenu' className='Bgi' ref={ref}>
            <input 
                type="text"  
                placeholder="输入代办名称" 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                onKeyDown={handleKeyDown}  // 使用 onKeyDown
                id='taskName'
            />
            <div id='Rectangle'>————————————————</div>
            <input 
                type="text"  
                placeholder="描述or详细介绍(例如具体项目、时间)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                onKeyDown={handleKeyDown}  // 使用 onKeyDown
                id='taskDescription'
            />
            <div id='setTaskCycle'>
                <button 
                    id='isTaskCycle' 
                    className='Bgi' 
                    onClick={() => setIsCycle(!isCycle)}
                />
                {isCycle && (
                    <button 
                        id='TaskCycle' 
                        className='Bgi' 
                        onClick={() => setIsCycle(!isCycle)}
                    />
                )}
            </div>
            <button 
                onClick={handleSubmit} 
                id='addTaskButton' 
                className='Bgi' 
            />
        </div>
    );
});

export default AddTask;
