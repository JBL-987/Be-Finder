import { Menu } from 'lucide-react';

const MobileHeader = ({ setMobileSidebarOpen }) => {
  return (
    <div className="md:hidden flex items-center justify-between p-3 bg-gray-900 border-b border-gray-800">
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-800"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="text-sm bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-bold">
        Locatify AI
      </div>
      <div className="w-10"></div>
    </div>
  );
};

export default MobileHeader;