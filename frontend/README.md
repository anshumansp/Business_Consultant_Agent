# BusinessTech Advisor AI Platform

A modern web application that combines AI-powered business consulting with a blogging platform. Built with React, Firebase, and Material-UI, featuring real-time updates and a clean, professional design.

## 🚀 Features

### AI Chat Interface
- Real-time AI consulting using DeepSeek AI
- Business strategy and technology advice
- Persistent chat history
- Markdown support with syntax highlighting

### Blog Platform
- Real-time blog updates using Firebase
- Rich text editing
- Image integration with Unsplash API
- Like system and user engagement
- Author-specific controls (edit/delete)
- Responsive grid layout
- Modern UI with animations

### Authentication
- Email/password authentication
- Protected routes
- Persistent sessions
- Secure token management

## 🛠 Technology Stack

### Frontend Framework
- React 18
- Vite (for fast development and building)
- React Router v7 (for navigation)

### UI Components & Styling
- Material-UI (MUI) v5
- MUI Icons
- Custom styled components
- Responsive design
- CSS-in-JS with Emotion

### Backend & Database
- Firebase Authentication
- Firebase Firestore (real-time database)
- Firebase Security Rules

### AI Integration
- DeepSeek AI API
- Server-Sent Events (SSE) for streaming responses
- Markdown parsing and rendering

### Image Integration
- Unsplash API
- Dynamic image loading
- Fallback mechanisms

### Development Tools
- ESLint
- Prettier
- Git version control

## 🔧 Setup & Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
cd [project-directory]
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env file in the root directory with the following variables:
\`\`\`env
# API Configuration
VITE_API_URL=your_api_url

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Unsplash Configuration
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── Blog/
│   │   ├── BlogList.jsx
│   │   ├── BlogDetail.jsx
│   │   └── BlogEditor.jsx
│   ├── Chat/
│   │   └── ChatInterface.jsx
│   └── Auth/
│       └── AuthGuard.jsx
├── services/
│   ├── blogService.js
│   └── firebase.config.js
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Home.jsx
├── utils/
│   └── theme.js
└── App.jsx
\`\`\`

## 🔐 Security

- Firebase Authentication for user management
- Protected routes with AuthGuard
- Secure environment variables
- Author-only blog post modifications
- Token-based API authentication

## 🎨 Design System

- Consistent color palette with pink accent colors
- Responsive typography system
- Smooth animations and transitions
- Card-based layouts
- Gradient effects
- Consistent spacing and elevation

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for different screen sizes
- Flexible grid system
- Optimized images
- Touch-friendly interactions

## 🔄 State Management

- React hooks for local state
- Firebase real-time updates
- Context for auth state
- Optimistic UI updates

## 🚀 Deployment

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Deploy to your hosting platform of choice (Firebase Hosting recommended)

## 📈 Future Enhancements

- Rich text editor integration
- Image upload capability
- Comment system
- Social sharing
- User profiles
- Analytics integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Your Name] - Initial work and maintenance

## 🙏 Acknowledgments

- Material-UI team for the component library
- Firebase team for the backend infrastructure
- Unsplash for the image API
- DeepSeek for the AI capabilities
