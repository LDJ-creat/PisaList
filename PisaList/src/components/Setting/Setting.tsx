import "./Setting.css"
import { useNavigate } from "react-router-dom"
const Setting = () => {
  const navigate = useNavigate()
  return (
  <div className="Setting">
    <div className="Setting-Menu-Container">
    <button className="Review" onClick={()=>navigate('/personalReview')}>完成回顾</button>
    <button className="Self-Setting">个人中心</button>
    </div>
    <button className="Setting-Icon Bgi"></button>
  </div>
  )
}

export default Setting