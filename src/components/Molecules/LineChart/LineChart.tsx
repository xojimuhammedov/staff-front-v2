import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ApexChartProps {}

const ApexChart: React.FC<ApexChartProps> = () => {
  const [chartState, setChartState] = useState<any>({
    series: [
      {
        name: 'STOCK ABC',
        data: [45, 52, 38, 45, 19, 23, 2]
      }
    ],
    options: {
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      labels: [
        'Department',
        'Department',
        'Department',
        'Department',
        'Department',
        'Department',
        'Department'
      ],
      yaxis: {
        opposite: false
      }
    }
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="area"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
