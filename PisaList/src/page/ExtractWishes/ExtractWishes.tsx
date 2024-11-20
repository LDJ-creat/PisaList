import { useEffect, useRef,useState } from "react";
import "./ExtractWishes.css"
// import axios from "axios";
import Nav from "../../components/Nav/Nav";
import { useDispatch, useSelector } from "react-redux";
import { addWish } from "../../redux/Store.tsx";
interface Wish {
    id:string;
    event:string;
    is_cycle:boolean;
    description:string;
    is_shared:boolean;
  }
const ExtractWishes = () => {
    const dispatch = useDispatch();
    const wishes=useSelector((state:any)=>state.wishes.wishes);
    const [randomWish, setRandomWish] = useState<Wish>();
    const [randomIndex, setRandomIndex] = useState<number>();
    const innerCardRef=useRef<HTMLDivElement>(null);
    const handleExtractWish = () => {
        if(innerCardRef.current){
        innerCardRef.current.style.transform = "rotateY(180deg)";
        }
    }
    const handleOneMore = () => {
        if(innerCardRef.current){
        innerCardRef.current.style.transform = "rotateY(0deg)";
        }
        // getRandomWish();
        const timer = setTimeout(() => {
            getRandomWish();
          }, 1000);
          return () => clearTimeout(timer);
    }
    const handleAddToMine = () => {
        dispatch(addWish(randomWish))
    }
    const getRandomWish = async() => {
        if(wishes.length>0){
            while(true){
            const random=Math.floor(Math.random()*wishes.length);
            if(random!==randomIndex){//前后两次不重复
                setRandomIndex(random);
                setRandomWish(wishes[random])
                break;
            }
            }
        }//应该不需要抽取自己的，
        // else{
        // const res=await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/todolist/wish/random`);
        // setRandomWish(res.data);
        // }
    }
    useEffect(()=>{
        getRandomWish();
    },[])
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