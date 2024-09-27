import { Bar } from 'react-chartjs-2';

const UsersChart = ({dataUsers} : any) => {
  const data = {
    labels: ['Organizer', 'Brand', 'Artists', 'Fans'],
    datasets: [
      {
        label: 'Users',
        data: [dataUsers?.organiser ?? 0, dataUsers?.brand ?? 0, dataUsers?.artist ?? 0, dataUsers?.fan ?? 0],  // Dummy data
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
      <h2 className="text-lg font-bold mb-2">Total Users - {(+dataUsers?.organiser ?? 0) + (+dataUsers?.brand ?? 0) + (+dataUsers?.artist ?? 0) + (+dataUsers?.fan ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default UsersChart;
