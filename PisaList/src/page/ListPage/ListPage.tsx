import "./ListPage.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {  deleteTask, updateTask,finishTask } from '../../redux/Store.tsx';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Nav from "../../components/Nav/Nav";
import AddTaskMenu from "../../components/AddTaskMenu/AddTaskMenu.tsx";
import { setAppearance } from "../../redux/Store.tsx"

const ListPage = () => {
    const [date,setDate] = useState("");
    const dispatch = useDispatch();
    let tasks = useSelector((state: any) => state.tasks.tasks);
    const filteredTasks = tasks.filter((task:any) =>(task.completed==false||task.is_cycle==true&&task.completed_Date!=date));
    const appear=useSelector((state:any)=>state.appearance.appear)
    const handleDelete=(index:number)=>{
        dispatch(deleteTask(index));
    }

    const handleFinish=(index:number)=>{
        // setTimeout(()=>{dispatch(finishTask(index))},600);
        dispatch(finishTask(index));
    }

    const onDragEnd = (result:any) => {
        if (!result.destination) return;
        const newTodos = [...tasks];
        const [removedTodo] = newTodos.splice(result.source.index, 1);
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
    return(
        <div className="ListPage-container">
        <div className="show-Date">{date}</div>
        <button id="addListTask" className="Bgi" onClick={()=>dispatch(setAppearance())}></button>
        <DragDropContext
      onDragEnd={onDragEnd}
      >
    
    <div id="task-list-container"  className={`${appear?"blur":""}`}>
      <Droppable droppableId="todo">
          {((provided:any)=>(
              <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
         {filteredTasks.map((task:any, index:any) => (
<Draggable index={index} key={index} draggableId={`todo-${index}`}> 
  {(provided) => {

// return tasks[index].completed==false||tasks[index].completed==true&&tasks[index].completed_Date!=date ? null : (---不可以这样写是因为
//如果返回null,可能会没有正确地处理 provided.innerRef 的赋值，导致后续使用 provided.innerRef 的地方（比如 DragDropContext 等相关组件内部逻辑）找不到预期的 HTMLElement 引用，从而报错。
//解决方法：将判断提前，符合条件的存入filteredTasks中，然后在map中直接渲染filteredTasks中的任务，这样就不需要在map中进行判断了。
  return (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        <div className='task'>
          {tasks[index].is_cycle ? <button className="limited-time">循环</button> : <button className="cycle-time">限时</button>}
          <button className="finishTask Bgi" onClick={()=>handleFinish(index)}></button>
          <button className="deleteTask Bgi" onClick={() => handleDelete(index)}></button>
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
    {appear&&<AddTaskMenu/>}
    <Nav/>

  </div>
       
    )
}
export default ListPage

   {/* <button id='isFinishTask'onClick={()=>handleFinish(index)}></button>
            {finish?<button id='finishTask'onClick={()=>handleFinish(index)}></button>:null} */}
          //   <Draggable index={index} key={index} draggableId={`todo-${index}`}>
          //   {(provided) => (
          //     tasks[index].completed?null:<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          //       <div className='task'onDoubleClick={()=>handleDelete(index)}> 
          //         {tasks[index].is_cycle?<button className="limited-time">限时</button>:<button className="cycle-time">循环</button>}
          //         <p className='taskListName'>{task.event}</p>
          //         <p className='task-description'>{task.description}</p>
          //       </div>
          //     </div>
          //   )}
          // </Draggable>