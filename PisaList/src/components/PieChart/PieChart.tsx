import { Pie } from'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { useSelector  } from 'react-redux';
import './PieChart.css'
import { useEffect,useState } from 'react';
Chart.register(...registerables);

interface Task {
  id: string;
  event: string;
  completed: boolean;
  is_cycle: boolean;
  description: string;
  importanceLevel:number;
  completed_date: string;
}

interface RootState {
  tasks:{
    tasks:Task[]
  }
}


const PieChart: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [taskLabel,setTaskLabel]=useState<string[]>([]);
  const [chartData,setChartData]=useState<number[]>([]);
  const [date,setDate]=useState<string>("");
  //获取日期
  useEffect(()=>{
    const getDate=()=>{
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    setDate(getDate());
  },[])
  const filteredTasks =tasks.filter((task:Task) => {
    if (!task.completed) return true;
    
    if (task.is_cycle) {
      const taskDate = task.completed_date.split('T')[0];
      return taskDate != date;
    }
    
    return false;
  });



  useEffect(() => {
    const tempData:number[]=[];
    //运用等比数列
    if(tasks.length>0){
    const a1=100/(Math.pow(1.6,tasks.length)-1)
    const tempLabel:string[]=filteredTasks.map((task:Task)=>task.event);

    for (let i = 0; i < tasks.length; i++){
      
      tempData.push(a1*Math.pow(1.6,i));
    }
    setTaskLabel(tempLabel);
    setChartData(tempData);
  }else{
    setTaskLabel([]);
    setChartData([]);
  }
  }, [tasks,date]);


   const data={
    labels:taskLabel,
    datasets: [
      {
        data: chartData,
        backgroundColor: ['#F6B45DED'],
        hoverOffset: 4,

 
}
    ],

  };

  const options = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<"pie">) {
            return tasks[context.dataIndex].description;
          },
        //   afterLabel: function(tooltipItem: TooltipItem<"pie">) {
        //     return `描述: ${tasks[tooltipItem.dataIndex].description}`;
        //   }
        }
      },    
      datalabels: {
        display: false
      },
      radius:'50%'
    }
  };


  return (
    <div className='PieChart'>
      <Pie data={data}  options={options} />
    </div>
  );
};

export default PieChart;
