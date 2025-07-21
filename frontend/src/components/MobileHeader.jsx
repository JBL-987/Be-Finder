import { Menu } from 'lucide-react';

const MobileHeader = ({ setMobileSidebarOpen }) => {
  return (
    <div className="md:hidden flex items-center justify-between p-3 bg-dark-surface border-b border-dark-border">
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="p-2 rounded-lg hover:bg-dark-bg"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="text-sm bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-bold">
        Be-Finder
      </div>
      <div className="w-10"></div>
    </div>
  );
};

export default MobileHeader;