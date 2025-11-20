import LineChart from 'components/Molecules/LineChart';
import React from 'react';

const Productivity = () => {
    return (
        <div className='w-3/5 bg-white p-6 shadow-lg rounded-lg'>
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Weekly Activity
            </h2>
            <LineChart data={[10, 40, 32, 55, 20, 42, 35]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                height={300}
                areaColor="#FFEB3B"   // sariq area
                lineColor="#FBC02D"
            />
        </div>
    );
}

export default React.memo(Productivity);
