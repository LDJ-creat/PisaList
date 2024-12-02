import { createBrowserRouter } from "react-router-dom";
import StartPage from "../page/StartPage/StartPage.tsx";
import HomePage from"../page/HomePage/HomePage.tsx";
import ListPage from "../page/ListPage/ListPage.tsx";
import WishMenu from "../page/WishMenu/WishMenu.tsx";
import MyWishList from "../page/MyWishList/MyWIshList.tsx";
import ExtractWishes from "../page/ExtractWishes/ExtractWishes.tsx";
import WishCommunity from "../page/WishCommunity/WishCommunity.tsx";
import PersonalReview from "../page/PersonalReview/PersonalReview.tsx";
const router=createBrowserRouter([
{
    path:"/",
    element:<StartPage/>
},
{
    path:"/home",
    element:<HomePage/>
},
{
    path:"/list",
    element:<ListPage/>
},
{
    path:"/wishMenu",
    element:<WishMenu/>
},
{
    path:"/myWishList",
    element:<MyWishList/>
},
{
    path:"/extractWishes",
    element:<ExtractWishes/>
},
{
    path:"/wishCommunity",
    element:<WishCommunity/>
},
{
    path:"/review",
    element:<PersonalReview/>
}

])
export default router;