import { MessageSquare, Plus, Search, X } from 'lucide-react';

const Sidebar = ({
  sidebarOpen,
  mobileSidebarOpen,
  createNewSession,
  searchQuery,
  setSearchQuery,
  filteredSessions,
  selectSession,
  currentSessionId,
  deleteSession,
  formatTime,
}) => {
  return (
    <div
      className={`
        ${sidebarOpen ? 'w-64 md:w-80' : 'w-0'}
        ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden md:block'}
        transition-all duration-300 bg-gray-900 border-r border-gray-800 overflow-hidden flex flex-col
        ${mobileSidebarOpen ? 'shadow-2xl' : ''}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
            AI Chat
          </h2>
          <button
            onClick={createNewSession}
            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat sessions yet</p>
            <p className="text-xs">Start a new conversation</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => selectSession(session.id)}
              className={`group p-3 rounded-lg cursor-pointer transition-all ${
                currentSessionId === session.id
                  ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate mb-1">
                    {session.title}
                  </h3>
                  <p className="text-xs text-gray-400 truncate mb-1">
                    {session.lastMessage || 'No messages yet'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(session.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded text-gray-400 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;