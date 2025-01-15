import {useEffect, useRef,useState } from "react";
import "./ExtractWishes.css"
import axios from "axios";
import Nav from "../../components/Nav/Nav";
import { useDispatch} from "react-redux";
import { addWish } from "../../redux/Store.tsx";
import{message} from "antd";
interface Wish {
    id:string;
    event:string;
    is_cycle:boolean;
    description:string;
    is_shared:boolean;
  }
// interface RootState {
//     wishes: {
//       wishes: Wish[];
//     };
//   }
const ExtractWishes = () => {
    const dispatch = useDispatch();
    // const wishes=useSelector((state:RootState)=>state.wishes.wishes);
    const [randomWish, setRandomWish] = useState<Wish>();
    // const [randomIndex, setRandomIndex] = useState<number>();
    const getRandomWish=async()=>{
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes/random`
            );
            setRandomWish(res.data);
        } catch (error) {
            console.error('Failed to get random wish:', error);
            message.error('获取随机心愿失败');
        }
    }
    useEffect(()=>{
        getRandomWish();
    },[])
    const innerCardRef=useRef<HTMLDivElement>(null);
    const handleExtractWish = () => {
        if(innerCardRef.current){
        innerCardRef.current.style.transform = "rotateY(540deg)";
        }
    }
    const handleOneMore = () => {
        if(innerCardRef.current){
        innerCardRef.current.style.transform = "rotateY(0deg)";
        }
        // getRandomWish();
        const timer = setTimeout(() => {
            getRandomWish();
          }, 1500);
          return () => clearTimeout(timer);
    }
    const handleAddToMine = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const newWish: Wish = {
            id: Date.now().toString(),
            event: randomWish?.event || '',
            is_cycle: false,
            description: randomWish?.description || '',
            is_shared: false
        }
        if (token) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes`,
                    {
                        event:randomWish?.event,
                        description:randomWish?.description,
                        is_cycle:false
                    },
                    {
                        headers:{
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )
                newWish.id = String(res.data.id);
            } catch (error) {
                message.error('Failed to add to Mine');
                console.error('Error details:', error);
            }
        }
        dispatch(addWish(newWish));
        message.success("Added to Mine successfully");
    };
    // const getRandomWish =async() => {
    //     if(wishes.length>0){
    //         while(true){
    //         const random=Math.floor(Math.random()*wishes.length);
    //         if(wishes.length==1){
    //             setRandomIndex(0);
    //             setRandomWish(wishes[0])
    //             break;
    //         }
    //         if(random!==randomIndex){//前后两次不重复
    //             setRandomIndex(random);
    //             setRandomWish(wishes[random])
    //             break;
    //         }
    //         }
    //     }//应该不需要抽取自己的，
    //     // else{
    //     // const res=await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/todolist/wish/random`);
    //     // setRandomWish(res.data);
    //     // }
    
    // }
//react-hooks/exhaustive-deps 规则是为了确保 useEffect 中使用的所有外部变量（包括函数）在依赖项数组中都有正确体现。这是因为 React 的 useEffect 钩子在组件更新时，会根据依赖项数组来判断是否需要重新执行 useEffect 内部的函数。
    return (
    <div className="ExtractWishes-container">
        <div className="myCard">
            <div className="innerCard" ref={innerCardRef}>
            <div className="frontSide">
                <p className="title">???</p>
                <p>Have a Extraction</p>
            </div>
            <div className="backSide">
                <p className="title">{randomWish?.event}</p>
                <p>{randomWish?.description}</p>
            </div>
        </div>
        </div>
        <div className="extractButton">
        <button className="extractWish" onClick={handleExtractWish}>Extract a Wish</button>
        <button className="addToMine" onClick={handleAddToMine}>Add to Mine</button>
        <button className="oneMore" onClick={handleOneMore}>One More</button>
        </div>
        <Nav />
    </div>

    )
}
export default ExtractWishes;