# 🚀 Elevate - Intelligent Recruitment Platform

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange)](https://mysql.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple)](https://openai.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

**Elevate** is a modern, AI-powered recruitment platform designed to streamline the hiring process for companies of all sizes. Built with cutting-edge technologies, it combines artificial intelligence with intuitive user experience to transform how organizations discover, evaluate, and hire top talent.

## ✨ Key Features

### 🤖 **AI-Powered CV Analysis**
- **Intelligent PDF Processing**: Extract and analyze candidate information from PDF resumes
- **OpenAI GPT-4 Integration**: Advanced natural language processing for candidate evaluation
- **Automated Candidate Scoring**: AI-driven assessment based on job requirements
- **Batch Processing**: Process multiple CVs simultaneously with optimized performance

### 👥 **Comprehensive Candidate Management**
- **Structured Candidate Profiles**: Store detailed candidate information with JSON fields
- **Advanced Search & Filtering**: Find candidates by skills, experience, location, and more
- **Notes & Collaboration**: Team collaboration tools for candidate evaluation
- **Application Tracking**: Full lifecycle management from application to hire

### 🎯 **Vacancy Management**
- **Job Posting Creation**: Create and manage job vacancies with detailed requirements
- **Application Analytics**: Track application counts and candidate pipeline
- **Status Management**: Open, closed, and paused vacancy states
- **Requirements Matching**: AI-powered candidate-to-vacancy matching

### 🔐 **Enterprise Security**
- **Argon2id Encryption**: Industry-standard password hashing
- **Role-Based Access**: Multi-role user management system
- **Secure Authentication**: Robust login and registration system
- **Data Protection**: Secure handling of sensitive candidate information

### 🌐 **Modern Web Interface**
- **Responsive Design**: Optimized for desktop and mobile devices
- **Multi-language Support**: Internationalization with English/Spanish support
- **Real-time Updates**: Dynamic interface with modern JavaScript
- **Professional UI/UX**: Clean, intuitive design for better user experience

## 🏗️ Architecture

Elevate follows a robust **MVC (Model-View-Controller)** architecture pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Public)      │◄──►│   (Express)     │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │    │ • REST API      │    │ • Candidates    │
│ • Responsive    │    │ • AI Integration│    │ • Vacancies     │
│                 │    │ • Authentication│    │ • Applications  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   OpenAI API    │
                    │   (GPT-4)       │
                    │                 │
                    │ • CV Analysis   │
                    │ • Text Extract  │
                    │ • Candidate AI  │
                    └─────────────────┘
```

## 🛠️ Technology Stack

### **Backend**
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5.1.0
- **Database**: MySQL 8.0+ with Sequelize ORM
- **Authentication**: Argon2id password hashing
- **AI/ML**: OpenAI GPT-4 API integration
- **File Processing**: Multer for file uploads, PDF extraction

### **Frontend**
- **Languages**: Modern ES6+ JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS for responsive design
- **Architecture**: Modular component-based structure
- **Features**: SPA routing, real-time updates, multi-language support

### **Infrastructure**
- **Database**: Relational MySQL with optimized schema
- **Storage**: File system with secure file handling
- **API**: RESTful API design with consistent response patterns
- **Security**: CORS, input validation, secure headers

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.0 or higher
- **MySQL** 8.0 or higher
- **OpenAI API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JTeban1/Proyect.git
   cd Elevate-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Configure your environment variables
   MYSQL_ADDON_DB=your_database_name
   MYSQL_ADDON_USER=your_username
   MYSQL_ADDON_PASSWORD=your_password
   MYSQL_ADDON_HOST=localhost
   MYSQL_ADDON_PORT=3306
   OPENAI_KEY=your_openai_api_key
   PORT=9000
   ```

4. **Database setup**
   ```bash
   # Create database schema
   mysql -u your_username -p your_database_name < DB/Schema.sql
   ```

5. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   ```
   🌐 Frontend: http://localhost:9000/public
   📡 API: http://localhost:9000/api
   ```

## 📚 API Documentation

### **Authentication Endpoints**
```
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User authentication
POST   /api/auth/logout       # User logout
PUT    /api/auth/change-password # Password change
```

### **Candidate Management**
```
GET    /api/candidates        # Get all candidates
POST   /api/candidates        # Upload and process CVs with AI
PUT    /api/candidates        # Update candidate information
GET    /api/candidates/:id/notes # Get candidate notes
PUT    /api/candidates/:id/notes # Update candidate notes
```

### **Vacancy Management**
```
GET    /api/vacancies         # Get all vacancies
POST   /api/vacancies         # Create new vacancy
PUT    /api/vacancies/:id     # Update vacancy
DELETE /api/vacancies/:id     # Delete vacancy
GET    /api/vacancies/count   # Get vacancies with application count
GET    /api/vacancies/:id     # Get applications for vacancy
```

### **Application Tracking**
```
GET    /api/applications      # Get all applications
GET    /api/applications/vacancy/:id # Get applications by vacancy
GET    /api/applications/vacancy/:id/status/:status # Filter by status
```

### **User Management**
```
GET    /api/users             # Get all users
POST   /api/users             # Create new user
PUT    /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
```

### **Collaboration Features**
```
GET    /api/shares/:senderId  # Get candidate shares
POST   /api/shares/create     # Share candidate with team member
```

## 🤖 AI Features

### **CV Processing Workflow**

1. **PDF Upload**: Multiple CV files uploaded via secure endpoint
2. **Text Extraction**: Advanced PDF parsing and text extraction
3. **AI Analysis**: OpenAI GPT-4 processes and structures candidate data
4. **Data Validation**: Structured validation and sanitization
5. **Database Storage**: Automatic candidate profile creation
6. **Matching**: AI-powered job-candidate matching with reasoning

### **Example AI Response**
```json
{
  "name": "Juan Guillermo Barrera Fernandez",
  "email": "juan.barrera@gmail.com",
  "date_of_birth": "1990-05-14",
  "phone": "+57 3001234567",
  "occupation": "Software Engineer",
  "summary": "Software engineer with 8+ years of experience...",
  "experience": [
    {
      "company": "Tech Solutions",
      "position": "Backend Developer",
      "description": "Developed APIs with Node.js",
      "years": "2015-2018"
    }
  ],
  "skills": ["Node.js", "React", "SQL", "AWS"],
  "status": "approved",
  "ai_reason": "Strong technical background matches requirements"
}
```

## 📁 Project Structure

```
Elevate-Backend/
├── 📁 app/                          # Application core
│   ├── 📁 controllers/              # Request handlers & business logic
│   │   ├── ApplicationsController.js
│   │   ├── AuthController.js
│   │   ├── CandidatesController.js
│   │   ├── CandidateSharesController.js
│   │   ├── UploadCandidate.js       # AI CV processing
│   │   ├── UsersController.js
│   │   └── VacanciesControllers.js
│   ├── 📁 middleware/               # Custom middleware
│   │   └── authMiddleware.js
│   ├── 📁 models/                   # Data layer
│   │   ├── 📁 entities/             # Database models
│   │   │   ├── ApplicationEntity.js
│   │   │   ├── CandidateEntity.js
│   │   │   ├── CandidateSharesEntity.js
│   │   │   ├── RolesEntity.js
│   │   │   ├── UserEntity.js
│   │   │   └── VacanciesEntity.js
│   │   └── 📁 services/             # Business logic services
│   │       ├── ApplicationServices.js
│   │       ├── AuthServices.js
│   │       ├── CandidateServices.js
│   │       ├── CandidateSharesServices.js
│   │       ├── UserServices.js
│   │       └── VacanciesServices.js
│   └── 📁 routes/                   # API route definitions
│       ├── ApplicationsRouter.js
│       ├── AuthRouter.js
│       ├── CandidateSharesRouter.js
│       ├── CandidatesRouter.js
│       ├── UsersRouter.js
│       └── VacanciesRouter.js
├── 📁 config/                       # Configuration files
│   └── db_conn.js                   # Database connection
├── 📁 DB/                           # Database files
│   ├── ER Model.mwb                 # Entity relationship model
│   └── Schema.sql                   # Database schema
├── 📁 public/                       # Frontend static files
│   ├── 📁 assets/                   # Images and media
│   ├── 📁 css/                      # Stylesheets
│   ├── 📁 js/                       # JavaScript modules
│   │   ├── 📁 api/                  # API integration
│   │   ├── 📁 components/           # UI components
│   │   ├── 📁 utils/                # Utility functions
│   │   └── 📁 views/                # Page controllers
│   ├── 📁 pages/                    # HTML pages
│   └── index.html                   # Main landing page
├── 📄 app.js                        # Application entry point
├── 📄 package.json                  # Dependencies and scripts
├── 📄 README.md                     # Project documentation
├── 📄 CONTRIBUTING.md               # Contribution guidelines
├── 📄 AUTH_IMPLEMENTATION.md        # Authentication documentation
└── 📄 LICENSE                       # License information
```

- Test responsive design on various screen sizes

## 🚀 Deployment

### **Production Environment**
```bash
# Build for production
npm run start
```

### **Environment Variables (Production)**
```env
PORT=9000
MYSQL_ADDON_DB=production_db
MYSQL_ADDON_HOST=your-production-host
MYSQL_ADDON_USER=your-production-user
MYSQL_ADDON_PASSWORD=your-production-password
OPENAI_KEY=your-production-openai-key
```

### **SSL Configuration**
- Use environment variables for SSL certificates
- Implement proper CORS policies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information about:

- 📋 Development setup
- 🔀 Git workflow and branching strategy
- 📝 Commit message conventions
- 🔍 Code review process

### **Quick Contribution Steps**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat(api): add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **OpenAI** for providing powerful AI capabilities
- **Express.js** community for excellent web framework
- **Sequelize** team for robust ORM
- **TailwindCSS** for modern styling approach

## 📞 Support & Contact

- **🐛 Issues**: [GitHub Issues](https://github.com/JTeban1/Proyect/issues)
<!-- - **📖 Documentation**: [Project Wiki](https://github.com/JTeban1/Proyect/wiki) -->
- **💬 Discussions**: [GitHub Discussions](https://github.com/JTeban1/Proyect/discussions)

---

<div align="center">
  <strong>Built with ❤️ by the Elevate Team</strong><br>
</div>