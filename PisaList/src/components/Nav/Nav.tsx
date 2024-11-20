import "./Nav.css"
import { useNavigate } from "react-router-dom"
const Nav =()=>{
    const navigate = useNavigate()
    return(
        <div className="bottom-nav ">
            <button id="ListIcon" className="Bgi" onClick={()=>navigate("/list")}></button>
            <button id="ChartIcon" className="Bgi" onClick={()=>navigate("/Home")}></button>
            <button id="WishIcon" className="Bgi" onClick={()=>navigate("/wishMenu")}></button>
        </div>
    )
}
export default Nav