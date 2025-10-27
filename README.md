# Customer Support Ticketing System

A full-stack application for managing customer support tickets with real-time chat capabilities.

## Tech Stack

- **Backend:** Laravel 12, MySQL, Laravel Sanctum (API Authentication)
- **Frontend:** React, React Router, Axios
- **Authentication:** Token-based (Laravel Sanctum)

## Project Structure

```
WEBNS Task/
├── backend/          # Laravel API
├── frontend/         # React Application
└── README.md
```

## Setup Instructions

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 16+ and npm
- MySQL database

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Update `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run migrations:
```bash
php artisan migrate
```

6. Start the server:
```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at: `http://localhost:5173` (or the port shown)

## Testing Authentication

### 1. Register a New User

1. Open the application in your browser
2. Click "Register"
3. Fill in the form:
   - Name: Your name
   - Email: your@email.com
   - Password: (minimum 8 characters)
   - Confirm Password: (same as password)
   - Role: Select Customer or Admin
4. Click "Register"

### 2. Login

1. Use the credentials you just created
2. Click "Login"
3. You should be redirected to the dashboard

### 3. View Dashboard

- The dashboard shows your user information
- You can see your name, email, and role
- Click "Logout" to sign out

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/user` - Get current user (requires auth)

### Request/Response Examples

**Register:**
```json
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer"
}
```

**Login:**
```json
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

## Current Features

✅ User Registration with role selection (Customer/Admin)
✅ User Login with email and password
✅ Protected Routes (Authentication required)
✅ User Profile Display
✅ Token-based Authentication
✅ Role-based Access Control (Customer & Admin roles)

## Next Steps (Coming Soon)

- [ ] Ticket Management (Create, Read, Update, Delete)
- [ ] Comments System
- [ ] Real-time Chat (WebSocket/Pusher)
- [ ] File Attachments
- [ ] Ticket Status Management
- [ ] Email Notifications

## Development

### Backend Development
```bash
cd backend
php artisan serve
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Troubleshooting

### CORS Issues
Make sure the frontend URL is added to the allowed origins in `config/cors.php`.

### Database Connection Error
- Verify your `.env` file has correct database credentials
- Make sure MySQL is running
- Run `php artisan migrate` again

### Authentication Not Working
- Check browser console for errors
- Verify the backend is running on port 8000
- Check that the token is being stored in localStorage

## License

MIT
