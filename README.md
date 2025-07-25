# Be-Finder

Be-Finder is a location intelligence platform built on the Internet Computer (ICP) that helps users find strategic locations for businesses. It combines interactive mapping, AI-powered location analysis, and data visualization to provide insights for business location decisions.

## Features

- **Interactive Maps**: Explore locations with an interactive map interface powered by Leaflet
- **AI Assistant**: Chat with an AI assistant specialized in location analysis and business insights
- **Analytics Dashboard**: Visualize location data and metrics
- **Reports**: Generate and view detailed location reports
- **Data Management**: Upload and manage location data files
- **Secure Authentication**: Login with Internet Identity (II)

## Technology Stack

- **Backend**: Motoko on the Internet Computer
- **Frontend**: React, Vite, Tailwind CSS
- **Map Services**: Leaflet with OpenStreetMap
- **AI Integration**: OpenRouter API
- **Authentication**: Internet Identity

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
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

4. Deploy the canisters to the local replica:

```bash
dfx deploy
```

5. Start the frontend development server:

```bash
npm run dev
```

6. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Deployment to the Internet Computer

### 1. Create a developer identity

```bash
dfx identity new my-identity
dfx identity use my-identity
```

### 2. Obtain cycles

You'll need cycles to deploy to the mainnet. You can convert ICP tokens to cycles:

```bash
dfx ledger create-canister <principal-id> --amount <icp-amount>
dfx canister deposit-cycles <amount-of-cycles> <canister-id>
```

### 3. Deploy to the mainnet

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

- Chat with the AI assistant to get location recommendations
- Ask questions about area demographics, foot traffic, or business potential
- Request analysis of specific locations

### Data Management

- Upload location data files for analysis
- View and manage your uploaded files
- Download or delete files as needed

## Security Considerations

If you base your application on this example, it is recommended that you familiarize yourself with and adhere to the [security best practices](https://internetcomputer.org/docs/building-apps/security/overview) for developing on ICP. This example may not implement all the best practices.

## License

[MIT License](LICENSE)

## Acknowledgements

- [Internet Computer](https://internetcomputer.org/)
- [DFINITY Foundation](https://dfinity.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Leaflet](https://leafletjs.com/)
