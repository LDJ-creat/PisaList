import "./MyWishList.css"
import { useState, useEffect,createRef} from "react";
import { useDispatch, useSelector} from 'react-redux';
import {addTaskAsync,deleteWish,setAppearance,updateWishes,switchCycle,initialWishes} from '../../redux/Store.tsx';
import { DragDropContext, Draggable, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import Nav from "../../components/Nav/Nav";
import AddWishMenu from "../../components/AddWishMenu/AddWishMenu.tsx";
import{message} from "antd";
import axios from "axios";
import { Button } from "antd";
import {LogoutOutlined,PlusOutlined} from '@ant-design/icons';
import { AppDispatch } from '../../redux/Store';
interface Task {
    id: string;
    event: string;
    completed: boolean;
    is_cycle: boolean;
    description: string;
    importanceLevel: number;
    completed_date: string;
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
    const addWishRef=createRef<HTMLDivElement>();
    const to_find_wishes=useSelector((state:RootState)=>state.wishes.wishes);
    const appear=useSelector((state: RootState2) => state.appearance.appear);
    const dispatch = useDispatch<AppDispatch>();
    const wishes = useSelector((state: RootState) => state.wishes.wishes);
    const handleWishTask = async (id: string) => {
        const index = to_find_wishes.findIndex(wish => wish.id === id);
        const newTask: Task = {
            id: Date.now().toString(),
            event: wishes[index].event,
            completed: false,
            is_cycle: wishes[index].is_cycle,
            description: wishes[index].description,
            importanceLevel: 0,
            completed_date: '',
        };
        await dispatch(addTaskAsync(newTask)).unwrap();
        if (!wishes[index].is_cycle) {
            dispatch(deleteWish(id));
        }
        message.success("成功添加到日程");
    };
    const handleDelete=(id:string)=>{
        dispatch(deleteWish(id));
        message.success("删除成功");
    }
    const shareWish = async (id: string) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes/${id}/share`,
          {},  // 空对象作为请求体
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (res.status === 200) {
          message.success("分享成功");
        }
      } catch (error) {
        message.error("分享失败");
        console.error('Share wish error:', error);
      }
    };
    
    const [hasTriedFetch, setHasTriedFetch] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      // 只在有 token 且没有任务且没有尝试过获取数据时获取
      if (token && wishes.length === 0 && !hasTriedFetch) {
        const getData = async () => {
          try {
            const resWishes = await axios.get(
              `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            dispatch(initialWishes(resWishes.data));
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          setHasTriedFetch(true);  // 标记已经尝试过获取数据
        };
        getData();
      }
    }, [wishes.length, hasTriedFetch, dispatch]);  // 添加合适的依赖项,使用 hasTriedFetch 标记避免重复请求

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

    useEffect(()=>{
      const handleClickOutside=(event: MouseEvent)=>{
        
          if(appear&&addWishRef.current&&!addWishRef.current.contains(event.target as Node)){
              dispatch(setAppearance());
          }
        }
          document.addEventListener('mousedown',handleClickOutside);
          return ()=>document.removeEventListener('mousedown',handleClickOutside);

      
    },[appear,addWishRef,dispatch])
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
        <div className='MyWish' onDoubleClick={()=>handleDelete(wish.id)}>
          {/* {wishes[index].is_cycle ? <button className="cycle-time" onClick={()=>{dispatch(switchCycle(index))}}>循环</button> : <button className="limited-time" onClick={()=>dispatch(switchCycle(index))}>限时</button>} */}
          <button className="limited-time" onClick={()=>dispatch(switchCycle(wish.id))}>{wish.is_cycle ? "循环" : "限时"}</button>
          <Button shape="circle" icon={<PlusOutlined/>} className="WishTask" onClick={()=>handleWishTask(wish.id)}></Button>
          <Button shape="circle" icon={<LogoutOutlined/>} className="shareWish" onClick={()=>shareWish(wish.id)}></Button>
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
    {appear&&<AddWishMenu ref={addWishRef}/>}
    <Nav/>     
  </div>
    )

}
export default MyWishList

