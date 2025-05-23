# Application Context Documentation

## Project Folder Structure Overview

The project is organized to support modular development, maintainability, and scalability. Below is the high-level folder structure with brief descriptions:

### Root Level
- `.gitignore` — Git ignore rules  
- `components.json` — Component metadata/configuration file  
- `dist/` — Compiled distributable files (bundled JS and source maps)  
- `index.html` — Main HTML entry point  
- `jsconfig.json` — JavaScript project configuration  
- `package.json` — Project dependencies and scripts  
- `postcss.config.js` — PostCSS configuration for CSS processing  
- `README.md` — Project documentation  
- `tailwind.config.js` — Tailwind CSS configuration  
- `vite.config.js` — Vite bundler configuration  
- `eslint.config.js` — ESLint configuration  
- `public/` — Static assets served as-is  

### `/src/`
Main source code of the application, organized as follows:

- `index.css` — Global CSS styles  
- `App.jsx` — Root React component  
- `main.jsx` — Application entry point and rendering logic  

- `/lib/`  
  Utility functions and helpers used across the application, e.g., `utils.js`.

- `/components/ui/`  
  Reusable UI components implementing consistent design patterns, including:  
  Accordion, Alert, Button, Calendar, Card, Checkbox, Combobox, Dialog, Dropdown, Form, Label, NavigationMenu, Popover, Select, Skeleton, Switch, Table, Tabs, Sonner, and others.

- `/features/`  
  Contains all self-contained feature modules. Each feature has its own folder with:  
  - `components/` — UI components specific to the feature  
  - `context/` — React context, provider, reducer, actions, and initial state files managing feature-specific state  
  - `helpers/` — Utility functions or constants supporting the feature  
  - `hooks/` — Custom React hooks encapsulating feature logic  
  - `services/` — API communication and service logic for the feature  
  - `index.jsx` — Feature entry point  
  - `context.md` — Feature-specific documentation

- `/global/`  
  Application-wide state and context management including:  
  - `GlobalContext.js` — React context object for global state  
  - `GlobalProvider.jsx` — Context provider wrapping the app to provide global state  
  - `globalActions.js` — Action types and creators for global state  
  - `globalReducer.js` — Reducer handling global state changes  
  - `globalInitialState.js` — Default initial global state  
  - `context.md` — Documentation for global context and state management

- `/routers/`  
  Routing configuration and route trees managing app navigation.

- `/services/`  
  Centralized API setup and service utilities, including `axiosInstance.js` for HTTP requests.

---

## Feature Module Structure (Generalized)

Each feature inside `/src/features/` adheres to the following pattern to encapsulate feature-specific logic and UI:

- **components/**  
  UI components dedicated to the feature’s user interface.

- **context/**  
  Manages feature state using React Context API and reducer pattern:  
  - `Actions.js`: Defines actions for state changes  
  - `Context.js`: Creates context and custom hooks for access  
  - `FeatureSettingsProvider.jsx`: Provider component managing feature state lifecycle  
  - `Reducer.js`: Reducer functions handling state updates  
  - `initialState.js`: Default state values for the feature

- **helpers/**  
  Helper functions or constants supporting feature functionality.

- **hooks/**  
  Custom hooks abstracting logic such as data fetching, caching, or business rules.

- **services/**  
  API clients and service calls dedicated to the feature’s backend interactions.

- **index.jsx**  
  Entry point exporting feature components or context providers.

- **context.md**  
  Documentation detailing the feature’s internal state management, components, and usage.

---

## Global State Management

- The `/src/global/` folder contains centralized global state and context providers that span across features and components.  
- Global state uses React Context with reducers to maintain a single source of truth for data shared by multiple parts of the application.  
- Global actions and reducers are defined to handle state transitions triggered by various events or API responses.  
- The global provider wraps the main application component to supply global state throughout the app.

---

## Services and API Communication

- The `/src/services/axiosInstance.js` file configures a shared Axios instance for consistent HTTP request handling including interceptors, base URLs, and headers.  
- Feature-specific API calls build on top of this instance located inside each feature’s `/services/` folder.  
- This abstraction enables centralized error handling, authentication, and API versioning.

---

## Routing

- All route definitions and navigation trees reside in the `/src/routers/` folder, enabling organized and scalable route management.  
- Routes are split logically and imported where needed for clear routing logic.

---

## Tools and Libraries Used

- **React** for building UI components and managing application state.  
- **React Context API** combined with reducers for state management.  
- **Axios** for HTTP client functionality.  
- **Tailwind CSS** for utility-first styling.  
- **Vite** as the build tool and dev server.  
- **ESLint** for code linting and style enforcement.

---

## Summary

This project follows a modular and scalable architecture with clear separation between UI components, feature logic, global state, and services. Features are self-contained, making the codebase maintainable and easy to enhance or debug. Global state and services provide shared resources, while routing and utilities are organized for clean app navigation and consistent functionality.
