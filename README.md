# Customer Support Ticketing System

A full-stack application for managing customer support tickets with real-time chat capabilities.

## Tech Stack

- **Backend:** Laravel 12, PHP 8.2+, SQLite (default) or MySQL, Laravel Sanctum (API Authentication)
- **Frontend:** React 18+, React Router 6+, Axios, Vite
- **Authentication:** Token-based (Laravel Sanctum)
- **Database:** SQLite (default) or MySQL
- **State Management:** React Context API
- **Real-time Updates:** Polling-based (3-second interval)

## Project Structure

```
WEBNS Task/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/    # API Controllers (Auth, Tickets, Comments, Messages)
│   │   └── Models/                   # Eloquent Models (User, Ticket, Comment, Message)
│   ├── database/
│   │   ├── migrations/               # Database migrations
│   │   └── database.sqlite          # SQLite database (default)
│   ├── routes/
│   │   └── api.php                  # API routes
│   └── config/
│       └── cors.php                 # CORS configuration
├── frontend/                         # React Application
│   ├── src/
│   │   ├── api/                     # API client functions
│   │   ├── components/              # React components (CreateTicket, EditTicket, Chat)
│   │   ├── context/                 # React Context (Auth, PrivateRoute)
│   │   ├── pages/                   # Page components (Login, Register, Dashboard, Tickets, TicketDetail)
│   │   └── shared/                  # Shared utilities and styles
│   ├── public/
│   └── vite.config.js              # Vite configuration
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

For MySQL:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

For SQLite (default):
```env
DB_CONNECTION=sqlite
```

Note: SQLite is configured by default for easy setup. Simply run migrations.

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

## Testing Ticket Features

### Creating a Ticket

1. Navigate to "Tickets" in the application
2. Click "Create Ticket"
3. Fill in the form:
   - Subject: Brief summary of the issue
   - Description: Detailed explanation
   - Category: e.g., "Technical", "Billing", "General"
   - Priority: Select from low, medium, high, or urgent
4. Click "Create Ticket"

### Viewing Ticket Details

1. Click on any ticket card in the tickets list
2. View complete ticket information including:
   - Subject, description, category, priority, and status
   - Ticket creator information
   - All comments on the ticket
   - Chat messages for the ticket

### Adding Comments

1. Open a ticket detail page
2. Scroll to the "Comments" section
3. Type your comment in the text area
4. Click "Post Comment"

### Using Chat

1. Open a ticket detail page
2. Scroll to the "Chat Messages" section
3. Type your message in the input field
4. Click "Send"
5. Messages auto-refresh every 3 seconds

### Editing Tickets (Admin Only for Status)

1. Open a ticket detail page
2. Click "Edit Ticket" to modify subject, description, category, or priority
3. Admins can also change the status using the dropdown at the top
4. Customers can only edit tickets they created

### Deleting Tickets

1. Open the tickets page or ticket detail
2. Click the "Delete" button
3. Confirm the deletion
4. Only ticket owners or admins can delete tickets

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/user` - Get current user (requires auth)

### Tickets (requires auth)
- `GET /api/tickets` - Get all tickets (customers see only their tickets, admins see all)
- `GET /api/tickets/{id}` - Get a specific ticket
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/{id}` - Update a ticket
- `DELETE /api/tickets/{id}` - Delete a ticket

### Comments (requires auth)
- `POST /api/comments` - Create a comment on a ticket
- `PUT /api/comments/{id}` - Update a comment (own comments only)
- `DELETE /api/comments/{id}` - Delete a comment (own comments only)

### Messages (requires auth)
- `GET /api/tickets/{ticketId}/messages` - Get all messages for a ticket
- `POST /api/tickets/{ticketId}/messages` - Send a message in a ticket chat

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

**Create Ticket:**
```json
POST /api/tickets
Headers: { "Authorization": "Bearer {token}" }
{
  "subject": "Unable to login",
  "description": "I'm having trouble logging into my account",
  "category": "Technical",
  "priority": "high"
}
```

**Create Comment:**
```json
POST /api/comments
Headers: { "Authorization": "Bearer {token}" }
{
  "ticket_id": 1,
  "comment": "We're looking into this issue"
}
```

**Send Message:**
```json
POST /api/tickets/1/messages
Headers: { "Authorization": "Bearer {token}" }
{
  "message": "Can you provide more details?"
}
```

## Current Features

### Authentication & Authorization
- ✅ User Registration with role selection (Customer/Admin)
- ✅ User Login with email and password
- ✅ Protected Routes (Authentication required)
- ✅ Token-based Authentication (Laravel Sanctum)
- ✅ Role-based Access Control (Customer & Admin roles)

### Ticket Management
- ✅ Create, Read, Update, and Delete tickets
- ✅ Ticket Categories and Priorities (low, medium, high, urgent)
- ✅ Ticket Status Management (open, in_progress, resolved, closed)
- ✅ Admin-only status update overrides
- ✅ Customers can only view and manage their own tickets
- ✅ Admins can view and manage all tickets

### Comments System
- ✅ Add comments to tickets
- ✅ Update and delete own comments
- ✅ View all comments with author and timestamp

### Chat System
- ✅ Real-time chat for ticket conversations (polling-based)
- ✅ Send and receive messages within tickets
- ✅ Auto-refresh every 3 seconds
- ✅ Differentiated display for own messages vs. others
- ✅ Message history with timestamps

### User Interface
- ✅ Modern, responsive design
- ✅ Ticket cards with priority and status badges
- ✅ Ticket detail page with full information
- ✅ Modal-based ticket creation and editing
- ✅ Navigation between dashboard, tickets, and ticket details

## Next Steps (Coming Soon)

- [ ] True WebSocket/Pusher real-time chat (replace polling)
- [ ] File Attachments (upload and download)
- [ ] Email Notifications
- [ ] Ticket search and filtering
- [ ] Ticket assignment to specific admins
- [ ] Dashboard statistics and analytics

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

## Role-Based Permissions

### Customer Role
- Can create tickets
- Can view and manage only their own tickets
- Can add comments to their tickets
- Can send chat messages in their tickets
- Cannot change ticket status
- Can edit or delete only their own tickets

### Admin Role
- Can view and manage all tickets (regardless of creator)
- Can change ticket status (open, in_progress, resolved, closed)
- Can add comments to any ticket
- Can send chat messages in any ticket
- Can edit or delete any ticket
- Has full access to the ticket system

## Troubleshooting

### CORS Issues
- Make sure the frontend URL is added to the allowed origins in `config/cors.php`
- Verify that both backend (port 8000) and frontend (port 5173) are running

### Database Connection Error
- Verify your `.env` file has correct database credentials
- Make sure MySQL is running (if using MySQL)
- For SQLite, ensure `database/database.sqlite` file exists
- Run `php artisan migrate` again

### Authentication Not Working
- Check browser console for errors
- Verify the backend is running on port 8000
- Check that the token is being stored in localStorage
- Clear browser cache and localStorage, then try logging in again

### Polling Rate
- Chat messages refresh every 3 seconds (polling-based)
- For true real-time updates, consider implementing WebSocket/Pusher

## Technical Notes

### Database Schema

The application uses the following main tables:

- **users**: User accounts with role-based access (customer/admin)
- **tickets**: Support tickets with status, priority, and category
- **comments**: Comments on tickets
- **messages**: Chat messages for tickets

### Security

- All API endpoints except `/api/register` and `/api/login` require authentication
- Tokens are stored in browser localStorage
- Role-based access control ensures users can only access authorized resources
- SQL injection protection via Eloquent ORM
- CORS configured for cross-origin requests

### API Response Format

All successful API responses follow the standard Laravel JSON format:
```json
{
  "data": {...},
  "message": "Success message"
}
```

Error responses:
```json
{
  "message": "Error message",
  "errors": {...}
}
```

### Environment Variables

Key environment variables in `backend/.env`:

```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite  # or mysql
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

## License

MIT
