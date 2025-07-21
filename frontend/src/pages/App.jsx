import { useState, useEffect, useRef } from 'react';
import {
  Map,
  BarChart3,
  FileText,
  Database,
} from 'lucide-react';
import ChatPanel from '../components/ChatPanel';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import TabBar from '../components/TabBar';
import MobileHeader from '../components/MobileHeader';
import MobileSidebarOverlay from '../components/MobileSidebarOverlay';
import { getChatCompletion } from '../services/openRouter';

// Integrated App Component
const App = ({ actor, isAuthenticated, login }) => {
    const [files, setFiles] = useState([]);
    const [fileTransferProgress, setFileTransferProgress] = useState();
    const [activeTab, setActiveTab] = useState('map');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); 
    const [currentChat, setCurrentChat] = useState([
      { 
        system: { content: "I'm Be-Finder's AI assistant living on the Internet Computer. I'm here to help you find strategic locations. Ask about locations, area analysis, or business insights!" }
      }
    ]);
    const chatBoxRef = useRef(null);
    const [nextSessionId, setNextSessionId] = useState(1);

    // Format date function
    const formatDate = (date) => {
      const h = '0' + date.getHours();
      const m = '0' + date.getMinutes();
      return `${h.slice(-2)}:${m.slice(-2)}`;
    };

    // Format timestamp for sessions
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    };

    // Convert chat messages to OpenRouter format
    const convertMessagesToOpenRouter = (messages) => {
      return messages.filter(msg => msg.user || msg.system).map(msg => {
        if (msg.user) {
          return { role: "user", content: msg.user.content };
        } else {
          return { role: "assistant", content: msg.system.content };
        }
      });
    };

    // Save chat session to file storage
    const saveChatSession = async (sessionId, messages) => {
      if (!actor || !isAuthenticated) return;
      
      try {
        const chatData = {
          sessionId,
          messages,
          timestamp: Date.now()
        };
        
        const chatJson = JSON.stringify(chatData, null, 2);
        const chatBlob = new Blob([chatJson], { type: 'application/json' });
        const fileName = `chat_session_${sessionId}.json`;
        
        // Convert blob to Uint8Array for ICP storage
        const arrayBuffer = await chatBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Check if file exists before uploading
        const fileExists = await actor.checkFileExists(fileName);
        if (!fileExists) {
          // Upload in chunks for larger files
          const chunkSize = 1024 * 1024; // 1MB chunks
          const totalChunks = Math.ceil(uint8Array.length / chunkSize);
          
          for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, uint8Array.length);
            const chunk = uint8Array.slice(start, end);
            
            await actor.uploadFileChunk(fileName, chunk, BigInt(i), 'application/json');
          }
        }
      } catch (error) {
        console.error('Error saving chat session:', error);
      }
    };

    // Load chat sessions from file storage
    const loadChatSessions = async () => {
      if (!actor || !isAuthenticated) return;
      
      try {
        const fileList = await actor.getFiles();
        const chatFiles = fileList.filter(file => file.name.startsWith('chat_session_'));
        
        const loadedSessions = [];
        for (const file of chatFiles) {
          try {
            const totalChunks = Number(await actor.getTotalChunks(file.name));
            let chunks = [];
            
            for (let i = 0; i < totalChunks; i++) {
              const chunkBlob = await actor.getFileChunk(file.name, BigInt(i));
              if (chunkBlob && chunkBlob[0]) {
                chunks.push(chunkBlob[0]);
              }
            }
            
            const chatBlob = new Blob(chunks, { type: 'application/json' });
            const chatText = await chatBlob.text();
            const chatData = JSON.parse(chatText);
            
            const sessionId = chatData.sessionId;
            const messages = chatData.messages || [];
            const timestamp = chatData.timestamp || Date.now();
            
            // Create session object
            const session = {
              id: sessionId,
              title: messages.find(m => m.user)?.user?.content?.slice(0, 30) + '...' || 'New Chat',
              lastMessage: messages.find(m => m.user)?.user?.content || '',
              timestamp,
              messages
            };
            
            loadedSessions.push(session);
          } catch (error) {
            console.error('Error loading chat session:', file.name, error);
          }
        }
        
        // Sort by timestamp (newest first)
        loadedSessions.sort((a, b) => b.timestamp - a.timestamp);
        setChatSessions(loadedSessions);
        
        // Update next session ID
        if (loadedSessions.length > 0) {
          const maxId = Math.max(...loadedSessions.map(s => s.id));
          setNextSessionId(maxId + 1);
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      }
    };
  
    // Upload file function
    const uploadFile = async (file) => {
      if (!actor || !isAuthenticated) {
        alert("Please log in to upload files.");
        return;
      }
  
      try {
        const fileName = file.name;
        const fileType = file.type;
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
  
        const chunkSize = 1024 * 1024; // 1MB chunks
        const totalChunks = Math.ceil(uint8Array.length / chunkSize);
  
        setFileTransferProgress({ fileName, total: totalChunks, loaded: 0 });
  
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, uint8Array.length);
          const chunk = uint8Array.slice(start, end);
  
          await actor.uploadFileChunk(fileName, chunk, BigInt(i), fileType);
          setFileTransferProgress(prev => ({ ...prev, loaded: i + 1 }));
        }
  
        setFileTransferProgress(null);
        loadFiles(); // Refresh file list
      } catch (error) {
        console.error('Error uploading file:', error);
        setFileTransferProgress(null);
      }
    };
  
    // Load files from storage
    const loadFiles = async () => {
      if (!actor || !isAuthenticated) return;
      try {
        const fileList = await actor.getFiles();
        setFiles(fileList);
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };
  
    // Delete file
    const deleteFile = async (fileName) => {
      if (!actor || !isAuthenticated) return;
      try {
        await actor.deleteFile(fileName);
        loadFiles(); // Refresh file list
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    };
  
    // Load chat sessions and files when authenticated
    useEffect(() => {
      if (isAuthenticated && actor) {
        loadChatSessions();
        loadFiles();
      }
    }, [isAuthenticated, actor]);
  
    // Tab configuration
    const tabs = [
      { id: 'map', label: 'Map', icon: Map },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'data', label: 'Data', icon: Database }
    ];

    // Ask agent function using OpenRouter API
    const askAgent = async (messages, sessionId) => {
      try {
        // Convert messages to OpenRouter format (exclude system messages for API)
        const openRouterMessages = convertMessagesToOpenRouter(messages);
        
        // Get response from OpenRouter API
        const response = await getChatCompletion(openRouterMessages);
        
        const newSystemMessage = { system: { content: response } };
        
        // Update the chat with the final response
        setCurrentChat(prevChat => {
          const finalChat = [...prevChat];
          finalChat.pop(); // Remove "Thinking..."
          finalChat.push(newSystemMessage);
          return finalChat;
        });
        
        // Update session and save to file storage
        if (sessionId) {
          const finalMessages = [...messages, newSystemMessage];
          
          setChatSessions(prev => prev.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: finalMessages,
                  timestamp: Date.now(),
                  lastMessage: messages.find(m => m.user)?.user.content || session.lastMessage
                }
              : session
          ));
          
          // Save to file storage
          await saveChatSession(sessionId, finalMessages);
        }
      } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        setCurrentChat(prev => {
          const errorChat = [...prev];
          errorChat.pop(); // Remove "Thinking..."
          errorChat.push({ system: { content: `Error: ${error.message || 'Failed to get response from AI'}` } });
          return errorChat;
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    // Create new chat session
    const createNewSession = () => {
      const sessionId = nextSessionId;
      setNextSessionId(prev => prev + 1);
      
      const newSession = {
        id: sessionId,
        title: "New Chat",
        lastMessage: "",
        timestamp: Date.now(),
        messages: [
          { system: { content: "I'm Be-Finder's AI assistant living on the Internet Computer. I'm here to help you find strategic locations. Ask about locations, area analysis, or business insights!" } }
        ]
      };
      
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(sessionId);
      setCurrentChat(newSession.messages);
      
      if (window.innerWidth < 768) {
        setMobileSidebarOpen(false);
      }
    };
    
    // Select session
    const selectSession = (sessionId) => {
      const session = chatSessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        setCurrentChat(session.messages);
        
        if (window.innerWidth < 768) {
          setMobileSidebarOpen(false);
        }
      }
    };
    
    // Handle submit with OpenRouter API integration
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;

      let sessionId = currentSessionId;
      let isNewSession = false;

      // Create new session if none exists
      if (!sessionId) {
        sessionId = nextSessionId;
        setNextSessionId(prev => prev + 1);
        setCurrentSessionId(sessionId);
        isNewSession = true;
      }

      const userMessage = { user: { content: inputValue } };
      const thinkingMessage = { system: { content: 'Thinking ...' } };
      
      const updatedChat = [...currentChat, userMessage];
      const chatWithThinking = [...updatedChat, thinkingMessage];
      
      setCurrentChat(chatWithThinking);

      // Update or create session
      const sessionTitle = inputValue.length > 30 ? inputValue.substring(0, 30) + '...' : inputValue;
      
      if (isNewSession) {
        const newSession = {
          id: sessionId,
          title: sessionTitle,
          lastMessage: inputValue,
          timestamp: Date.now(),
          messages: updatedChat // Save without "Thinking..."
        };
        setChatSessions(prev => [newSession, ...prev]);
      } else {
        setChatSessions(prev => prev.map(session =>
          session.id === sessionId
            ? {
                ...session,
                lastMessage: inputValue,
                timestamp: Date.now(),
                messages: updatedChat // Save without "Thinking..."
              }
            : session
        ));
      }

      setInputValue('');
      setIsLoading(true);

      // Prepare messages for the OpenRouter API (excluding the initial system message)
      const messagesToSend = updatedChat.slice(1);
      askAgent(messagesToSend, sessionId);
    };
    
    // Delete session
    const deleteSession = async (sessionId) => {
      const sessionToDelete = chatSessions.find(s => s.id === sessionId);
      if (!sessionToDelete) return;

      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // Delete from file storage
      if (actor && isAuthenticated) {
        try {
          const fileName = `chat_session_${sessionId}.json`;
          await actor.deleteFile(fileName);
        } catch (error) {
          console.error('Error deleting chat session file:', error);
        }
      }
      
      if (currentSessionId === sessionId) {
        const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          // Select the most recent session
          selectSession(remainingSessions[0].id);
        } else {
          // No sessions left, create a new one
          createNewSession();
        }
      }
    };
  
    // Auto-scroll chat
    useEffect(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, [currentChat]);
  
    // Filter sessions based on search
    const filteredSessions = chatSessions.filter(session =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Close mobile sidebar when resizing to larger screens
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setMobileSidebarOpen(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return (
      <div className="h-screen pt-16 bg-dark-bg text-dark-text-primary flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader setMobileSidebarOpen={setMobileSidebarOpen} />
  
        {/* Tab Bar */}
        <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
  
        <div className="flex-1 flex overflow-hidden">
          {/* Mobile Sidebar Overlay */}
          <MobileSidebarOverlay
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
  
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            mobileSidebarOpen={mobileSidebarOpen}
            createNewSession={createNewSession}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredSessions={filteredSessions}
            selectSession={selectSession}
            currentSessionId={currentSessionId}
            deleteSession={deleteSession}
            formatTime={formatTime}
          />
  
          {/* Main Content */}
          <MainContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeTab={activeTab}
            uploadFile={uploadFile}
            fileTransferProgress={fileTransferProgress}
            files={files}
            deleteFile={deleteFile}
          />
  
          {/* Chat Panel */}
          <ChatPanel
            currentChat={currentChat}
            chatBoxRef={chatBoxRef}
            formatDate={formatDate}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  };

export default App;