# AltShift - Collaborative Document Editor

> **A real-time collaborative document editor bridging the gap between traditional word processing and AI-assisted creation.**

## TL;DR

AltShift is a real-time collaborative document editor built with **React 19** (Frontend) and **Express 5** (Backend), running on the **Bun** runtime. It offers a seamless environment for writing and collaboration with AI-assisted features.

It supports authentication, real-time collaboration with Socket.IO, rich text editing with Slate.js, and AI-powered content generation.

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Environment
# Create .env files in server/ and client/ (see Getting Started for details)

# 3. Run Development Server
bun run dev
```

## Feature Overview

AltShift is a fully featured application with the following core capabilities:

| Category             | Status        | Capabilities                            |
| -------------------- | ------------- | --------------------------------------- |
| **Authentication**   | ✅ Integrated | Secure login/signup, Password Reset     |
| **Collaboration**    | ✅ Integrated | Real-time sync via Socket.IO            |
| **Rich Text Editor** | ✅ Integrated | Slate.js implementation with formatting |
| **AI Integration**   | ✅ Integrated | Content generation via Groq             |
| **Doc Management**   | ✅ Integrated | Create, Edit, Delete, Profile mgmt      |
| **Infrastructure**   | ✅ Integrated | Bun runtime, MongoDB, Express 5         |

## Features & Roadmap

### Core Features (Implemented)

- [x] **Auth System**: Login, Signup, Password Reset via Email
- [x] **Real-time Collaboration**: Multi-user editing with Socket.IO
- [x] **AI Content Generation**: Powered by Groq/Llama 3
- [x] **Rich Text Editor**: Full formatting support (Slate.js)
- [x] **User Management**: Profiles, Avatars, Settings
- [x] **Document Dashboard**: Organization, Search, Filtering
- [x] **Infrastructure**: Monorepo setup with Bun and Docker support

### Future Enhancements

- [ ] Offline Editing Support
- [ ] Export Options (PDF/DOCX)
- [ ] Advanced Commenting & Threads
- [ ] Document Templates
- [ ] Interactive Dashboard Widgets
- [ ] Organization/Team Management
- [ ] Native Mobile Applications
- [ ] Public API SDK

## Known Issues

Current limitations of the application:

1.  **Pagination**: Page breaks in the Slate editor are calculated dynamically and may need refinement for complex layouts.
2.  **Offline Mode**: Not yet implemented; changes require an active connection.
3.  **File Uploads**: Limited support for context attachments.
4.  **Mobile Support**: Responsive design is in early stages; optimized for desktop.

## Architecture

AltShift is a full-stack monorepo:

- **Frontend**: React 19, TypeScript, Vite, Slate.js, Apollo Client
- **Backend**: Express 5, Bun Runtime, Mongoose, MongoDB
- **Integrations**: SendGrid (Email), Groq (AI), Socket.IO (Real-time)
- **Security**: JWT Authentication, Bcrypt Hashing, Input Sanitization

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.3+
  > **Note**: Install via npm if needed: `npm install -g bun`.
  > For issues, check the [Bun Documentation](https://bun.com/docs).
- MongoDB instance (local or cloud)

### Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd altshift
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in `server/` with the following:

    ```env
    APP_PORT=4000
    MONGODB_URI=mongodb+srv://...
    JWT_SECRET=your_secret_key
    SENDGRID_API_KEY=SG....
    GROQ_API_KEY=gsk_...
    CLIENT_URL=http://localhost:5173
    ```

    Optionally create `client/.env`:

    ```env
    VITE_SERVER_URL=http://localhost:4000
    ```

4.  **Start Development**
    ```bash
    # From root
    bun run dev
    ```
    - Frontend: `http://localhost:5173`
    - GraphQL Playground: `http://localhost:4000/graphql`

## Security Features

- **JWT Authentication**: Stateless, secure user sessions.
- **Password Recovery**: Secure reset flow via email.
- **Input Validation**: Sanitization for rich text and inputs.

## Contributing

This is a private project. For questions or issues, please contact the maintainers.

## Acknowledgments

- Built with [Slate.js](https://docs.slatejs.org/)
- AI powered by [Groq](https://groq.com/)
