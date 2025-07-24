# Be-Finder 🗺️

**AI-Powered Location Intelligence Platform on the Internet Computer**

Be-Finder is a sophisticated location intelligence platform that combines advanced AI capabilities with blockchain technology to help businesses and individuals discover optimal locations for their needs. Built on the Internet Computer Protocol (ICP), it offers secure, decentralized file storage and real-time AI-powered location analysis.

## 🌟 Features

### 🤖 AI-Powered Location Analysis
- **Smart Location Recommendations**: Advanced AI algorithms analyze market trends, demographics, and competition
- **Predictive Analytics**: Forecast business success potential with data-driven insights
- **Real-time Chat Assistant**: Interactive AI assistant specialized in location intelligence
- **Market Intelligence**: Comprehensive analysis of local market conditions and opportunities

### 🗺️ Interactive Mapping
- **Dynamic Map Interface**: Interactive maps with multiple data layers
- **Location Pinning**: Mark and save potential locations with detailed analysis
- **Radius Analysis**: Visualize catchment areas and market reach
- **Geocoding Services**: Search and locate addresses with precision

### 💾 Decentralized File Storage
- **Blockchain Storage**: Secure file storage on the Internet Computer
- **Chat Session Persistence**: AI conversations saved and retrievable across sessions
- **File Management**: Upload, download, and manage documents with chunked transfer
- **Data Integrity**: Immutable storage with cryptographic security

### 🔐 Secure Authentication
- **Internet Identity Integration**: Passwordless authentication using ICP's Internet Identity
- **Privacy-First**: No personal data stored on external servers
- **Seamless Login**: One-click authentication across devices

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Progressive Web App**: App-like experience in the browser
- **Dark Theme**: Modern, professional interface design
- **Touch-Friendly**: Intuitive mobile interactions

## 🏗️ Architecture

### Backend (Motoko)
- **Persistent Actor**: `Filevault` canister for secure file storage
- **Chunked Upload**: Efficient handling of large files
- **User Isolation**: Principal-based data segregation
- **Enhanced Orthogonal Persistence**: Automatic state preservation

### Frontend (React + Vite)
- **Modern React**: Hooks-based architecture with functional components
- **Responsive UI**: Tailwind CSS for consistent styling
- **Real-time Updates**: Dynamic state management
- **Service Integration**: OpenRouter AI API integration

### Key Technologies
- **Internet Computer Protocol (ICP)**: Blockchain infrastructure
- **Motoko**: Smart contract programming language
- **React 18**: Modern frontend framework
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Leaflet**: Interactive mapping library
- **OpenRouter API**: AI language model integration

## 🚀 Quick Start

### Prerequisites
- [DFX SDK](https://internetcomputer.org/docs/building-apps/getting-started/install) (v0.15.0+)
- [Node.js](https://nodejs.org/) (v18+)
- [Mops](https://docs.mops.one/quick-start) (Motoko package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JBL-987/Be-Finder.git
   cd Be-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local development environment**
   ```bash
   dfx start --background --clean
   ```

4. **Deploy to local network**
   ```bash
   dfx deploy
   ```

5. **Start frontend development server**
   ```bash
   npm run dev
   ```

### Environment Setup

Create a `.env` file in the root directory:
```env
VITE_REACT_OPENROUTER_API_KEY=your_openrouter_api_key_here
DFX_NETWORK=local
```

## 📖 Usage

### Getting Started
1. **Access the Application**: Navigate to the local development URL (typically `http://localhost:3000`)
2. **Authenticate**: Click "Discover Locations" to login with Internet Identity
3. **Explore Features**: Use the tab navigation to access different tools

### Core Workflows

#### Location Analysis
1. Navigate to the **Map** tab
2. Search for locations using the search bar
3. Click on the map to pin potential locations
4. Use the radius tool to analyze catchment areas
5. Chat with the AI assistant for detailed insights

#### AI Consultation
1. Open the **AI Chat** panel (right sidebar)
2. Ask questions about locations, market analysis, or business strategy
3. Sessions are automatically saved to your personal storage
4. Access previous conversations from the chat history

#### Data Management
1. Switch to the **Data** tab
2. Upload relevant documents and files
3. Files are stored securely on the blockchain
4. Download or delete files as needed

## 🛠️ Development

### Project Structure
```
Be-Finder/
├── backend/
│   └── app.mo              # Motoko smart contract
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API integrations
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── src/declarations/       # Generated canister interfaces
├── dfx.json               # DFX configuration
├── mops.toml              # Motoko dependencies
└── package.json           # Workspace configuration
```

### Available Scripts

```bash
# Development
npm run dev          # Start frontend development server
dfx start           # Start local ICP replica
dfx deploy          # Deploy canisters

# Building
npm run build       # Build frontend for production
dfx build           # Build canisters

# Testing
dfx canister call backend getFiles  # Test backend functions
```

### Adding New Features

1. **Backend Changes**: Modify `backend/app.mo` for new canister methods
2. **Frontend Integration**: Update service files in `frontend/src/services/`
3. **UI Components**: Add new components in `frontend/src/components/`
4. **Routing**: Update routes in `frontend/src/main.jsx`

## 🌐 Deployment

### Local Development
```bash
dfx start --background
dfx deploy
npm run dev
```

### Mainnet Deployment
```bash
dfx deploy --network ic
```

### ICP Ninja Deployment
[![Deploy to ICP](https://icp.ninja/assets/open.svg)](https://icp.ninja/i?g=https://github.com/JBL-987/Be-Finder)

## 🔧 Configuration

### Backend Configuration
- **Enhanced Orthogonal Persistence**: Enabled for automatic state preservation
- **Motoko Dependencies**: Base library and Map utilities
- **Chunked File Upload**: 1MB chunks for efficient transfer

### Frontend Configuration
- **Vite Build Tool**: Fast development and optimized production builds
- **Tailwind CSS**: Custom dark theme with gradient accents
- **Environment Variables**: Configurable API keys and network settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for type safety where applicable
- Maintain responsive design principles
- Test canister methods thoroughly
- Document new features and APIs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Be-Finder on ICP](https://icp.ninja/i?g=https://github.com/JBL-987/Be-Finder)
- **Internet Computer**: [internetcomputer.org](https://internetcomputer.org)
- **DFX Documentation**: [SDK Docs](https://internetcomputer.org/docs/building-apps/getting-started/install)
- **Motoko Language**: [Motoko Docs](https://internetcomputer.org/docs/motoko/main/motoko)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/JBL-987/Be-Finder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JBL-987/Be-Finder/discussions)
- **ICP Community**: [Forum](https://forum.dfinity.org/)

## 🙏 Acknowledgments

- **DFINITY Foundation** for the Internet Computer Protocol
- **OpenRouter** for AI API services
- **OpenStreetMap** for mapping data
- **React Team** for the excellent frontend framework
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ on the Internet Computer**
