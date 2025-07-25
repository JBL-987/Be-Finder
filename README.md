# Be-Finder: AI-Powered Business Profitability Analyzer

Be-Finder is an intelligent business location analysis platform built on the Internet Computer (ICP) that helps entrepreneurs and businesses evaluate the profitability potential of any location in Jakarta. Using advanced AI analysis and comprehensive business metrics, the platform provides data-driven insights for strategic business location decisions.

## Vision

Democratize business location intelligence by providing AI-powered profitability analysis that was previously only available to large corporations. Help small and medium businesses make informed location decisions based on real data and advanced analytics.

## Key Features

### Interactive Jakarta Map
- High-resolution map interface powered by Leaflet
- Click-to-select location functionality
- Real-time location search and navigation
- Optimized for Jakarta metropolitan area

### AI-Powered Area Analysis
- **Gemini 2.0 Flash Integration**: Advanced computer vision analysis
- **Area Distribution Detection**: Automatically identifies residential, road, and open space percentages
- **Real-time Screenshot Analysis**: Captures and analyzes current map view
- **Color-based Classification**: Distinguishes between different area types using advanced image recognition

### Comprehensive Business Metrics
- **Population Density Calculations**: Based on Jakarta's 16,000 people/km² density
- **Traffic Pattern Analysis**: Road density and pedestrian flow estimation
- **Customer Projection**: Daily, monthly, and yearly customer estimates
- **Revenue Forecasting**: Detailed revenue projections with 30-day cycles
- **Profitability Scoring**: 1-10 scale profitability assessment

### 7-Step Analysis Workflow
1. **Location Selection**: Choose your business location
2. **Auto-Zoom**: Automatic map optimization for analysis
3. **AI Screenshot Analysis**: Computer vision area distribution
4. **Area Calculation**: Real-world area measurements
5. **Population Analysis**: Demographic calculations
6. **Business Metrics**: Customer and traffic projections
7. **Revenue Projection**: Complete financial analysis

### Professional Dashboard
- **Dark Theme Interface**: Modern, professional design
- **Real-time Progress Tracking**: Step-by-step analysis visualization
- **Interactive Results**: Detailed metrics and projections
- **Export Capabilities**: Save and share analysis results

## Technologies

### Backend Infrastructure
- **Internet Computer (ICP)**: Decentralized hosting and authentication
- **Motoko**: Smart contract backend logic
- **Internet Identity**: Secure, privacy-focused authentication

### Frontend Stack
- **React 18**: Modern component-based UI
- **Vite**: Fast development and build tooling
- **Tailwind CSS**: Utility-first styling framework
- **Leaflet**: Interactive mapping library
- **Lucide React**: Professional icon system

### AI & Analysis
- **Google Gemini 2.0 Flash**: Advanced multimodal AI analysis
- **Computer Vision**: Image-based area classification
- **Geospatial Analysis**: Real-world coordinate and area calculations
- **Statistical Modeling**: Population and traffic pattern analysis

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [DFX](https://internetcomputer.org/docs/current/developer-tools/dfx/install/) (DFINITY Canister SDK)
- [Mops](https://docs.mops.one/quick-start#2-install-mops-cli) (Motoko Package Manager): `npm i -g ic-mops`
- **Gemini API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Environment Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/Be-Finder.git
cd Be-Finder
```

2. **Configure environment variables:**

Create a `.env` file in the `frontend` directory:

```bash
# frontend/.env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Install dependencies:**

```bash
npm install
```

### Local Development

1. **Start the Internet Computer replica:**

```bash
dfx start --background --clean
```

2. **Deploy canisters:**

```bash
dfx deploy
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Access the application:**

Open your browser and navigate to `http://localhost:5173`

### Quick Start Guide

1. **Login**: Use Internet Identity to authenticate
2. **Navigate to Analysis**: Go to `/app` route
3. **Select Location**: Click anywhere on the Jakarta map
4. **Set Parameters**:
   - Building Width (meters): e.g., `10`
   - Operating Hours: e.g., `12`
   - Product Price (IDR): e.g., `50000`
5. **Run Analysis**: Click "Analisis" button
6. **View Results**: See comprehensive profitability analysis

## Deployment to Internet Computer

### 1. Create a developer identity

```bash
dfx identity new my-identity
dfx identity use my-identity
```

### 2. Acquire cycles

You need cycles to deploy to mainnet. Convert ICP tokens to cycles:

```bash
dfx ledger create-canister <principal-id> --amount <icp-amount>
dfx canister deposit-cycles <cycles-amount> <canister-id>
```

### 3. Deploy to mainnet

```bash
dfx deploy --network ic
```

## Project Structure

```
Be-Finder/
├── backend/                    # Motoko smart contracts
│   ├── main.mo                # Main canister logic
│   └── mops.toml              # Package dependencies
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── BusinessAnalysisApp.jsx      # Main app component
│   │   │   ├── BusinessAnalysisWorkflow.jsx # Analysis workflow
│   │   │   ├── BusinessAnalysisDashboard.jsx # Results dashboard
│   │   │   └── BusinessAnalysisForm.jsx     # Parameter input form
│   │   ├── pages/             # Application pages
│   │   │   ├── App.jsx        # Main app page
│   │   │   ├── Home.jsx       # Landing page
│   │   │   └── Features.jsx   # Features showcase
│   │   ├── services/          # External integrations
│   │   │   ├── gemini.js      # AI analysis service
│   │   │   ├── mapScreenshot.js # Map capture utility
│   │   │   └── Map.js         # Map utilities
│   │   └── main.jsx           # Application entry point
├── dfx.json                   # DFX configuration
└── package.json              # Dependencies and scripts
```

## How to Use Be-Finder

### Authentication
Be-Finder uses **Internet Identity** for secure, privacy-focused authentication. No passwords or personal data required - just click "Login" to authenticate with your Internet Identity anchor.

### Location Analysis Workflow

#### Step 1: Location Selection
- **Interactive Map**: Navigate the Jakarta metropolitan area
- **Search Function**: Use the search bar to find specific areas
- **Click Selection**: Simply click anywhere on the map to select your business location
- **Real-time Feedback**: See immediate location confirmation

#### Step 2: Business Parameters
Configure your business specifics:
- **Building Width**: Enter your storefront width in meters (e.g., 10m)
- **Operating Hours**: Daily operating hours (e.g., 12 hours)
- **Product Price**: Average product price in Indonesian Rupiah (e.g., 50,000 IDR)

#### Step 3: AI Analysis Process
Watch the 7-step analysis unfold:
1. **Location Validation**
2. **Auto-Zoom Optimization**
3. **AI Screenshot Analysis**
4. **Area Calculation**
5. **Population Analysis**
6. **Business Metrics**
7. **Revenue Projection**

#### Step 4: Results Interpretation
- **Daily Customers**: Projected daily foot traffic and customers
- **Daily Revenue**: Expected daily income based on your parameters
- **Monthly Revenue**: 30-day revenue projection
- **Profitability Score**: 1-10 scale assessment with quality indicators
- **Area Distribution**: Breakdown of residential, road, and open space percentages

### Business Insights

#### Understanding the Analysis
- **Population Density**: Based on Jakarta's official 16,000 people/km² density
- **Traffic Patterns**: Road density and pedestrian flow calculations
- **Visitor Rate**: 0.1% of area population as potential daily visitors
- **Purchase Conversion**: 90% conversion rate for visitors to customers
- **Area Scaling**: Real-world area calculations with 30.5% accuracy adjustment

#### Profitability Scoring
- **8-10**: Excellent location with high profit potential
- **6-7**: Good location with solid business prospects
- **4-5**: Fair location requiring careful consideration
- **1-3**: Poor location with significant challenges

### Best Practices

#### Optimal Location Selection
- Choose areas with balanced residential and commercial activity
- Look for locations near transportation hubs
- Consider areas with moderate to high road density
- Avoid locations with excessive open space (low foot traffic)

#### Parameter Optimization
- **Building Width**: Larger storefronts generally attract more customers
- **Operating Hours**: Longer hours increase daily customer potential
- **Product Price**: Balance affordability with profit margins

## API Integration

### Gemini AI Configuration
```javascript
// frontend/src/services/gemini.js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
```

### Analysis Algorithm
The platform implements a sophisticated 12-step business analysis algorithm:

1. **Location Pinpoint**: GPS coordinate capture
2. **Screenshot Capture**: High-resolution map image
3. **AI Color Analysis**: Residential (brown), Road (white/yellow), Open Space (green/blue/gray)
4. **Area Calculation**: Real-world measurements using scale bar
5. **Population Density**: Jakarta standard 16,000 people/km²
6. **Road Density**: Traffic and accessibility calculations
7. **Building Width Input**: User-specified storefront dimensions
8. **Operating Hours**: Daily business operation time
9. **Visitor Rate**: 0.1% of area population as daily visitors
10. **Purchase Conversion**: 90% visitor-to-customer conversion
11. **Revenue Calculation**: Daily income projections
12. **30-Day Projection**: Monthly and yearly revenue forecasts

## Mathematical Formulas

<img width="1200" height="105" alt="image" src="https://github.com/user-attachments/assets/9cb1be1e-9eb1-4466-9a93-2913056dfcd9" />

<img width="1824" height="1028" alt="image" src="https://github.com/user-attachments/assets/e935e55b-6b8e-43f4-bcdc-4f3dae26023b" />



## Security & Privacy

### Data Protection
- **No Personal Data Storage**: Only business parameters and analysis results
- **Internet Identity**: Privacy-focused authentication without personal information
- **Local Processing**: AI analysis happens client-side with external API calls
- **Secure Communication**: All API calls use HTTPS encryption

### Best Practices
This application follows [Internet Computer security best practices](https://internetcomputer.org/docs/building-apps/security/overview):
- Secure canister development patterns
- Input validation and sanitization
- Rate limiting for API calls
- Error handling and logging

## Contributing

We welcome contributions to improve Be-Finder! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Areas for Contribution
- **UI/UX Improvements**: Enhanced user interface and experience
- **Additional Cities**: Expand beyond Jakarta to other Indonesian cities
- **Advanced Analytics**: More sophisticated business metrics
- **Mobile Optimization**: Responsive design improvements
- **Performance**: Optimization and caching strategies

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

### Technology Partners
- **[Internet Computer](https://internetcomputer.org/)** - Decentralized hosting platform
- **[DFINITY Foundation](https://dfinity.org/)** - Blockchain infrastructure
- **[Google AI](https://ai.google/)** - Gemini AI analysis capabilities
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Open-source mapping data
- **[Leaflet](https://leafletjs.com/)** - Interactive mapping library

### Inspiration
Built with the vision of democratizing business intelligence and helping entrepreneurs make data-driven location decisions in Indonesia's growing economy.

---

**Made with care for Indonesian entrepreneurs and small businesses**

*Empowering smart business decisions through AI-powered location intelligence*
