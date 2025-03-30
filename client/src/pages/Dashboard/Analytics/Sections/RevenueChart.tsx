import { LineChart } from '@mui/x-charts/LineChart';

interface ChartData {
  label: string;
  revenue: number;
}

function RevenueChart({ chartData }: { chartData: ChartData[] }) {
  return (
    <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-4 md:p-6 w-full">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-white">Revenue Trend</h3>
      <div className="md:h-80 bg-neutral-50 rounded-lg flex justify-center items-center px-2">
        <div className="w-full overflow-x-scroll overflow-y-hidden">
          <LineChart
            series={[
              {
                data: chartData.map((item) => item.revenue),
                label: 'Revenue (₹)',
                color: '#0f52ba',
                area: true,
                curve: 'catmullRom',
              },
            ]}
            xAxis={[{
              scaleType: 'point',
              data: chartData.map((item) => item.label),
              label:'Date'
            }]}
            width={1100}
            height={320}
          />
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;