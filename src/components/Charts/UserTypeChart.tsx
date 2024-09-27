import { Bar } from 'react-chartjs-2';

const UserTypeChart = ({dataUserType} : any) => {
  const data = {
    labels: ['Desktop', 'Android', 'IOS'],
    datasets: [
      {
        label: 'Demographics',
        data: [dataUserType?.desktop ?? 0, dataUserType?.android ?? 0, dataUserType?.ios ?? 0],  // Dummy data
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
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
      <h2 className="text-lg font-bold mb-2">Total User Type - {(dataUserType?.desktop ?? 0) + (dataUserType?.android ?? 0) + (dataUserType?.ios ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default UserTypeChart;
