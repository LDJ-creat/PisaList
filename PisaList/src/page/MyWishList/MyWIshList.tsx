import "./MyWishList.css"
import { useState, useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {addTask,deleteWish,setAppearance,updateWishes,switchCycle} from '../../redux/Store.tsx';
import { DragDropContext, Draggable, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import Nav from "../../components/Nav/Nav";
import AddWishMenu from "../../components/AddWishMenu/AddWishMenu.tsx";
interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;
    description: string;
    importanceLevel: number;
    completed_Date: string;
}
interface Wish {
  id:string;
  event:string;
  is_cycle:boolean;
  description:string;
  is_shared:boolean;
}
interface RootState {
  wishes:{
      wishes: Wish[];
  }
}
interface RootState2 {
    appearance: {
        appear: boolean;
    };
}
const MyWishList = () => {
    const [date,setDate] = useState("");
    const appear=useSelector((state: RootState2) => state.appearance.appear);
    const dispatch = useDispatch();
    const wishes = useSelector((state: RootState) => state.wishes.wishes);
    const handleWishTask=(index:number)=>{
        const newTask: Task = {
            id: Date.now().toString(),
            event: wishes[index].event,
            completed: false,
            is_cycle: wishes[index].is_cycle,
            description: wishes[index].description,
            importanceLevel: 0,
            completed_Date: '',
        };
        dispatch(addTask(newTask));
        if(wishes[index].is_cycle==false){
            dispatch(deleteWish(index));
        }
    }
    const handleDelete=(index:number)=>{
        dispatch(deleteWish(index));
    }

    interface DragResult {
      source: {
          index: number;
      };
      destination: {
          index: number;
      } | null;
  }
    const onDragEnd = (result:DragResult) => {
        if (!result.destination) return;
        const newTodos = [...wishes];
        const [removedTodo] = newTodos.splice(result.source.index, 1);
        newTodos.splice(result.destination.index, 0, removedTodo);
        // 在这里可以触发状态更新或回调函数，以更新任务列表
        dispatch(updateWishes(newTodos))
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
        <div className="MyWishList-container">
        <div className="show-Date">{date}</div>
        <button id="addWishList" className="Bgi" onClick={()=>dispatch(setAppearance())}></button>
        <DragDropContext
      onDragEnd={onDragEnd}
      >
    
    <div id="wish-list-container"  className={`${appear?"blur":""}`}>
      <Droppable droppableId="todo">
          {((provided:DroppableProvided)=>(
              <div className="wish-list" ref={provided.innerRef} {...provided.droppableProps}>
  
         {wishes.map((wish:Wish, index:number) => (
<Draggable index={index} key={index} draggableId={`todo-${index}`}>
  {(provided) => {
    return  (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        <div className='MyWish'>
          {/* {wishes[index].is_cycle ? <button className="cycle-time" onClick={()=>{dispatch(switchCycle(index))}}>循环</button> : <button className="limited-time" onClick={()=>dispatch(switchCycle(index))}>限时</button>} */}
          <button className="limited-time" onClick={()=>dispatch(switchCycle(index))}>{wishes[index].is_cycle ? "循环" : "限时"}</button>
          {/* 为什么都无效呢 */}
          <button className="WishTask Bgi" onClick={() => handleWishTask(index)}></button>
          <button className="deleteWish Bgi" onClick={() => handleDelete(index)}></button>
          <p className='wishListName'>{wish.event}</p>
          <p className='wish-description'>{wish.description}</p>
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
    {appear&&<AddWishMenu/>}
    <Nav/>     
  </div>
    )

}
export default MyWishList

