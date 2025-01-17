import "./ListPage.css";
import { useState, useEffect,createRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {  deleteTask, updateTaskImportanceAsync,finishTask ,isCycle, modify } from '../../redux/Store.tsx';
import { DragDropContext, Draggable, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import Nav from "../../components/Nav/Nav";
import AddTaskMenu from "../../components/AddTaskMenu/AddTaskMenu.tsx";
import { setAppearance } from "../../redux/Store.tsx"
import { Button } from "antd";
import{EditOutlined, CheckOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';
import { initialTasks } from "../../redux/Store.tsx"
import { AppDispatch } from '../../redux/Store';


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
interface RootState3{//注意层级结构
  modifyTask:{
    modifyTask:{
      id:string;
      event:string;
      description:string;
      isCycle:boolean;
      completed:boolean;
      importanceLevel:number;
      completed_date:string;
    };
  }
}
interface DragResult {
  source: {
      index: number;
  };
  destination: {
      index: number;
  } | null;
}

const ListPage = () => {
  const modifyTask=useSelector((state:RootState3) => state.modifyTask.modifyTask)
    const [date,setDate] = useState("");
    const addRef = createRef<HTMLDivElement>();
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [filteredTasks, setFilteredTasks] = useState(tasks.filter((task:Task) => {
      if (!task.completed) return true;
      
      if (task.is_cycle) {
        const taskDate = task.completed_date.split('T')[0];
        return taskDate != date;
      }
      
      return false;
    }));
    // console.log(tasks[0].completed_Date!=date);
    // const filteredTasks = tasks.filter((task:Task) =>(task.completed==false||task.is_cycle==true&&task.completed_Date!=date));

     //刷新页面时重新获取数据
     const [hasTriedFetch, setHasTriedFetch] = useState(false);

     useEffect(() => {
       const token = localStorage.getItem('token');
       // 只在有 token 且没有任务且没有尝试过获取数据时获取
       if (token && tasks.length === 0 && !hasTriedFetch) {
         const getData = async () => {
           try {
             const resTasks = await axios.get('/tasks/today');
             dispatch(initialTasks(resTasks.data));
             setHasTriedFetch(true);
           } catch (error) {
             console.error('Error fetching data:', error);
           }
         };
         getData();
       }
     }, [tasks.length, hasTriedFetch, dispatch]);  // 添加合适的依赖项,使用 hasTriedFetch 标记避免重复请求

    const appear=useSelector((state:RootState2)=>state.appearance.appear)
    const handleDelete=(taskId:string)=>{//参数要用id不用index，因为index会变化从而导致错乱
        dispatch(deleteTask(taskId));
    }

    const handleModify=(taskId:string)=>{
      const taskToModify=tasks.find((task:Task) => task.id===taskId);
      if(taskToModify){
        dispatch(modify({id:taskId,event:taskToModify.event,description:taskToModify.description,isCycle:taskToModify.is_cycle
          ,completed:taskToModify.completed,importanceLevel:taskToModify.importanceLevel,completed_date:taskToModify.completed_date
        }));
        dispatch(setAppearance());
      }
    }

    
    const handleFinish=(taskId:string)=>{

        dispatch(finishTask(taskId));
  }

  const onDragEnd = (result: DragResult) => {
    if (!result.destination) return;
    //注意filteredTasks的索引和tasks的索引不一致，所以要用filteredTasks的索引来获取任务
    // 获取源和目标的索引
    const filteredSourceIndex = result.source.index;
    const filteredDestinationIndex = result.destination.index;

    // 从 filteredTasks 获取的任务
    const sourceTask = filteredTasks[filteredSourceIndex];
    const destinationTask = filteredTasks[filteredDestinationIndex];

    // 从原始 tasks 数组中找到源和目标任务的索引
    const sourceIndexInTasks = tasks.findIndex(task => task.id === sourceTask.id);
    const destinationIndexInTasks = tasks.findIndex(task => task.id === destinationTask.id);

    // 重新排列任务
    const newTodos = [...tasks];
    const [removedTodo] = newTodos.splice(sourceIndexInTasks, 1); // 移除被拖动的任务
    newTodos.splice(destinationIndexInTasks, 0, removedTodo); // 插入到新位置

    // Dispatch the updated order
    dispatch(updateTaskImportanceAsync(newTodos)); // 更新Redux store


        
    };
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

    useEffect(() => {
      setFilteredTasks(
        tasks.filter((task:Task) => {
          if (!task.completed) return true;
          
          if (task.is_cycle) {
            const taskDate = task.completed_date.split('T')[0];
            return taskDate != date;
          }
          
          return false;
        })
      );
    }, [tasks, date]);  // 添加依赖项

    //添加菜单栏消失则清空modifyTask
    useEffect(() => {
      if(!appear){
      dispatch(modify({id:'',event:'',description:'',isCycle:false}))
      }
    },[appear,dispatch])

    //测试modifyTask是否能正常更新
  //   useEffect(() => {
  //     console.log("modify task event after dispatch:", modifyTask.event);
  //     console.log("modify task description after dispatch:", modifyTask.description);
  // }, [modifyTask]);

    //点击添加菜单外任意处关闭菜单
    useEffect(()=>{
      const handleClickOutside=(event: MouseEvent)=>{
        
          if(appear&&addRef.current&&!addRef.current.contains(event.target as Node)){
              dispatch(setAppearance());
          }
        }
          document.addEventListener('mousedown',handleClickOutside);
          return ()=>document.removeEventListener('mousedown',handleClickOutside);

      
    },[appear,addRef,dispatch])
    return(
        <div className="ListPage-container">
        <div className="show-Date">{date}</div>
        <button id="addListTask" className="Bgi" onClick={()=>dispatch(setAppearance())}></button>
        <DragDropContext
      onDragEnd={onDragEnd}
      >
    
    <div id="task-list-container"  className={`${appear?"blur":""}`}>
      <Droppable droppableId="todo">
          {((provided:DroppableProvided)=>(
              <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
          {filteredTasks.map((task:Task, index:number) => (
<Draggable index={index} key={task.id} draggableId={task.id}> 
  {(provided) => {


  return (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {/* 双击删除任务 */}
          <div className="task" onDoubleClick={()=>handleDelete(task.id)}> 
          {task.is_cycle ? (
            <button 
              className="limited-time" 
              onClick={() => dispatch(isCycle(task.id))}
            >
              循环
            </button>
          ) : (
            <button 
              className="cycle-time" 
              onClick={() => dispatch(isCycle(task.id))}
            >
              限时
            </button>
          )}
          <Button shape="round" icon={<CheckOutlined />} className="finishTask " onClick={()=>handleFinish(task.id)} type="primary"></Button>
          <Button shape="round" icon={<EditOutlined />} className="editTask " onClick={()=>handleModify(task.id)} type="primary"></Button>
          <p className='taskListName'>{task.event}</p>
          <p className='task-description'>{task.description}</p>      
        </div>
      </div>

    );
  }}
</Draggable> 

        
  ))}   
        {provided.placeholder}   
              </div>
            
          ))}
    </Droppable>
    </div>
    </DragDropContext>
    {appear&&<AddTaskMenu ref={addRef} taskId={modifyTask.id}/>}
    <Nav/>

  </div>
           
    )
}
export default ListPage





