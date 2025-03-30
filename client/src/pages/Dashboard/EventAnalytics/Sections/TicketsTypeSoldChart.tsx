import { BarChart } from "@mui/x-charts/BarChart";

interface ChartData {
  labels: string[];
  values: number[];
}

const chartSetting = {
  xAxis: [
    {
      label: "Tickets sold",
    },
  ],
  width: 400,
  height: 300,
};

function TicketsTypeSoldChart({ chartData }: { chartData: ChartData | {} }) {
  if (!("labels" in chartData) || !("values" in chartData)) return null;
  
  const transformedData: { label: string; value: number }[] =
    chartData.labels.map((label, index) => ({
      label,
      value: chartData.values[index],
    }));
  
  return (
    <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-4 md:p-6 w-full">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-white">Ticket Types Sold</h3>
      <div className="h-80 bg-neutral-50 rounded-lg flex items-center justify-center p-2">
        <div className="w-full overflow-x-scroll overflow-y-hidden md:flex md:justify-center">
          <BarChart
            dataset={transformedData}
            yAxis={[{ scaleType: "band", dataKey: "label" }]}
            series={[{ dataKey: "value", label: "Ticket Types" }]}
            layout="horizontal"
            barLabel={"value"}
            {...chartSetting}
          />
        </div>
      </div>
    </div>
  );
}

export default TicketsTypeSoldChart;