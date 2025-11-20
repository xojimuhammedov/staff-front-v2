import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ApexChartProps {
    data: number[];
    labels: string[];
    height?: number;
    seriesName?: string;
    areaColor?: string;   // area fill
    lineColor?: string;   // stroke color
}

const ApexChart: React.FC<ApexChartProps> = ({
    data,
    labels,
    height = 350,
    seriesName = "Series",
    areaColor = "#90caf9",   // default light blue
    lineColor = "#1e88e5"    // default blue
}) => {
    const options: ApexOptions = {
        chart: {
            type: 'area',
            height,
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: [lineColor]
        },
        fill: {
            type: "gradient",
            colors: [areaColor],
            gradient: {
                shadeIntensity: 0.4,
                opacityFrom: 0.6,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        labels,
        yaxis: { opposite: false },
        // grid: {
        //     yaxis: {
        //         lines: {
        //             show: false
        //         }
        //     }
        // }
    };

    const series = [
        {
            name: seriesName,
            data
        }
    ];

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={height}
            />
        </div>
    );
};

export default ApexChart;
