import { PieChart } from '@mui/x-charts/PieChart';

function PaymentTypeChart({ chartData }: { chartData: { labels: string[], values: number[] } | {} }) {
  if (!("labels" in chartData) || !("values" in chartData)) return null;
  
  // Updated color palette with background and border colors
  const colors = [
    { background: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)" },
    { background: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" },
    { background: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)" },
    { background: "rgba(255, 159, 64, 0.6)", border: "rgba(255, 159, 64, 1)" },
  ];
  
  // Transform chartData object into an array of { id, value, label, color }
  const data = chartData.labels
    .map((label, index) => ({ label, value: chartData.values[index] }))
    .filter(({ value }) => value > 0) // Filter out zero values
    .map(({ label, value }, index) => ({
      id: index,
      value,
      label,
      color: colors[index % colors.length].background,
      borderColor: colors[index % colors.length].border,
    }));
  
  return (
    <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-4 md:p-6 w-full">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-white">Payment Distribution</h3>
      <div className="h-80 bg-neutral-50 rounded-lg flex items-center justify-center p-2">
        <div className="w-full overflow-x-scroll overflow-y-hidden md:flex md:justify-center">
          <PieChart
            series={[{
              data,
              innerRadius: 60,
              outerRadius: 150,
              paddingAngle: 2,
              cornerRadius: 5,
              arcLabel: (item) => `${item.value}`,
            }]}
            width={600}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentTypeChart;