import { Bar } from 'react-chartjs-2';

const EventsChart = ({dataEvent} : any) => {
  const data = {
    labels: ['Upcoming', 'Live', 'Expired'],
    datasets: [
      {
        label: 'Users',
        data: [dataEvent?.upcoming ?? 0, dataEvent?.live ?? 0, dataEvent?.expired ?? 0],  // Dummy data
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
      <h2 className="text-lg font-bold mb-2">Total Events - {(+dataEvent?.upcoming ?? 0) + (+dataEvent?.live ?? 0) + (+dataEvent?.expired ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default EventsChart;
