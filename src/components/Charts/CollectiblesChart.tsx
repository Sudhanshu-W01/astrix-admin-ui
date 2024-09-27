import { Bar } from 'react-chartjs-2';

const CollectiblesChart = ({dataCollectibles} : any) => {
  const data = {
    labels: ['Active', 'Freezed'],
    datasets: [
      {
        label: 'Users',
        data: [dataCollectibles?.acive ?? 0, dataCollectibles?.freezed ?? 0],  // Dummy data
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,  // Hide x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false,  // Hide y-axis grid lines
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Total Collectibles - {(+dataCollectibles?.acive ?? 0) + (+dataCollectibles?.freezed ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CollectiblesChart;
