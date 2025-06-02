import React from 'react';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface TaskListProps {
  tasks: Task[];
}

const statusIcons = {
  'completed': <CheckCircle size={16} className="text-green-500" />,
  'in-progress': <Clock size={16} className="text-blue-500" />,
  'pending': <Circle size={16} className="text-gray-400" />,
  'overdue': <AlertCircle size={16} className="text-red-500" />
};

const priorityClasses = {
  'low': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'high': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const priorityLabels = {
  'low': 'Thấp',
  'medium': 'Trung bình',
  'high': 'Cao'
};

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Công việc sắp tới</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {statusIcons[task.status]}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hạn: {task.dueDate}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${priorityClasses[task.priority]}`}
              >
                {priorityLabels[task.priority]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;