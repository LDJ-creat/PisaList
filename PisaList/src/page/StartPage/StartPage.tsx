import { useState,useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useSpring, animated } from '@react-spring/web'
import './StartPage.css'
import axios from '../../utils/axios'
import { useDispatch } from "react-redux"
import { initialTasks,initialWishes } from '../../redux/Store'

const AnimFeTurbulence = animated('feTurbulence')
const AnimFeDisplacementMap = animated('feDisplacementMap')

const StartPage=()=> {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, toggle] = useState(false)
  const [{ freq, factor, scale, opacity }] = useSpring(
    () => ({
      reverse: open,
      from: { factor: 10, opacity: 0, scale: 2.0, freq: '0.0175, 0.0' },
      to: { factor: 70, opacity: 1, scale: 2.0, freq: '0.0, 0.0' },
      config: { duration: 2500 },
    }),
    [open]
  )

    useEffect(() => {
    // 设置定时器，3秒后执行跳转函数
    const timer = setTimeout(() => {
      navigate('/Home');
    }, 3000);

    // 在组件卸载时清除定时器，避免内存泄漏
    return () => clearTimeout(timer);
  }, [navigate]);
    useEffect(()=>{
      const token = localStorage.getItem('token')||sessionStorage.getItem('token');
      if(token){
      const getData = async () => {
        try {
          const resTasks = await axios.get('/tasks/today');
          const resWishes = await axios.get('/wishes');
          dispatch(initialTasks(resTasks.data));
          dispatch(initialWishes(resWishes.data));
        } catch (error) {
          console.error('Failed to get data:', error);
        }
      };
      getData();
    }
    }, [dispatch]);

  return (
    <div className="startPage">
    <div className="container" onClick={() => toggle(!open)}> 
      {/* <animated.svg className="svg" style={{ scale, opacity }} viewBox="-420 -44 1278 446"> */}
      <animated.svg className="svg" style={{ scale, opacity }} viewBox="0 0 1278 446">
        <defs>
          <filter id="water">
            <AnimFeTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" result="TURB" seed="8" />
            <AnimFeDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              in="SourceGraphic"
              in2="TURB"
              result="DISP"
              scale={factor}
            />
          </filter>
        </defs>
        <g filter="url(#water)">
          <path
            d="M179.53551,113.735463 C239.115435,113.735463 292.796357,157.388081 292.796357,245.873118 L292.796357,415.764388 L198.412318,415.764388 L198.412318,255.311521 C198.412318,208.119502 171.866807,198.681098 151.220299,198.681098 C131.753591,198.681098 94.5898754,211.658904 94.5898754,264.749925 L94.5898754,415.764388 L0.205836552,415.764388 L0.205836552,0.474616471 L94.5898754,0.474616471 L94.5898754,151.489079 C114.646484,127.893069 145.321296,113.735463 179.53551,113.735463 Z M627.269795,269.469127 C627.269795,275.95803 626.679895,285.396434 626.089994,293.065137 L424.344111,293.065137 C432.012815,320.790448 457.378525,340.257156 496.901841,340.257156 C520.497851,340.257156 554.712065,333.768254 582.437376,322.560149 L608.392987,397.47748 C608.392987,397.47748 567.09997,425.202792 494.54224,425.202792 C376.562192,425.202792 325.240871,354.414762 325.240871,269.469127 C325.240871,183.343692 377.152092,113.735463 480.974535,113.735463 C574.178773,113.735463 627.269795,171.545687 627.269795,269.469127 Z M424.344111,236.434714 L528.166554,236.434714 C528.166554,216.378105 511.649347,189.242694 476.255333,189.242694 C446.17042,189.242694 424.344111,216.378105 424.344111,236.434714 Z M659.714308,0.474616471 L754.098347,0.474616471 L754.098347,415.764388 L659.714308,415.764388 L659.714308,0.474616471 Z M810.13887,0.474616471 L904.522909,0.474616471 L904.522909,415.764388 L810.13887,415.764388 L810.13887,0.474616471 Z M1097.42029,113.735463 C1191.80433,113.735463 1257.87315,183.343692 1257.87315,269.469127 C1257.87315,355.594563 1192.98413,425.202792 1097.42029,425.202792 C997.727148,425.202792 936.967423,355.594563 936.967423,269.469127 C936.967423,183.343692 996.547347,113.735463 1097.42029,113.735463 Z M1097.42029,340.257156 C1133.9941,340.257156 1163.48912,308.402543 1163.48912,269.469127 C1163.48912,230.535711 1133.9941,198.681098 1097.42029,198.681098 C1060.84647,198.681098 1031.35146,230.535711 1031.35146,269.469127 C1031.35146,308.402543 1060.84647,340.257156 1097.42029,340.257156 Z"
            fill="lightblue"
            // fill="black"
            // d="M0.625 0.8125H27.125C34.2917 0.8125 39.7917 1.375 43.625 2.5C47.5 3.625 50.3958 5.25 52.3125 7.375C54.2708 9.5 55.5833 12.0833 56.25 15.125C56.9583 18.125 57.3125 22.7917 57.3125 29.125V37.9375C57.3125 44.3958 56.6458 49.1042 55.3125 52.0625C53.9792 55.0208 51.5208 57.2917 47.9375 58.875C44.3958 60.4583 39.75 61.25 34 61.25H26.9375V102H0.625V0.8125ZM26.9375 18.125V43.875C27.6875 43.9167 28.3333 43.9375 28.875 43.9375C31.2917 43.9375 32.9583 43.3542 33.875 42.1875C34.8333 40.9792 35.3125 38.5 35.3125 34.75V26.4375C35.3125 22.9792 34.7708 20.7292 33.6875 19.6875C32.6042 18.6458 30.3542 18.125 26.9375 18.125ZM90.125 0.8125V14H64.125V0.8125H90.125ZM90.125 19.0625V102H64.125V19.0625H90.125ZM150.812 45.5625H128.438V41.0625C128.438 37.2292 128.208 34.8125 127.75 33.8125C127.333 32.7708 126.25 32.25 124.5 32.25C123.083 32.25 122.021 32.7292 121.312 33.6875C120.604 34.6042 120.25 36 120.25 37.875C120.25 40.4167 120.417 42.2917 120.75 43.5C121.125 44.6667 122.188 45.9583 123.938 47.375C125.729 48.7917 129.375 50.8542 134.875 53.5625C142.208 57.1458 147.021 60.5208 149.312 63.6875C151.604 66.8542 152.75 71.4583 152.75 77.5C152.75 84.25 151.875 89.3542 150.125 92.8125C148.375 96.2292 145.438 98.875 141.312 100.75C137.229 102.583 132.292 103.5 126.5 103.5C120.083 103.5 114.583 102.5 110 100.5C105.458 98.5 102.333 95.7917 100.625 92.375C98.9167 88.9583 98.0625 83.7917 98.0625 76.875V72.875H120.438V78.125C120.438 82.5833 120.708 85.4792 121.25 86.8125C121.833 88.1458 122.958 88.8125 124.625 88.8125C126.417 88.8125 127.667 88.375 128.375 87.5C129.083 86.5833 129.438 84.6875 129.438 81.8125C129.438 77.8542 128.979 75.375 128.062 74.375C127.104 73.375 122.208 70.4167 113.375 65.5C105.958 61.3333 101.438 57.5625 99.8125 54.1875C98.1875 50.7708 97.375 46.7292 97.375 42.0625C97.375 35.4375 98.25 30.5625 100 27.4375C101.75 24.2708 104.708 21.8333 108.875 20.125C113.083 18.4167 117.958 17.5625 123.5 17.5625C129 17.5625 133.667 18.2708 137.5 19.6875C141.375 21.0625 144.333 22.8958 146.375 25.1875C148.458 27.4792 149.708 29.6042 150.125 31.5625C150.583 33.5208 150.812 36.5833 150.812 40.75V45.5625ZM182.062 51.1875H158.375V45.625C158.375 39.2083 159.104 34.2708 160.562 30.8125C162.062 27.3125 165.042 24.2292 169.5 21.5625C173.958 18.8958 179.75 17.5625 186.875 17.5625C195.417 17.5625 201.854 19.0833 206.188 22.125C210.521 25.125 213.125 28.8333 214 33.25C214.875 37.625 215.312 46.6667 215.312 60.375V102H190.75V94.625C189.208 97.5833 187.208 99.8125 184.75 101.312C182.333 102.771 179.438 103.5 176.062 103.5C171.646 103.5 167.583 102.271 163.875 99.8125C160.208 97.3125 158.375 91.875 158.375 83.5V76.6875C158.375 70.4792 159.354 66.25 161.312 64C163.271 61.75 168.125 59.125 175.875 56.125C184.167 52.875 188.604 50.6875 189.188 49.5625C189.771 48.4375 190.062 46.1458 190.062 42.6875C190.062 38.3542 189.729 35.5417 189.062 34.25C188.438 32.9167 187.375 32.25 185.875 32.25C184.167 32.25 183.104 32.8125 182.688 33.9375C182.271 35.0208 182.062 37.875 182.062 42.5V51.1875ZM190.062 62.5625C186.021 65.5208 183.667 68 183 70C182.375 72 182.062 74.875 182.062 78.625C182.062 82.9167 182.333 85.6875 182.875 86.9375C183.458 88.1875 184.583 88.8125 186.25 88.8125C187.833 88.8125 188.854 88.3333 189.312 87.375C189.812 86.375 190.062 83.7917 190.062 79.625V62.5625ZM251.062 0.8125V81.75H267.062V102H224.75V0.8125H251.062ZM298.75 0.8125V14H272.75V0.8125H298.75ZM298.75 19.0625V102H272.75V19.0625H298.75ZM359.438 45.5625H337.062V41.0625C337.062 37.2292 336.833 34.8125 336.375 33.8125C335.958 32.7708 334.875 32.25 333.125 32.25C331.708 32.25 330.646 32.7292 329.938 33.6875C329.229 34.6042 328.875 36 328.875 37.875C328.875 40.4167 329.042 42.2917 329.375 43.5C329.75 44.6667 330.812 45.9583 332.562 47.375C334.354 48.7917 338 50.8542 343.5 53.5625C350.833 57.1458 355.646 60.5208 357.938 63.6875C360.229 66.8542 361.375 71.4583 361.375 77.5C361.375 84.25 360.5 89.3542 358.75 92.8125C357 96.2292 354.062 98.875 349.938 100.75C345.854 102.583 340.917 103.5 335.125 103.5C328.708 103.5 323.208 102.5 318.625 100.5C314.083 98.5 310.958 95.7917 309.25 92.375C307.542 88.9583 306.688 83.7917 306.688 76.875V72.875H329.062V78.125C329.062 82.5833 329.333 85.4792 329.875 86.8125C330.458 88.1458 331.583 88.8125 333.25 88.8125C335.042 88.8125 336.292 88.375 337 87.5C337.708 86.5833 338.062 84.6875 338.062 81.8125C338.062 77.8542 337.604 75.375 336.688 74.375C335.729 73.375 330.833 70.4167 322 65.5C314.583 61.3333 310.062 57.5625 308.438 54.1875C306.812 50.7708 306 46.7292 306 42.0625C306 35.4375 306.875 30.5625 308.625 27.4375C310.375 24.2708 313.333 21.8333 317.5 20.125C321.708 18.4167 326.583 17.5625 332.125 17.5625C337.625 17.5625 342.292 18.2708 346.125 19.6875C350 21.0625 352.958 22.8958 355 25.1875C357.083 27.4792 358.333 29.6042 358.75 31.5625C359.208 33.5208 359.438 36.5833 359.438 40.75V45.5625ZM394.75 8V21.0625H401.562V34.1875H394.75V78.5625C394.75 84.0208 395.021 87.0625 395.562 87.6875C396.146 88.3125 398.5 88.625 402.625 88.625V102H392.438C386.688 102 382.583 101.771 380.125 101.312C377.667 100.812 375.5 99.7083 373.625 98C371.75 96.25 370.583 94.2708 370.125 92.0625C369.667 89.8125 369.438 84.5625 369.438 76.3125V34.1875H364V21.0625H369.438V8H394.75Z"
          />
          <path
          fill="black"
          d="M0.625 0.8125H27.125C34.2917 0.8125 39.7917 1.375 43.625 2.5C47.5 3.625 50.3958 5.25 52.3125 7.375C54.2708 9.5 55.5833 12.0833 56.25 15.125C56.9583 18.125 57.3125 22.7917 57.3125 29.125V37.9375C57.3125 44.3958 56.6458 49.1042 55.3125 52.0625C53.9792 55.0208 51.5208 57.2917 47.9375 58.875C44.3958 60.4583 39.75 61.25 34 61.25H26.9375V102H0.625V0.8125ZM26.9375 18.125V43.875C27.6875 43.9167 28.3333 43.9375 28.875 43.9375C31.2917 43.9375 32.9583 43.3542 33.875 42.1875C34.8333 40.9792 35.3125 38.5 35.3125 34.75V26.4375C35.3125 22.9792 34.7708 20.7292 33.6875 19.6875C32.6042 18.6458 30.3542 18.125 26.9375 18.125ZM90.125 0.8125V14H64.125V0.8125H90.125ZM90.125 19.0625V102H64.125V19.0625H90.125ZM150.812 45.5625H128.438V41.0625C128.438 37.2292 128.208 34.8125 127.75 33.8125C127.333 32.7708 126.25 32.25 124.5 32.25C123.083 32.25 122.021 32.7292 121.312 33.6875C120.604 34.6042 120.25 36 120.25 37.875C120.25 40.4167 120.417 42.2917 120.75 43.5C121.125 44.6667 122.188 45.9583 123.938 47.375C125.729 48.7917 129.375 50.8542 134.875 53.5625C142.208 57.1458 147.021 60.5208 149.312 63.6875C151.604 66.8542 152.75 71.4583 152.75 77.5C152.75 84.25 151.875 89.3542 150.125 92.8125C148.375 96.2292 145.438 98.875 141.312 100.75C137.229 102.583 132.292 103.5 126.5 103.5C120.083 103.5 114.583 102.5 110 100.5C105.458 98.5 102.333 95.7917 100.625 92.375C98.9167 88.9583 98.0625 83.7917 98.0625 76.875V72.875H120.438V78.125C120.438 82.5833 120.708 85.4792 121.25 86.8125C121.833 88.1458 122.958 88.8125 124.625 88.8125C126.417 88.8125 127.667 88.375 128.375 87.5C129.083 86.5833 129.438 84.6875 129.438 81.8125C129.438 77.8542 128.979 75.375 128.062 74.375C127.104 73.375 122.208 70.4167 113.375 65.5C105.958 61.3333 101.438 57.5625 99.8125 54.1875C98.1875 50.7708 97.375 46.7292 97.375 42.0625C97.375 35.4375 98.25 30.5625 100 27.4375C101.75 24.2708 104.708 21.8333 108.875 20.125C113.083 18.4167 117.958 17.5625 123.5 17.5625C129 17.5625 133.667 18.2708 137.5 19.6875C141.375 21.0625 144.333 22.8958 146.375 25.1875C148.458 27.4792 149.708 29.6042 150.125 31.5625C150.583 33.5208 150.812 36.5833 150.812 40.75V45.5625ZM182.062 51.1875H158.375V45.625C158.375 39.2083 159.104 34.2708 160.562 30.8125C162.062 27.3125 165.042 24.2292 169.5 21.5625C173.958 18.8958 179.75 17.5625 186.875 17.5625C195.417 17.5625 201.854 19.0833 206.188 22.125C210.521 25.125 213.125 28.8333 214 33.25C214.875 37.625 215.312 46.6667 215.312 60.375V102H190.75V94.625C189.208 97.5833 187.208 99.8125 184.75 101.312C182.333 102.771 179.438 103.5 176.062 103.5C171.646 103.5 167.583 102.271 163.875 99.8125C160.208 97.3125 158.375 91.875 158.375 83.5V76.6875C158.375 70.4792 159.354 66.25 161.312 64C163.271 61.75 168.125 59.125 175.875 56.125C184.167 52.875 188.604 50.6875 189.188 49.5625C189.771 48.4375 190.062 46.1458 190.062 42.6875C190.062 38.3542 189.729 35.5417 189.062 34.25C188.438 32.9167 187.375 32.25 185.875 32.25C184.167 32.25 183.104 32.8125 182.688 33.9375C182.271 35.0208 182.062 37.875 182.062 42.5V51.1875ZM190.062 62.5625C186.021 65.5208 183.667 68 183 70C182.375 72 182.062 74.875 182.062 78.625C182.062 82.9167 182.333 85.6875 182.875 86.9375C183.458 88.1875 184.583 88.8125 186.25 88.8125C187.833 88.8125 188.854 88.3333 189.312 87.375C189.812 86.375 190.062 83.7917 190.062 79.625V62.5625ZM251.062 0.8125V81.75H267.062V102H224.75V0.8125H251.062ZM298.75 0.8125V14H272.75V0.8125H298.75ZM298.75 19.0625V102H272.75V19.0625H298.75ZM359.438 45.5625H337.062V41.0625C337.062 37.2292 336.833 34.8125 336.375 33.8125C335.958 32.7708 334.875 32.25 333.125 32.25C331.708 32.25 330.646 32.7292 329.938 33.6875C329.229 34.6042 328.875 36 328.875 37.875C328.875 40.4167 329.042 42.2917 329.375 43.5C329.75 44.6667 330.812 45.9583 332.562 47.375C334.354 48.7917 338 50.8542 343.5 53.5625C350.833 57.1458 355.646 60.5208 357.938 63.6875C360.229 66.8542 361.375 71.4583 361.375 77.5C361.375 84.25 360.5 89.3542 358.75 92.8125C357 96.2292 354.062 98.875 349.938 100.75C345.854 102.583 340.917 103.5 335.125 103.5C328.708 103.5 323.208 102.5 318.625 100.5C314.083 98.5 310.958 95.7917 309.25 92.375C307.542 88.9583 306.688 83.7917 306.688 76.875V72.875H329.062V78.125C329.062 82.5833 329.333 85.4792 329.875 86.8125C330.458 88.1458 331.583 88.8125 333.25 88.8125C335.042 88.8125 336.292 88.375 337 87.5C337.708 86.5833 338.062 84.6875 338.062 81.8125C338.062 77.8542 337.604 75.375 336.688 74.375C335.729 73.375 330.833 70.4167 322 65.5C314.583 61.3333 310.062 57.5625 308.438 54.1875C306.812 50.7708 306 46.7292 306 42.0625C306 35.4375 306.875 30.5625 308.625 27.4375C310.375 24.2708 313.333 21.8333 317.5 20.125C321.708 18.4167 326.583 17.5625 332.125 17.5625C337.625 17.5625 342.292 18.2708 346.125 19.6875C350 21.0625 352.958 22.8958 355 25.1875C357.083 27.4792 358.333 29.6042 358.75 31.5625C359.208 33.5208 359.438 36.5833 359.438 40.75V45.5625ZM394.75 8V21.0625H401.562V34.1875H394.75V78.5625C394.75 84.0208 395.021 87.0625 395.562 87.6875C396.146 88.3125 398.5 88.625 402.625 88.625V102H392.438C386.688 102 382.583 101.771 380.125 101.312C377.667 100.812 375.5 99.7083 373.625 98C371.75 96.25 370.583 94.2708 370.125 92.0625C369.667 89.8125 369.438 84.5625 369.438 76.3125V34.1875H364V21.0625H369.438V8H394.75Z"
          />
        </g>
      </animated.svg>
    </div>
    </div>
  )
}

export default StartPage
