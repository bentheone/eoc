# Employment Opportunity Company (EOC) - Job Matching Platform

A comprehensive job matching web application built with the MERN stack that connects job seekers with employers through a sophisticated matching system with admin oversight.

## Features

### Job Seeker Portal
- User registration and email verification
- Comprehensive profile creation with skills, experience, and education
- Document upload (CV, resume, certificates)
- AI-powered job matching based on skills and preferences
- Application tracking and status updates
- Dashboard with match analytics

### Company Portal
- Company registration and profile management
- Job posting creation with detailed requirements
- Access to admin-approved candidate matches
- Candidate profile and document viewing
- Application management and hiring workflow
- Analytics dashboard for job performance

### Admin Dashboard
- User management and verification
- Job posting moderation and approval
- Match review and approval system
- Document verification and validation
- System analytics and reporting
- Matching algorithm management

## Tech Stack

### Frontend
- **React** with Vite for fast development
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email notifications

### Security & Features
- Role-based access control (Job Seeker, Company, Admin)
- Email verification system
- Document upload and verification
- Rate limiting and input validation
- GDPR compliant data handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eoc
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eoc
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@eoc.com
```

4. Start the backend server:
```bash
npm run server
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

### Full Stack Development

To run both frontend and backend concurrently:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify/:token` - Email verification

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Profiles
- `GET /api/profiles/me` - Get current user's profile
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles` - Get all profiles (Admin only)
- `GET /api/profiles/user/:user_id` - Get profile by user ID

### Jobs
- `POST /api/jobs` - Create job (Company only)
- `GET /api/jobs` - Get all approved jobs
- `GET /api/jobs/company` - Get company's jobs
- `GET /api/jobs/admin` - Get all jobs (Admin only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Matches
- `POST /api/matches/generate` - Generate matches (Admin only)
- `GET /api/matches/jobseeker` - Get job seeker matches
- `GET /api/matches/company` - Get company matches
- `GET /api/matches/admin` - Get all matches (Admin only)
- `PUT /api/matches/:id/status` - Update match status
- `PUT /api/matches/:id/admin-approval` - Admin approval (Admin only)

### Documents
- `POST /api/documents` - Upload document (Job Seeker only)
- `GET /api/documents` - Get user's documents
- `GET /api/documents/admin` - Get all documents (Admin only)
- `PUT /api/documents/:id/status` - Update document status (Admin only)
- `DELETE /api/documents/:id` - Delete document

## Database Schema

### User Model
- name, email, password (hashed)
- role (jobseeker, company, admin)
- isVerified, isActive
- verificationToken, resetPasswordToken

### Profile Model
- user reference
- bio, location, website, phone
- jobSeeker: title, skills, experience, education, preferences
- company: name, industry, size, founded, description, socialMedia

### Job Model
- company reference
- title, description, requirements, location
- jobType, salary, skills, experience, education
- status (pending, approved, rejected, closed)
- applicationDeadline

### Match Model
- job, jobSeeker, company references
- matchScore, matchDetails (skills, experience, education, location)
- status, adminApproved, adminNotes
- companyViewed, jobSeekerViewed

### Document Model
- user reference
- name, type, fileUrl, fileKey, fileSize, fileType
- status (pending, approved, rejected)
- adminNotes, isDefault

## Matching Algorithm

The system uses a sophisticated matching algorithm that considers:

1. **Skills Match** (40% weight) - Jaccard similarity between job requirements and candidate skills
2. **Experience Match** (30% weight) - Comparison of experience levels and years
3. **Education Match** (20% weight) - Education level compatibility
4. **Location Match** (10% weight) - Geographic preference alignment

Matches with scores above 50% are created and require admin approval before being shared.

## Development Guidelines

### Code Structure
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Implement proper error handling and loading states
- Follow RESTful API design principles
- Use proper HTTP status codes and error messages

### Security Considerations
- All routes are protected with JWT authentication
- Role-based access control is enforced
- Input validation and sanitization
- File upload restrictions and validation
- Rate limiting on API endpoints

### Testing
- Write unit tests for utility functions
- Integration tests for API endpoints
- Component testing for React components
- End-to-end testing for critical user flows

## Deployment

### Environment Setup
1. Set up production MongoDB instance
2. Configure email service (SendGrid, AWS SES, etc.)
3. Set up file storage (AWS S3, Cloudinary, etc.)
4. Configure environment variables for production

### Build Process
```bash
# Build frontend
cd client
npm run build

# The built files will be in client/dist
```

### Production Considerations
- Use PM2 or similar for process management
- Set up reverse proxy with Nginx
- Configure SSL certificates
- Set up monitoring and logging
- Implement backup strategies for database and files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact:
- Email: support@eoc.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues page]
