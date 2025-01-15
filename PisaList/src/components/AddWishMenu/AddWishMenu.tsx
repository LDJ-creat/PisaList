import { useState, forwardRef } from 'react';
import './AddWishMenu.css';
import { useDispatch } from 'react-redux';
import { addWish } from '../../redux/Store.tsx';
import { setAppearance } from '../../redux/Store.tsx';
import { message } from 'antd';
import axios from 'axios';

interface Wish {
    id: string;
    event: string;
    is_cycle: boolean;
    description: string;
    is_shared: boolean;
}

const AddWish = forwardRef<HTMLDivElement, { [key: string]: unknown }>((_props, ref) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [isCycle, setIsCycle] = useState(false);
    const [isShared, setIsShared] = useState(false);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!value || value.trim() === '') return;

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        try {
            const newWish: Wish = {
                id: Date.now().toString(),
                event: value,
                is_cycle: isCycle,
                description: description,
                is_shared: isShared,
            };

            // 创建心愿
            if(token){
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes`,
                {
                    event: value,
                    description: description,
                    is_cycle: isCycle
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        

            newWish.id = String(res.data.id);
        }
            dispatch(addWish(newWish));

            // 如果需要分享到社区
            if (isShared) {
                await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes/${newWish.id}/share`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            dispatch(setAppearance());
            setValue('');
            setDescription('');
            setIsCycle(false);
            setIsShared(false);
        } catch (error) {
            console.error('Failed to add wish:', error);
        }
    };
    
    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!value || value.trim() === '') {
                message.error('请输入心愿名称');
                return;
            }
            await handleSubmit(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    return (
        <div id='addWishMenu' className='Bgi' ref={ref}>
            <input 
                type="text"  
                placeholder="输入心愿名称" 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                onKeyDown={handleKeyDown}
                id='wishName'
            />
            <div id='WishRectangle'>————————————————</div>
            <input 
                type="text"  
                placeholder="描述or详细介绍(例如具体项目、时间)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                onKeyDown={handleKeyDown}
                id='wishDescription'
            />
            <div id='setWishCycle'>
                <button 
                    id='isWishCycle' 
                    className='Bgi' 
                    onClick={() => setIsCycle(!isCycle)}
                />
                {isCycle && (
                    <button 
                        id='wishCycle' 
                        className='Bgi' 
                        onClick={() => setIsCycle(!isCycle)}
                    />
                )}
            </div>
            <div id='setWishShared'>
                <button 
                    id='isWishShared' 
                    className='Bgi' 
                    onClick={() => setIsShared(!isShared)}
                />
                {isShared && (
                    <button 
                        id='wishShared' 
                        className='Bgi' 
                        onClick={() => setIsShared(!isShared)}
                    />
                )}
            </div> 
            <button 
                onClick={handleSubmit} 
                id='addWishButton' 
                className='Bgi' 
            />
        </div>
    );
});

export default AddWish;