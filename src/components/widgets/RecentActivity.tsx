import React from 'react';
import { Calendar, Users, FileText, Tag } from 'lucide-react';

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: 'calendar' | 'users' | 'file' | 'tag';
}

const iconMap = {
  calendar: { icon: Calendar, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  users: { icon: Users, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  file: { icon: FileText, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
  tag: { icon: Tag, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' }
};

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, color } = iconMap[activity.icon];
          
          return (
            <div key={activity.id} className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline w-full text-center">
        View all activity
      </button>
    </div>
  );
};

export default RecentActivity;