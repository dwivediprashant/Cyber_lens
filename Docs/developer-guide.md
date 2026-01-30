# Developer Guide

This guide provides developers with everything needed to set up, develop, and contribute to the Cyber Lens threat intelligence platform.

---

## Tech Stack Overview

Cyber Lens is built with modern, performance-focused technologies to deliver a responsive and scalable threat intelligence platform.

### Frontend Stack

- **React 18** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better developer experience and code quality
- **Vite** - Fast build tool and development server with HMR
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Chart.js/Recharts** - Data visualization libraries for analytics dashboards
- **Bun** - Modern JavaScript runtime and package manager

### Backend Stack

- **Bun Runtime** - High-performance JavaScript runtime for server-side execution
- **TypeScript** - End-to-end type safety across the full stack
- **Express.js** - Fast, minimalist web framework for REST APIs
- **PostgreSQL** - Robust relational database for persistent data storage
- **External APIs** - Integration with multiple threat intelligence providers

### Development Tools

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting for consistent style
- **Git** - Version control with GitHub for collaboration
- **GitHub Issues** - Issue tracking and contribution management

---

## Project Structure

Understanding the project layout is essential for effective development and contribution.

```
Cyber-Lens/
├── client/                          # Frontend React application
│   └── cyber_lens/
│       ├── public/                  # Static assets
│       ├── src/
│       │   ├── pages/              # Main application pages
│       │   │   ├── Home.tsx        # IOC lookup interface
│       │   │   ├── History.tsx     # Analysis history
│       │   │   └── News.tsx        # Security news feed
│       │   ├── components/         # Reusable UI components
│       │   ├── services/           # API integration logic
│       │   ├── types/              # TypeScript type definitions
│       │   ├── utils/              # Utility functions
│       │   ├── App.tsx             # Main application component
│       │   └── main.tsx            # Application entry point
│       ├── index.html              # HTML template
│       ├── vite.config.ts          # Vite configuration
│       ├── eslint.config.js        # ESLint configuration
│       ├── tsconfig.json           # TypeScript configuration
│       ├── package.json            # Frontend dependencies
│       └── bun.lock                # Lock file for Bun
├── server/                         # Backend Express application
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   │   └── db.ts              # Database connection setup
│   │   ├── models/                 # Database models and schemas
│   │   ├── providers/              # Threat intelligence integrations
│   │   ├── services/               # Business logic and data processing
│   │   ├── routes/                 # API route definitions
│   │   ├── middleware/             # Express middleware
│   │   ├── types/                  # TypeScript type definitions
│   │   └── index.ts                # Server entry point
│   ├── .env.example                # Environment variables template
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json                # Backend dependencies
│   └── bun.lock                    # Lock file for Bun
├── docs/                           # Documentation
│   ├── usage-guide.md              # User documentation
│   ├── developer-guide.md          # This developer guide
│   └── Scoring-model.md            # Threat scoring algorithm
├── contributors/                    # Contributor recognition
├── LICENSE                         # Project license
├── .gitignore                      # Git ignore rules
├── package.json                    # Root package.json (workspace config)
└── README.md                       # Project overview and entry point
```

### Key Directories Explained

- **`client/cyber_lens/src/pages/`** - Main application views, each representing a core feature
- **`client/cyber_lens/src/components/`** - Reusable UI building blocks
- **`server/src/providers/`** - External threat intelligence API integrations
- **`server/src/services/`** - Core business logic for IOC analysis and scoring
- **`docs/`** - All project documentation (user and developer-facing)

---

## Environment Setup

Follow these steps to get your development environment ready for Cyber Lens development.

### Prerequisites

Ensure you have the following installed:

- **Bun** (v1.0.0+) - Modern JavaScript runtime and package manager
- **Node.js** (v18.0.0+) - Alternative runtime option
- **PostgreSQL** (v14.0+) - Database server
- **Git** - Version control
- **VS Code** (recommended) - Code editor with extensions

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/cyber-lens.git
   cd cyber-lens
   ```

2. **Install Bun** (if not already installed)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Install dependencies**
   ```bash
   bun install
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb cyber_lens
   
   # Run migrations (if available)
   cd server
   bun run db:migrate
   ```

5. **Configure environment variables**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit with your configuration
   nano server/.env
   ```

### Environment Variables

Configure these essential variables in `server/.env`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cyber_lens

# API Keys (sign up for free accounts)
VIRUSTOTAL_API_KEY=your_virustotal_api_key
OTX_API_KEY=your_otx_api_key
ABUSEIPDB_API_KEY=your_abuseipdb_api_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### API Key Setup

You'll need API keys from threat intelligence providers:

1. **VirusTotal** - Sign up at [virustotal.com](https://virustotal.com)
2. **OTX (AlienVault)** - Register at [otx.alienvault.com](https://otx.alienvault.com)
3. **AbuseIPDB** - Create account at [abuseipdb.com](https://abuseipdb.com)

Most providers offer free tiers suitable for development and testing.

---

## Running the Application

Start both frontend and backend services for local development.

### Backend Development

```bash
cd server
bun run dev
```

The backend will start on `http://localhost:3001` with hot reload enabled.

### Frontend Development

```bash
cd client/cyber_lens
bun run dev
```

The frontend will start on `http://localhost:5173` with Vite's fast HMR.

### Development Workflow

1. **Start backend** - Run the Express server first
2. **Start frontend** - Run the React development server
3. **Access application** - Open `http://localhost:5173` in your browser
4. **Make changes** - Both frontend and backend support hot reload
5. **Test integration** - Verify frontend-backend communication works

### Common Development Commands

```bash
# Backend
cd server
bun run dev          # Start development server
bun run build        # Build for production
bun run test         # Run tests
bun run lint         # Run linter

# Frontend
cd client/cyber_lens
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run linter
```

---

## Contribution Workflow

We welcome contributions! Follow this workflow to contribute effectively to Cyber Lens.

### 1. Find an Issue

- Browse the **Issues** tab on GitHub
- Look for issues labeled with your skill level (beginner, intermediate, advanced)
- Check if someone is already assigned to the issue
- Comment on the issue to express interest

### 2. Set Up Your Development Environment

Follow the environment setup steps above if you haven't already.

### 3. Create a Branch

```bash
# Create and checkout a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

### 4. Implement Your Solution

- **Follow existing code patterns** - Maintain consistency with the current codebase
- **Write clean, readable code** - Use TypeScript for type safety
- **Add tests** - Include unit tests for new functionality
- **Update documentation** - Document any new features or APIs

### 5. Test Your Changes

```bash
# Run linting
bun run lint

# Run tests
bun run test

# Test manually
# - Start both frontend and backend
# - Test your changes thoroughly
# - Verify existing functionality still works
```

### 6. Commit Your Changes

Follow our commit message convention:

```bash
# Feature commits
git commit -m "feat: add virus total provider integration"

# Bug fix commits
git commit -m "fix: resolve IOC parsing issue for IPv6 addresses"

# Documentation commits
git commit -m "docs: update API documentation for new endpoints"
```

### 7. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# - Provide clear description of changes
# - Link to related issues
# - Request review from maintainers
```





## Additional Resources

- **User Guide** - [Learn about application features](usage-guide.md)
- **Scoring Model** - [Understand threat scoring algorithm](Scoring-model.md)
- **API Documentation** - Detailed API endpoint documentation
- **GitHub Issues** - Report bugs and request features
- **Community Forum** - Connect with other developers

---

## Getting Help

If you need assistance during development:

1. **Check existing issues** - Your question may already be answered
2. **Create a new issue** - Provide detailed information about your problem
3. **Join discussions** - Participate in GitHub discussions
4. **Review documentation** - Check all available documentation first

*Happy coding! We appreciate your contributions to making Cyber Lens better.*
