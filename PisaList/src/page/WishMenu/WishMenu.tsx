import "./WishMenu.css";
import { useNavigate } from "react-router-dom"
import WishIcon from "../../images/WishIcon.svg"
import Arrow from "../../images/箭头.svg"
import Nav from "../../components/Nav/Nav";
const WishMenu = () => {
    const navigate = useNavigate()
    return(
        <div className="WishMenu-container">
            <div className="wishMenuChoice">
            <button className="wishMenuBtn" onClick={()=>navigate('/myWishList')}>我的心愿单</button>
            <img src={WishIcon} alt=""  className="WishIconImg"/>
            </div >
            <div className="wishMenuChoice">
            <button className="wishMenuBtn" onClick={()=>navigate('/extractWishes')}>抽取心愿</button>
            <img src={Arrow} alt="" className="ArrowImg"/>
            </div>
            <div className="wishMenuChoice">
            <button className="wishMenuBtn" onClick={()=>navigate('/wishCommunity')}>心愿社区</button>
            <img src={WishIcon} alt=""  className="WishIconImg"/>
            </div>
            <div className="wishMenuChoice">
            <button className="wishMenuBtn " onClick={()=>navigate('')}> 心愿说明</button>
            <img src={Arrow} alt=""  className="ArrowImg"/>
            </div>
            <div className="wishMenuChoice">
            <button className="wishMenuBtn " onClick={()=>alert('敬请期待')}>敬请期待</button>
            <img src={WishIcon} alt=""  className="WishIconImg"/>
            </div>
            <Nav/>
        </div>
    )
}
export default WishMenu