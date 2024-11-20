import {  useState} from 'react';
import './AddWishMenu.css';
import { useDispatch } from 'react-redux';
import { addWish } from '../../redux/Store.tsx';
import { setAppearance } from '../../redux/Store.tsx';
import axios from 'axios';

interface Wish {
    id:string;
    event:string;
    is_cycle:boolean;
    description:string;
    is_shared:boolean;
  }
const AddWish = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [isCycle, setIsCycle] = useState(false);
    const [isShared, setIsShared] = useState(false);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();//
        if (!value) return;
        setValue('');
        setDescription('');
        if (value.trim() !== '') {
            const newWish: Wish = {
                id: Date.now().toString(),
                event: value,
                is_cycle: isCycle,
                description: description,
                is_shared: isShared,
            };
            dispatch(addWish(newWish));
            dispatch(setAppearance());
            if (isShared){
                const addToCommunity=async()=>{
                    await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/todolist/community/add-to-community`,newWish)
                };
                addToCommunity();
            }
        } 

    }
    return (
        <div id='addWishMenu' className='Bgi'>
            <input type="text"  placeholder="输入心愿名称" value={value} onChange={(e) => setValue(e.target.value)} id='wishName'></input>
            <div id='WishRectangle'>————————————————</div>
            <input type="text"  placeholder="描述or详细介绍(例如具体项目、时间)" value={description} onChange={(e) => setDescription(e.target.value)} id='wishDescription'></input>
            <div id='setWishCycle'>
                <button id='isWishCycle' className='Bgi' onClick={() => setIsCycle(!isCycle)}></button>
                {isCycle && <button id='wishCycle' className='Bgi' onClick={() => setIsCycle(!isCycle)}></button>}
            </div>
            <div id='setWishShared'>
                <button id='isWishShared' className='Bgi' onClick={() => setIsCycle(!isShared)}></button>
                 {/* <button id='wishShared' className='Bgi' onClick={() => setIsShared(!isShared)}></button> */}
                {isShared && <button id='wishShared' className='Bgi' onClick={() => setIsShared(!isShared)}></button>}
            </div>
            <button onClick={handleSubmit} id='addWishButton' className='Bgi' ></button>
        </div>
    )
}
export default AddWish