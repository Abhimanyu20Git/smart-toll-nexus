# SmartToll Connect

Highway toll management system with role based dashboards for users, admins, and operators. Built with HTML, CSS, and JavaScript, powered by real APIs for maps, charts, weather, and QR codes.

## Features

- Landing page with hero, feature cards, API showcase, and nav bar
- Role based authentication (User, Admin, Operator)
- Login and registration with simulated OTP verification
- User dashboard with wallet balance and transaction history
- Wallet recharge with preset amount options
- Admin dashboard with revenue stats and toll booth management
- Add, edit, and delete toll booths with confirmation
- Operator dashboard with current assignment info
- Live vehicle monitoring with real time status simulation
- Dark mode with saved preference across all pages
- localStorage persistence for wallet, transactions, and booths
- Smooth scrolling navigation on landing page
- Form validation with visual feedback
- Keyboard shortcut (Escape to close modals)
- Fully responsive layout
- Toast notifications
- Accessibility focus outlines

### API Integrations

- **Interactive Map** - Leaflet.js with OpenStreetMap tiles showing toll booth locations on the admin dashboard
- **Revenue and Traffic Charts** - Chart.js line, bar, and doughnut charts for analytics on admin and operator pages
- **QR Toll Pass** - Digital toll pass with scannable QR code generated via QR Server API on the user dashboard
- **Live Weather** - Open-Meteo API for current conditions, 3 day forecast, and traffic alerts on the operator dashboard
- **Nearest Booth Finder** - Browser Geolocation API with haversine distance to locate the closest toll booth
- **Browser Notifications** - Toll charge and low balance alerts using the Notifications API
- **Share Pass and Receipts** - Web Share API for sharing QR passes and transaction receipts
- **CSV Export** - Download transaction history as a CSV file
- **Transaction Search and Filter** - Filter transactions by type and search by description

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript
- localStorage for data persistence
- Leaflet.js v1.9.4 (OpenStreetMap)
- Chart.js v4.4.0
- QR Server API
- Open-Meteo Weather API
- Browser Geolocation, Notifications, and Web Share APIs

## Pages

| Page | Description |
|------|-------------|
| index.html | Landing page with hero, features, API showcase, and CTA |
| auth.html | Login and registration with OTP flow |
| user-dashboard.html | Wallet, QR toll pass, nearest booth, transactions with filter and CSV export |
| admin-dashboard.html | Stats, toll booth CRUD, interactive map, revenue and vehicle charts |
| operator-dashboard.html | Assignment, live weather, traffic alerts, hourly traffic chart, vehicle feed |

## Getting Started

Open `index.html` in a browser. No build tools or API keys needed. All external APIs are free and keyless.
