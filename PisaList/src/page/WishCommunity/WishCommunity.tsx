import "./WishCommunity.css"
// import axios from "axios";
// import { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav";
import { addWish } from "../../redux/Store";
import { useDispatch } from "react-redux";
interface ShareWish {
    id:string;
    event:string;
    description:string;
    view:number;
  }
  interface Wish {
    id:string;
    event:string;
    is_cycle:boolean;
    description:string;
    is_shared:boolean;
  }
  const communityWish:ShareWish[] = [
    {id: "1", event: "珍惜时光，享受当下", description: "春风若有怜花意，可否需我在少年", view: 10},
    {id: "2", event: "不忘初心，牢记使命", description: "奋勇争先，不负韶华", view: 12},
    {id: "3", event: "Be confident all the time", description: "仰天大笑出门去，我辈岂是蓬蒿人", view: 8},
    {id: "4", event: "来一场说走就走的旅行吧", description: "", view: 15},
    {id: "5", event: "永远相信美好的事情即将发生", description: "只要出发了，我们就在通往胜利的路上", view: 12},    
    {id: "6", event: "己所不欲，勿施于人", description: "", view: 12},    
    {id: "7", event: "穷则兼善其身，达则兼济天下", description: "天下兴亡，匹夫有责", view: 12},    
    {id: "8", event: "永远积极向上，永远热泪盈眶，永远豪情满怀，永远坦坦荡荡", description: "", view: 20},    
    {id: "9", event: "把我的技能包点满☺☺☺", description: "不忘初心，牢记使命", view: 12},    
    {id: "10", event: "柴米油盐皆是诗，无灾无难是最重", description: "如果快乐太难，祝你我都平平安安", view: 12},    
]

const WishCommunity = () => {
    // const [communityWish,setCommunityWish] = useState<ShareWish[]>([]);
    // const getCommunityWish = async() => {
    //     const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/todolist/community`);
    //     setCommunityWish(response.data.content);

    // }
    // useEffect(() => {
    //     getCommunityWish();
    // },[])
    const dispatch = useDispatch();
    const handleAddWish = (index:number) => {
        const newWish:Wish={
            id: communityWish[index].id,
            event: communityWish[index].event,
            is_cycle: false,
            description: communityWish[index].description,
            is_shared: true,
        }
        dispatch(addWish(newWish));
    }
        
    
    return (
        <div className="WishCommunity-container">
            <div className='CommunityWish-grid'>
                 {communityWish.map((item, index) => (
                     <div key={index} className='CommunityWish-item'>
                         <p className="CommunityWish-title">{item.event}</p>
                         <p className="CommunityWish-description">{item.description}</p>
                         <p className="CommunityWish-view">(最近有{item.view}人看过)</p>
                         <button className="addCommunityWish-btn Bgi" onClick={() => handleAddWish(index)}></button>
                    </div>
                 ))}          
            </div>
            <Nav />
        </div>
    )
}
export default WishCommunity