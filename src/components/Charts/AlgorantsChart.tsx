import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AlgorantsChart = ({dataAlgorant}: any) => {
  const data = {
    labels: ['Wallet Creation', 'Assets Counts', 'Transaction Count'],
    datasets: [
      {
        label: 'Algorants Data',
        data: [dataAlgorant?.wallets ?? 0, dataAlgorant?.assets ?? 0, dataAlgorant?.transaction ?? 0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    
    scales: {
      x: {
        grid: {
          display: false,  
        },
      },
      y: {
        grid: {
          display: false,  
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white h-full w-full pb-10 shadow-md p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Total no of Algorants - {(+dataAlgorant?.wallets ?? 0) + (+dataAlgorant?.assets ?? 0) + (+dataAlgorant?.transaction ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AlgorantsChart;
