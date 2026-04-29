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

The API will be available at `http://localhost:3000`

## API Endpoints

### Patterns
- `GET /patterns` - List patterns
- `GET /patterns/search?q=keyword` - Search patterns
- `GET /patterns/:id` - Get pattern details

### Yarns
- `GET /yarns` - List yarns
- `GET /yarns/search?q=keyword` - Search yarns
- `GET /yarns/:id` - Get yarn details

### Authentication
- `POST /auth/login` - User login
