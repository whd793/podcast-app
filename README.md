# 🎙️ PodStream - Modern Podcast Streaming Platform

PodStream is a full-stack podcast streaming platform that allows users to discover, listen to, and manage their favorite podcasts. Built with modern web technologies, it offers a seamless experience for both audio and video podcast content.

## 🌟 Features

### User Features
- 🔐 Secure authentication (Email/Password & Kakao OAuth)
- 📱 Responsive design for all devices
- 🎧 Audio & Video podcast streaming
- ❤️ Favorite podcasts functionality
- 🔍 Advanced search and filtering
- 🏷️ Category-based browsing
- 📊 View count tracking
- 🌐 Multi-language support (English & Korean)

### Content Creator Features
- 📤 Upload audio/video podcasts
- 📝 Episode management
- 📸 Thumbnail uploads
- 🏷️ Add tags and categories
- 📊 View statistics

### Technical Features
- 🔄 Real-time progress tracking
- 🎚️ Volume control
- ⌨️ Keyboard controls for playback
- 🔔 Toast notifications
- 🔒 JWT authentication
- 📧 Email verification system
- 🌓 Dark/Light theme support

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI Library
- **Redux Toolkit** - State Management
- **Styled Components** - Styling
- **Material UI** - UI Components
- **i18next** - Internationalization
- **React Router** - Navigation
- **Axios** - HTTP Client

### Backend
- **Node.js** & **Express.js** - Server Framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service
- **AWS S3** - File Storage

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  img: String,
  kakaoSignIn: Boolean,
  podcasts: [PodcastId],
  favorits: [PodcastId]
}
```

### Podcast Model
```javascript
{
  name: String,
  desc: String,
  thumbnail: String,
  creator: UserId,
  tags: [String],
  type: String,
  category: String,
  views: Number,
  episodes: [EpisodeId]
}
```

### Episode Model
```javascript
{
  name: String,
  desc: String,
  thumbnail: String,
  creator: UserId,
  type: String,
  duration: String,
  file: String
}
```

## 🚀 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/kakao` - Kakao OAuth
- `GET /auth/generateotp` - Generate OTP for verification
- `GET /auth/verifyotp` - Verify OTP

### Podcasts
- `GET /podcasts` - Get all podcasts
- `GET /podcasts/get/:id` - Get specific podcast
- `POST /podcasts` - Create podcast
- `POST /podcasts/episode` - Add episode
- `POST /podcasts/favorit/:id` - Toggle favorite
- `GET /podcasts/search` - Search podcasts
- `GET /podcasts/category` - Get by category

## 🔥 Key Features Implementation

### Real-time Audio/Video Player
```javascript
const AudioPlayer = ({ episode, podid, currenttime, index }) => {
  // Custom player with progress tracking and volume control
  // Keyboard shortcuts for playback control
  // Automatic progress saving
}
```

### Authentication Flow
```javascript
const signin = async (req, res, next) => {
  // Email/Password validation
  // JWT token generation
  // Session management
}
```

### File Upload System
```javascript
const uploadFile = async (file) => {
  // AWS S3 integration
  // Progress tracking
  // File validation
}
```

## 🔧 Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/podstream.git
```

2. Install dependencies
```bash
cd podstream
npm install
```

3. Environment Variables
```env
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
AWS_S3_BUCKET=your_s3_bucket
EMAIL_SERVICE_CREDENTIALS=your_email_credentials
```

4. Run the application
```bash
npm run dev  # Development
npm start    # Production
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Made with ❤️ by Won Lee
