import { Bot, User, Send } from 'lucide-react';

const ChatPanel = ({
  currentChat,
  chatBoxRef,
  formatDate,
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
}) => {
  return (
    <div className="w-full md:w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <Bot className="w-5 h-5 mr-2 text-blue-400" />
            AI Assistant
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 md:max-h-none"
      >
        {currentChat.map((message, index) => (
          <div key={index} className="flex items-start space-x-2">
            {message.user ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3">
                  <p className="text-sm text-gray-100">{message.user.content}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(new Date())}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-800 rounded-lg p-3">
                  <div className="text-sm text-gray-100 whitespace-pre-wrap">
                    {message.system.content}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(new Date())}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about locations..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;