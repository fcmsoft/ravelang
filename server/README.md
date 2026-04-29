# Raverlang API Server

Backend proxy for the Ravelry API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Ravelry API credentials to `.env`

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Patterns
- `GET /api/patterns` - List patterns
- `GET /api/patterns/search?q=keyword` - Search patterns
- `GET /api/patterns/:id` - Get pattern details

### Yarns
- `GET /api/yarns` - List yarns
- `GET /api/yarns/search?q=keyword` - Search yarns
- `GET /api/yarns/:id` - Get yarn details

### Authentication
- `POST /api/auth/login` - User login
