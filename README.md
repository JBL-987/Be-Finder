# Be-Finder

Be-Finder is a location intelligence platform built on the Internet Computer (ICP) that helps users find strategic locations for businesses. The platform combines interactive mapping, AI-powered location analysis, and data visualization to provide insights for business location decision-making.

## Features

- **Interactive Map**: Explore locations with an interactive map interface powered by Leaflet
- **AI Assistant**: Communicate with an AI assistant specialized in location analysis and business insights
- **Analytics Dashboard**: Visualize location data and metrics
- **Reports**: Create and view detailed location reports
- **Data Management**: Upload and manage location data files
- **Secure Authentication**: Login with Internet Identity (II)

## Technologies

- **Backend**: Motoko on Internet Computer
- **Frontend**: React, Vite, Tailwind CSS
- **Map Services**: Leaflet with OpenStreetMap
- **AI Integration**: OpenRouter API
- **Authentication**: Internet Identity

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [DFX](https://internetcomputer.org/docs/current/developer-tools/dfx/install/) (DFINITY Canister SDK)
- [Mops](https://docs.mops.one/quick-start#2-install-mops-cli) (Motoko Package Manager): `npm i -g ic-mops`

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/your-username/Be-Finder.git
cd Be-Finder
```

2. Install dependencies:

```bash
npm install
```

3. Start the local Internet Computer replica:

```bash
dfx start --background --clean
```

4. Deploy canisters to the local replica:

```bash
dfx deploy
```

5. Start the frontend development server:

```bash
npm run dev
```

6. Open your browser and navigate to the URL displayed in the terminal (usually http://localhost:5173)

## Deployment to Internet Computer

### 1. Create a developer identity

```bash
dfx identity new my-identity
dfx identity use my-identity
```

### 2. Get cycles

You will need cycles to deploy to the mainnet. You can convert ICP tokens to cycles:

```bash
dfx ledger create-canister <principal-id> --amount <icp-amount>
dfx canister deposit-cycles <cycles-amount> <canister-id>
```

### 3. Deploy to mainnet

```bash
dfx deploy --network ic
```

## Project Structure

- `/backend`: Motoko canister code
- `/frontend`: React frontend application
  - `/src/components`: UI components
  - `/src/pages`: Application pages
  - `/src/services`: Service integrations (Map, OpenRouter)

## Using Be-Finder

### Authentication

Be-Finder uses Internet Identity for secure authentication. Click the "Login" button to authenticate with your Internet Identity.

### Map Navigation

- Use the map interface to explore locations
- Search for specific addresses or areas
- Add markers for potential business locations
- View location details by clicking on markers

### AI Assistant

- Communicate with the AI assistant to get location recommendations
- Ask questions about area demographics, foot traffic, or business potential
- Request analysis of specific locations

### Data Management

- Upload location data files for analysis
- View and manage your uploaded files
- Download or delete files as needed

## Security Considerations

If you are using this application as an example, it is recommended that you understand and follow [security best practices](https://internetcomputer.org/docs/building-apps/security/overview) for development on ICP. This example may not implement all best practices.

## License

[MIT License](LICENSE)

## Acknowledgements

- [Internet Computer](https://internetcomputer.org/)
- [DFINITY Foundation](https://dfinity.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet](https://leafletjs.com/)
