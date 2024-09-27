import { Bar } from 'react-chartjs-2';

const DemographicsChart = ({dataDemographic} : any) => {
  const data = {
    labels: ['Children (6-10)', 'Teenager (11-19)', 'Adult (20-40)', 'Senior (40+)'],
    datasets: [
      {
        label: 'Demographics',
        data: [dataDemographic?.children ?? 0, dataDemographic?.teenager ?? 0, dataDemographic?.adult ?? 0, dataDemographic?.senior ?? 0],  // Dummy data
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
      <h2 className="text-lg font-bold mb-2">Total Demographics - {(+dataDemographic?.children ?? 0) + (+dataDemographic?.teenager ?? 0) + (+dataDemographic?.adult ?? 0) + (+dataDemographic?.senior ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DemographicsChart;
