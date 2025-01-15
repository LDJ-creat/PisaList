import axios from 'axios';
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { Task } from '../types/Task';

// 定义 Wish 接口
interface Wish {
  id: string;
  event: string;
  is_cycle: boolean;
  description: string;
  is_shared: boolean;
}

// 定义状态接口
interface TaskState {
  tasks: Task[];
}

interface WishState {
  wishes: Wish[];
}

// Helper function to check login status
const isLoggedIn = () => !!localStorage.getItem('token');

// 初始状态
const initialState: TaskState = {
  tasks: isLoggedIn() ? [] : JSON.parse(localStorage.getItem('tasks') as string) || [],
};

const wishInitialState: WishState = {
  wishes: isLoggedIn() ? [] : JSON.parse(localStorage.getItem('wishes') as string) || [],
};

// 定义 TaskResponse 接口
interface TaskResponse {
  ID: number;
  event: string;
  description: string;
  completed: boolean;
  is_cycle: boolean;
  importance_level: number;
  completed_date?: string;
}

// 创建异步 action creators
export const addTaskAsync = createAsyncThunk(
  'tasks/addTaskAsync',
  async (taskData: Task) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks`,
        {
          event: taskData.event,
          description: taskData.description,
          is_cycle: taskData.is_cycle,
          importance_level: 0
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      return {
        id: String(res.data.ID),
        event: res.data.event,
        completed: res.data.completed,
        is_cycle: res.data.is_cycle,
        description: res.data.description,
        importanceLevel: res.data.importance_level,
        completed_date: res.data.completed_date || '',
      } as Task;
    }
    return taskData;
  }
);

export const updateTaskImportanceAsync = createAsyncThunk(
  'tasks/updateTaskImportanceAsync',
  async (tasks: Task[]) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      return tasks;
    }

    const updatedTasks = tasks.map((task, index) => ({
      ...task,
      importanceLevel: index
    }));

    await Promise.all(
      updatedTasks.map(task =>
        axios.put(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/${task.id}/importance`,
          {
            importance_level: task.importanceLevel
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      )
    );

    return updatedTasks;
  }
);

// 创建 slices
const appearance = createSlice({
  name: 'appearance',
  initialState: {
    appear: false
  },
  reducers: {
    setAppearance: (state) => {
      state.appear = !state.appear;
    }
  }
});

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || ''
  },
  reducers: {
    setToken: (state, action: { payload: string }) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = '';
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }
});

const modifyTask = createSlice({
  name: 'modifyTask',
  initialState: {
    modifyTask: {
      id: '',
      event: '',
      description: '',
      isCycle: false,
      completed: false,
      importanceLevel: 0,
      completed_Date: ''
    }
  },
  reducers: {
    modify: (state, action) => {
      state.modifyTask = action.payload;
    }
  }
});

// 任务管理
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      if (!localStorage.getItem('token')) {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },

    modify_Task: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload
        };
        if (!(localStorage.getItem('token') || sessionStorage.getItem('token'))) {
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      }
    },

    deleteTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      state.tasks.splice(index, 1);
      const token = localStorage.getItem('token')||sessionStorage.getItem('token');
      if (token) {
        const deleteTask = async () => {
          await axios.delete(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/${action.payload}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        };
        deleteTask();
      } else {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },

    updateTask: (state, action) => {
      const updatedTasks = action.payload.map((task: Task, index: number) => ({
        ...task,
        importanceLevel: index
      }));
      state.tasks = updatedTasks;
      
      if (!localStorage.getItem('token') && !sessionStorage.getItem('token')) {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
    },

    isCycle: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].is_cycle = !state.tasks[index].is_cycle;
        const token = localStorage.getItem('token')||sessionStorage.getItem('token');
        if(token){
          const modify = async () => {
            try {
              await axios.put(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/${action.payload}`,
                {
                  event: state.tasks[index].event,
                  description: state.tasks[index].description,
                  is_cycle: state.tasks[index].is_cycle,
                  importance_level: state.tasks[index].importanceLevel
                },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
            } catch (error) {
              console.error('Failed to update task cycle:', error);
            }
          };
          modify();
        } else {
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      }
    },

    initialTasks: (state, action) => {
      const newTasks: Task[] = action.payload.map((task: TaskResponse) => ({
        id: String(task.ID),
        event: task.event,
        description: task.description,
        completed: task.completed,
        is_cycle: task.is_cycle,
        importanceLevel: task.importance_level || 0,
        completed_date: task.completed_date || '',
      }));
      state.tasks = newTasks;
      if (localStorage.getItem('token')) {
        localStorage.removeItem('tasks');
      }
    },

    finishTask: (state, action) => {
      const date = new Date();
      const formattedDate = date.toISOString();
      
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].completed = true;
        state.tasks[index].completed_date = formattedDate;
        
        const token = localStorage.getItem('token')||sessionStorage.getItem('token');
        if(token){
          const finish = async () => {
            try {
              await axios.put(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/tasks/${action.payload}/complete`,
                {},
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
            } catch (error) {
              console.error('Failed to complete task:', error);
            }
          };
          finish();
        } else {
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
        message.success('🔥任务完成🔥');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        taskSlice.caseReducers.addTask(state, action);
      })
      .addCase(updateTaskImportanceAsync.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
  }
});

// 心愿管理
const wishSlice = createSlice({
  name: 'wishes',
  initialState: wishInitialState,
  reducers: {
    addWish: (state, action) => {
      state.wishes.push(action.payload);
      if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
        localStorage.removeItem('wishes');
      } else {
        localStorage.setItem('wishes', JSON.stringify(state.wishes));
      }
    },
    
    initialWishes: (state, action) => {
      state.wishes = action.payload;
      if (localStorage.getItem('token')) {
        localStorage.removeItem('wishes');
      }
    },

    deleteWish: (state, action) => {
      const index = state.wishes.findIndex(wish => wish.id === action.payload);
      if (index !== -1) {
        state.wishes.splice(index, 1);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          const deleteWish = async () => {
            try {
              await axios.delete(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes/${action.payload}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
            } catch (error) {
              console.error('Failed to delete wish:', error);
            }
          };
          deleteWish();
        } else {
          localStorage.setItem('wishes', JSON.stringify(state.wishes));
        }
      }
    },

    updateWishes: (state, action) => {
      state.wishes = action.payload;
      if(!localStorage.getItem('token') && !sessionStorage.getItem('token')){
        localStorage.setItem('wishes', JSON.stringify(state.wishes));
      }
    },

    switchCycle: (state, action) => {
      const index = state.wishes.findIndex(wish => wish.id === action.payload);
      if (index !== -1) {
        state.wishes[index].is_cycle = !state.wishes[index].is_cycle;
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          const switchCycle = async () => {
            try {
              await axios.put(
                `${import.meta.env.VITE_REACT_APP_BASE_URL}/wishes/${action.payload}`,
                {
                  event: state.wishes[index].event,
                  description: state.wishes[index].description,
                  is_cycle: state.wishes[index].is_cycle
                },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
            } catch (error) {
              console.error('Failed to switch wish cycle:', error);
            }
          };
          switchCycle();
        } else {
          localStorage.setItem('wishes', JSON.stringify(state.wishes));
        }
      }
    }
  }
});

// 配置 store
const store = configureStore({
  reducer: {
    token: tokenSlice.reducer,
    tasks: taskSlice.reducer,
    wishes: wishSlice.reducer,
    appearance: appearance.reducer,
    modifyTask: modifyTask.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

// 导出 actions
export const { setAppearance } = appearance.actions;
export const { modify } = modifyTask.actions;
export const { setToken, clearToken } = tokenSlice.actions;
export const { addTask, modify_Task, deleteTask, updateTask, initialTasks, finishTask, isCycle } = taskSlice.actions;
export const { addWish, initialWishes, deleteWish, updateWishes, switchCycle } = wishSlice.actions;

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
