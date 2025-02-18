# BusinessTech Advisor AI Platform

A modern web application that combines AI-powered business consulting with a rich blogging platform. Built with React, Firebase, Material-UI, and TinyMCE, featuring real-time updates and a professional design.

## 🚀 Features

### AI Chat Interface
- Real-time AI consulting using DeepSeek AI
- Business strategy and technology advice
- Persistent chat history
- Markdown support with syntax highlighting
- Real-time streaming responses
- Professional UI with smooth animations

### Blog Platform
- Rich text editing with TinyMCE
- Advanced formatting options:
  - Lists and nested lists
  - Code blocks with syntax highlighting
  - Blockquotes and tables
  - Custom styling for all elements
- Real-time blog updates using Firebase
- Dynamic image handling with Unsplash API
- Like system and user engagement
- Author-specific controls (edit/delete)
- Responsive grid layout
- Loading states and error handling
- Fallback images and error recovery
- Preview mode for content

### Authentication
- Firebase Authentication
- Protected routes
- Persistent sessions
- Secure token management
- Author-only access control

## 🛠 Technology Stack

### Frontend
- React 18 with Vite
- Material-UI v5
- TinyMCE Editor
- React Router v7
- Emotion for CSS-in-JS

### Backend & Database
- Firebase Authentication
- Firebase Firestore
- Real-time data synchronization
- Security Rules

### Image Integration
- Unsplash API
- Dynamic image loading
- Fallback system
- Loading states

### Development Tools
- ESLint
- Prettier
- Environment variables
- Error handling

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

3. Create a .env file in the root directory:
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

# TinyMCE Configuration
VITE_TINYMCE_API_KEY=your_tinymce_api_key
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
│   │   ├── BlogList.jsx      # Blog listing with grid layout
│   │   ├── BlogDetail.jsx    # Single blog view with rich content
│   │   └── BlogEditor.jsx    # TinyMCE integration for editing
│   ├── Chat/
│   │   └── ChatInterface.jsx # AI chat implementation
│   └── Auth/
│       └── AuthGuard.jsx     # Route protection
├── services/
│   ├── blogService.js        # Firebase blog operations
│   └── firebase.config.js    # Firebase initialization
├── utils/
│   ├── textUtils.js          # Text processing utilities
│   └── theme.js             # MUI theme configuration
└── App.jsx                   # Main application setup
\`\`\`

## 🔐 Security Features

- Firebase Authentication for user management
- Protected routes with AuthGuard
- Secure environment variables
- Author-only blog modifications
- Content sanitization
- XSS protection
- Secure image handling

## 🎨 Design System

- Consistent color palette with pink accent
- Responsive typography system
- Loading states and animations
- Error handling UI
- Modern card-based layouts
- Gradient effects
- Consistent spacing
- Professional typography

## 📱 Responsive Features

- Mobile-first approach
- Flexible grid system
- Responsive images
- Touch-friendly controls
- Adaptive layouts
- Loading placeholders

## 🔄 State Management

- React hooks for local state
- Firebase real-time updates
- Context for auth state
- Optimistic UI updates
- Error state handling
- Loading state management

## 🚀 Deployment

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Deploy to Firebase Hosting:
\`\`\`bash
firebase deploy
\`\`\`

## 📈 Future Enhancements

- Image upload capability
- Comment system
- Social sharing
- User profiles
- Analytics integration
- Advanced search
- Categories and tags
- Draft system

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material-UI team for the component library
- Firebase team for the backend infrastructure
- Unsplash for the image API
- TinyMCE for the rich text editor
- DeepSeek for the AI capabilities
