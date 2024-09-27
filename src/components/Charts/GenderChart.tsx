import { Bar } from 'react-chartjs-2';

const GenderChart = ({dataGender} : any) => {
  const data = {
    labels: ['Male', 'Female', 'non-binary','not specified'],
    datasets: [
      {
        label: 'Demographics',
        data: [dataGender?.male ?? 0, dataGender?.female ?? 0, dataGender?.nonBinary ?? 0, dataGender?.notSpecified ?? 0],  // Dummy data
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
      <h2 className="text-lg font-bold mb-2">Total Gender Counts - {(+dataGender?.male ?? 0) + (+dataGender?.female ?? 0) + (+dataGender?.nonBinary ?? 0) + (+dataGender?.notSpecified ?? 0)}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GenderChart;
