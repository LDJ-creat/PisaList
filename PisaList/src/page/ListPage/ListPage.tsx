import "./ListPage.css";
import { useState, useEffect,createRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {  deleteTask, updateTask,finishTask ,isCycle, modify } from '../../redux/Store.tsx';
import { DragDropContext, Draggable, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import Nav from "../../components/Nav/Nav";
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
interface RootState3{//注意层级结构
  modifyTask:{
    modifyTask:{
      id:string;
      event:string;
      description:string;
      isCycle:boolean;
      completed:boolean;
      importanceLevel:number;
      completed_Date:string;
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
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const [filteredTasks,setFilteredTasks]=useState(tasks.filter((task:Task) =>(task.completed==false||task.is_cycle==true&&task.completed_Date!=date)));
    // const filteredTasks = tasks.filter((task:Task) =>(task.completed==false||task.is_cycle==true&&task.completed_Date!=date));
    const appear=useSelector((state:RootState2)=>state.appearance.appear)
    const handleDelete=(taskId:string)=>{//参数要用id不用index，因为index会变化从而导致错乱
        dispatch(deleteTask(taskId));
    }

    const handleModify=(taskId:string)=>{
      const taskToModify=tasks.find((task:Task) => task.id===taskId);
      if(taskToModify){
        dispatch(modify({id:taskId,event:taskToModify.event,description:taskToModify.description,isCycle:taskToModify.is_cycle
          ,completed:taskToModify.completed,importanceLevel:taskToModify.importanceLevel,completed_Date:taskToModify.completed_Date
        }));
        dispatch(setAppearance());
      
      // console.log("modify task event after dispatch:",modifyTask.event);
      // console.log("modify task description after dispatch:",modifyTask.description);--不会马上更新，所以无法得到结果
      }
    }

    
    const handleFinish=(taskId:string)=>{

        dispatch(finishTask(taskId));
  }

  const onDragEnd = (result: DragResult) => {
    if (!result.destination) return;
        const newTodos = [...tasks];
        const [removedTodo]  = newTodos.splice(result.source.index, 1);
        newTodos.splice(result.destination.index, 0, removedTodo);
        // 在这里可以触发状态更新或回调函数，以更新任务列表
        dispatch(updateTask(newTodos));
        
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

    useEffect(()=>{
      setFilteredTasks(tasks.filter((task:Task) =>(task.completed==false||task.is_cycle==true&&task.completed_Date!=date)));
    },[date, tasks])

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
<Draggable index={index} key={task.id} draggableId={`todo-${task.id}`}> 
  {(provided) => {


  return (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {/* 双击删除任务 */}
          <div className="task" onDoubleClick={()=>handleDelete(task.id)}> 
          {task.is_cycle ? <button className="limited-time" onClick={()=>dispatch(isCycle(task.id))} >循环</button> : <button className="cycle-time" onClick={()=>dispatch(isCycle(index))}>限时</button>}
          <button className="finishTask Bgi" onClick={()=>handleFinish(task.id)}></button>
          <button className="deleteTask Bgi" onClick={() =>handleModify(task.id) }></button>
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





