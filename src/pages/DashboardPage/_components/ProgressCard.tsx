import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Employee {
    id: number;
    name: string;
    score: number;
    avatar: string;
}

interface EmployeeRowProps {
    employee: Employee;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee }) => {
    return (
        <div className="bg-gray-50 rounded-2xl px-4 py-2 mb-4">
            <div className="flex items-center gap-4">
                <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {employee.name}
                    </h3>
                    <div className="flex items-center gap-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1 overflow-hidden">
                            <div
                                className="bg-green-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${employee.score}%` }}
                            />
                        </div>
                        <span className="text-xl font-bold text-green-500 min-w-[80px] text-right">
                            {employee.score}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressCard: React.FC = () => {
    const employees: Employee[] = [
        {
            id: 1,
            name: 'Sarah Johnson',
            score: 88.9,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
        },
        {
            id: 2,
            name: 'Michael Chen',
            score: 97.2,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            score: 96.8,
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
        },
        {
            id: 4,
            name: 'David Kim',
            score: 95.9,
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        },
        {
            id: 5,
            name: 'Jessica Taylor',
            score: 95.3,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-green-600" strokeWidth={2} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Top Effective Employees
                    </h1>
                    <p className="text-gray-500 text-xs">
                        Highest productivity scores
                    </p>
                </div>
            </div>

            <div className="space-y-0">
                {employees.map((employee) => (
                    <EmployeeRow key={employee.id} employee={employee} />
                ))}
            </div>
        </div>
    );
};

export default ProgressCard;