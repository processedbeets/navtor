# Navtor - Vessel Management System

A modern Angular application for managing vessel data and emissions tracking, built with Nx workspace and powered by PrimeNG components.

## 🚢 Features

### Vessel Management
- **Vessel List**: Display vessel information in a data grid with sorting and filtering
- **Vessel Details**: View comprehensive vessel data including MMSI, IMO, company information, and vessel type
- **Real-time Data**: Fetch vessel data from external API endpoints

### Emissions Tracking
- **Interactive Charts**: Visualize vessel emissions data using Highcharts
- **Multiple Emission Types**: Track NOx, Methane, PM, and SOx emissions
- **Vessel Selection**: Dropdown to switch between different vessels
- **Time Series Data**: Historical emissions data with interactive line charts

### Technical Features
- **Modern Angular**: Built with Angular 20+ using standalone components and signals
- **State Management**: NgRx for predictable state management
- **Responsive Design**: Mobile-friendly UI with PrimeNG components
- **Type Safety**: Full TypeScript implementation with strict typing
- **Testing**: Comprehensive test coverage with Vitest and Playwright

## 🏗️ Architecture

The application follows a domain-driven design approach with clear separation of concerns:

```
src/app/
├── domains/
│   ├── vessels/           # Vessel management domain
│   │   ├── models/        # Vessel data models
│   │   ├── services/      # API services
│   │   ├── store/         # NgRx state management
│   │   ├── facades/       # Business logic facades
│   │   └── pages/         # Vessel components
│   └── emissions/         # Emissions tracking domain
│       ├── models/        # Emissions data models
│       ├── services/      # API services
│       ├── store/         # NgRx state management
│       ├── facades/       # Business logic facades
│       └── pages/         # Emissions components
├── components/
│   └── navigation/        # Shared navigation component
└── app.config.ts         # Application configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npx nx serve navtor
```

The application will be available at `http://localhost:4200`

### Available Scripts

```bash
# Development
npx nx serve navtor          # Start dev server
npx nx build navtor          # Build for production

# Testing
npx nx test navtor           # Run unit tests
npx nx e2e navtor-e2e        # Run E2E tests

# Code Quality
npx nx lint navtor           # Run linting
npx nx format                 # Format code
```

## 🧪 Testing

The project includes comprehensive testing at multiple levels:

### Unit Tests (Vitest)
- **60 tests** covering all domains
- Component testing with Angular Testing Utilities
- Service testing with HTTP mocking
- Store/Reducer testing with state validation
- Facade testing with business logic coverage

### End-to-End Tests (Playwright)
- Navigation testing
- User interaction testing
- Chart rendering validation
- API integration testing

### Test Coverage
- Components: 8 tests (vessels) + 11 tests (emissions)
- Services: 4 tests (vessels) + 6 tests (emissions)
- Facades: 5 tests (vessels) + 13 tests (emissions)
- Store: 4 tests (vessels) + 5 tests (emissions)
- App-level: 4 tests

## 🛠️ Technology Stack

- **Frontend**: Angular 20+ with standalone components
- **UI Library**: PrimeNG with PrimeIcons
- **Charts**: Highcharts for data visualization
- **State Management**: NgRx with effects and facades
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Build Tool**: Nx workspace with Vite
- **Styling**: CSS with PrimeNG theming

## 📊 Data Sources

- **Vessels API**: `https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json`
- **Emissions API**: `https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json`

## 🎨 UI Components

- **Navigation**: Responsive menubar with PrimeNG
- **Data Grid**: AG Grid for vessel data display
- **Charts**: Highcharts line charts for emissions visualization
- **Forms**: PrimeNG dropdowns and form controls
- **Theming**: Custom CSS with PrimeNG styling

## 🔧 Development

### Code Organization
- Domain-driven architecture with clear boundaries
- Shared components in `/components`
- Domain-specific code in `/domains`
- Centralized state management with NgRx
- Service layer for API communication

### Best Practices
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent naming conventions
- Comprehensive error handling
- Responsive design principles

## 📝 License

This project is part of a technical assessment and is for demonstration purposes.

## 🤝 Contributing

This is a technical assessment project. For questions or feedback, please refer to the project requirements.

---

Built with ❤️ using Angular, Nx, and modern web technologies.