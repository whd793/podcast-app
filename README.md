# 🎧 PodStream

<div align="center">
  <h3>
    <a href="#korean">한국어</a> |
    <a href="#english">English</a>
  </h3>
</div>

---

<h2 id="korean">한국어</h2>

# 🎧 PodStream - 팟캐스트 스트리밍 플랫폼

## 📌 프로젝트 소개
PodStream은 사용자들이 오디오와 비디오 팟캐스트를 쉽게 공유하고 시청/청취할 수 있는 스트리밍 플랫폼입니다. 직관적인 UI/UX와 안정적인 스트리밍 서비스를 제공합니다.

## ⭐ 주요 기능

### 사용자 인증
- JWT 기반 로그인/회원가입
- 카카오 OAuth 소셜 로그인
- 이메일 인증 및 비밀번호 재설정

### 미디어 플레이어
- 커스텀 오디오/비디오 플레이어
- 재생 진행률 실시간 추적
- 볼륨 조절 및 재생 제어
- 이전/다음 에피소드 전환

### 콘텐츠 관리
- 팟캐스트 업로드 및 관리
- 에피소드 추가 및 수정
- 카테고리별 콘텐츠 분류
- 즐겨찾기 기능

### 다국어 지원
- 한국어/영어 지원
- 사용자 위치 기반 자동 언어 설정

## 🛠 기술 스택

### 프론트엔드
- React
- Redux Toolkit (상태 관리)
- Styled-Components (스타일링)
- Material-UI (UI 컴포넌트)
- i18next (다국어 처리)

### 백엔드
- Node.js
- Express.js
- MongoDB (데이터베이스)
- JWT (인증)
- AWS S3 (파일 스토리지)

## 💻 설치 및 실행 방법

### 프론트엔드 실행
```bash
# 저장소 클론
git clone [저장소 URL]

# 디렉토리 이동
cd podstream/frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 백엔드 실행
```bash
# 디렉토리 이동
cd podstream/backend

# 의존성 설치
npm install

# 서버 실행
npm start
```

## 🔧 환경 변수 설정
```env
# Backend .env
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
AWS_S3_BUCKET=your_bucket_name
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
EMAIL_SERVICE=your_email_service
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
KAKAO_CLIENT_ID=your_kakao_client_id

# Frontend .env
REACT_APP_API_URL=your_api_url
REACT_APP_KAKAO_KEY=your_kakao_key
```

## 📁 프로젝트 구조
```
podstream/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    └── server.js
```

## 🔍 주요 API

### 인증 관련
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/signin` - 로그인
- `POST /api/auth/kakao` - 카카오 로그인
- `GET /api/auth/generateotp` - OTP 생성
- `GET /api/auth/verifyotp` - OTP 검증

### 팟캐스트 관련
- `POST /api/podcasts` - 팟캐스트 생성
- `GET /api/podcasts` - 팟캐스트 목록 조회
- `POST /api/podcasts/episode` - 에피소드 추가
- `POST /api/podcasts/favorit/:id` - 즐겨찾기 토글
- `GET /api/podcasts/search` - 팟캐스트 검색

## 🔒 보안 기능
- JWT 기반 인증
- 비밀번호 암호화
- 이메일 인증
- OAuth 보안

## 🌟 핵심 구현 사항

### 미디어 플레이어
```javascript
const AudioPlayer = ({ episode, currenttime }) => {
  // 재생 상태 관리
  // 진행률 추적
  // 볼륨 제어
};
```

### 상태 관리
```javascript
const audioPlayerSlice = createSlice({
  name: 'audioplayer',
  initialState,
  reducers: {
    // 플레이어 상태 관리
    // 재생 제어
  }
});
```

## 📱 스크린샷
[주요 화면 스크린샷 추가 예정]

## 🚀 배포 정보
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Storage: AWS S3

## 👥 기여 방법
1. 프로젝트 포크
2. 기능 개발용 브랜치 생성
3. 변경 사항 커밋
4. 풀 리퀘스트 요청

## 📝 라이선스
MIT License

## 📞 문의
- Email: [이메일 주소]
- GitHub: [GitHub 프로필 링크]

---

<h2 id="english">English</h2>

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
