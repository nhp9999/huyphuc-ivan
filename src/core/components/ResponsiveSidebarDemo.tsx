import React from 'react';
import { Monitor, Tablet, Smartphone, Menu, X } from 'lucide-react';

const ResponsiveSidebarDemo: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Responsive Sidebar Implementation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          The sidebar now adapts seamlessly across all device sizes with enhanced user experience.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Smartphone className="text-blue-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mobile First</h3>
          </div>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Overlay sidebar on mobile</li>
            <li>• Touch-friendly interactions</li>
            <li>• Swipe to close gesture</li>
            <li>• Auto-close after navigation</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Tablet className="text-green-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tablet Optimized</h3>
          </div>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Responsive breakpoints</li>
            <li>• Improved touch targets</li>
            <li>• Smooth transitions</li>
            <li>• Backdrop overlay</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Monitor className="text-purple-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Desktop Enhanced</h3>
          </div>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Collapsible sidebar</li>
            <li>• Persistent state</li>
            <li>• Keyboard navigation</li>
            <li>• Accessibility compliant</li>
          </ul>
        </div>
      </div>

      {/* Responsive Behavior */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Responsive Behavior
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <Smartphone className="mx-auto text-blue-600 mb-2" size={32} />
              <h4 className="font-semibold text-gray-900 dark:text-white">Mobile</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">&lt; 1024px</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Fixed overlay with backdrop
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <Tablet className="mx-auto text-green-600 mb-2" size={32} />
              <h4 className="font-semibold text-gray-900 dark:text-white">Tablet</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">1024px - 1440px</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Responsive overlay/inline
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <Monitor className="mx-auto text-purple-600 mb-2" size={32} />
              <h4 className="font-semibold text-gray-900 dark:text-white">Desktop</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">&gt; 1440px</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Inline collapsible sidebar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Key Features Implemented
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Mobile Enhancements
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Fixed overlay positioning
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Backdrop with click-to-close
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Swipe gesture support
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Body scroll prevention
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Auto-close after navigation
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Accessibility & UX
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                WCAG 2.1 AA compliance
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Keyboard navigation (ESC key)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Screen reader support
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Reduced motion support
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Enhanced touch targets
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          How to Test
        </h3>
        <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Resize your browser window to see responsive behavior</li>
          <li>• On mobile: Use the menu button in the header to toggle sidebar</li>
          <li>• Try swiping left on the sidebar to close it (mobile)</li>
          <li>• Press ESC key to close sidebar on mobile</li>
          <li>• Click the backdrop to close sidebar on mobile</li>
        </ul>
      </div>
    </div>
  );
};

export default ResponsiveSidebarDemo;
