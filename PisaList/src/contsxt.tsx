import React, { createContext, useState,ReactNode } from 'react';

// 创建上下文对象
const AppearContext = createContext<{
  addTaskMenu: boolean;
  setAddTaskMenu: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

// 创建提供上下文的组件
interface AppearProviderProps {
    children: ReactNode; // 明确指定 children 的类型
  }
  
 const AppearProvider: React.FC<AppearProviderProps> = ({ children }) => {
  const [addTaskMenu, setAddTaskMenu] = useState<boolean>(false);

  return (
    <AppearContext.Provider value={{ addTaskMenu, setAddTaskMenu }}>
      {children}
    </AppearContext.Provider>
  );
};

export default AppearContext;
export { AppearProvider };