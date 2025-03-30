import { LineChart } from '@mui/x-charts/LineChart';

interface ChartData {
  label: string;
  revenue: number;
}

function RevenueChart({ chartData }: { chartData: ChartData[] | {} }) {
  if (!Array.isArray(chartData) || chartData.length === 0) return null;
  
  return (
    <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-4 md:p-6 w-full">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-white">Revenue Trend</h3>
      <div className="h-80 bg-neutral-50 rounded-lg flex justify-center items-center px-2">
        <div className="w-full overflow-x-scroll overflow-y-hidden md:flex md:justify-center">
          <LineChart
            series={[
              {
                data: chartData.map((item) => item.revenue),
                label: 'Revenue (₹)',
                color: '#4f46e5',
                area: true,
                curve: 'catmullRom',
              },
            ]}
            xAxis={[{
              scaleType: 'point',
              data: chartData.map((item) => item.label),
              label: 'Date'
            }]}
            width={800}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;