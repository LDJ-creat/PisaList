import "./WishMenu.css";
import { useNavigate } from "react-router-dom"
import WishIcon from "../../images/WishIcon.svg"
import Arrow from "../../images/箭头.svg"
import Nav from "../../components/Nav/Nav";
import { useTranslation } from "react-i18next";
const WishMenu = () => {
    const navigate = useNavigate();
    const { t,i18n } = useTranslation();
    const handleLanguageChange = () => {
        i18n.changeLanguage(i18n.language === "zh"? 'en' :"zh");
    }
    return(    
        <div className="WishMenu-container">
            <button onClick={handleLanguageChange} id="languageBtn">{i18n.language === "zh" ? "English" : "中文"}</button>
            <div className="wishMenuBTNS">
                <div className="wishMenuChoice">
                <button className="wishMenuBtn" onClick={()=>navigate('/myWishList')}>{t('My Wish List')}</button>
                <img src={WishIcon} alt=""  className="WishIconImg"/>
                </div >
                <div className="wishMenuChoice">
                <button className="wishMenuBtn" onClick={()=>navigate('/extractWishes')}>{t('Extract a wish')}</button>
                <img src={Arrow} alt="" className="ArrowImg"/>
                </div>
                <div className="wishMenuChoice">
                <button className="wishMenuBtn" onClick={()=>navigate('/wishCommunity')}>{t('Wish Community')}</button>
                <img src={WishIcon} alt=""  className="WishIconImg"/>
                </div>
                <div className="wishMenuChoice">
                <button className="wishMenuBtn " onClick={()=>navigate('')}>{t('About Wish')}</button>
                <img src={Arrow} alt=""  className="ArrowImg"/>
                </div>
                <div className="wishMenuChoice">
                <button className="wishMenuBtn " onClick={()=>alert('敬请期待')}>{t('Look forward')}</button>
                <img src={WishIcon} alt=""  className="WishIconImg"/>
                </div>
            </div>  
            <Nav/>  
        </div>
    )
}    
export default WishMenu