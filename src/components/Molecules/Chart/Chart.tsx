import { FC } from 'react';
import ReactEcharts from 'echarts-for-react';
import { twMerge } from 'tailwind-merge';

interface ChartProps {
    height?: string | number;
    width?: string | number;
    className?: string | string[];
    legends?: Array<{ color?: string; legend: string; className: string }>;
    series: Array<{
        name?: string;
        data: number[];
        type?: ChartProps['type'];
        color?: string;
        itemStyle?: any;
        label?: any;
    }>;
    xAxis: {
        data: string[];
    };
    type: 'line' | 'bar' | 'pictorialBar';
}

const Chart: FC<ChartProps> = ({
    height = '80%',
    width,
    className,
    legends = [],
    series,
    xAxis,
    type
}) => {
    const options = {
        grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: type === 'bar',
            axisLabel: {
                formatter: (value: string) => {
                    const truncatedValue = value.length > 9 ? value.slice(0, 9) + '...' : value;
                    return truncatedValue;
                }
            },
            ...xAxis
        },
        yAxis: {
            type: 'value'
        },
        series: series.map((item) => ({ type, ...item })),
        tooltip: {
            trigger: 'axis'
        }
    };

    return (
        <div className="h-full w-full">
            <ReactEcharts
                option={options}
                style={{ height, width }}
                className={twMerge('w-full', className)}
            />

            {legends && (
                <div className="mt-l flex items-center pl-[10px]">
                    {legends.map((legend, i) => (
                        <div className="flex items-center" key={i}>
                            <div
                                className={twMerge(
                                    'ml-2 mr-2 h-3 w-3 rounded-full',
                                    legend.className,
                                    i === 0 && 'ml-0'
                                )}
                            />
                            <p className="text-c-s text-text-base dark:text-dark-text">{legend.legend}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Chart;
