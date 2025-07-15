import { Settings } from 'lucide-react';

const TabBar = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="bg-gray-900 border-b border-gray-800 flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2">
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="hidden md:flex items-center space-x-2">
        <div className="text-xs sm:text-sm bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-bold">
          Locatify AI
        </div>
        <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default TabBar;