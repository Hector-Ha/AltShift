# AltShift - Collaborative Document Editor

AltShift is a real-time collaborative document editor built with TypeScript, Slate.js, Socket.IO, and GraphQL. It features multi-user document editing with WebSocket-based synchronization, MongoDB persistence, and AI-powered document generation.

---

## Getting Started

### Prerequisites

- Node.js (>= 18)
- MongoDB instance (local or cloud)
- npm or yarn
- Groq API Key (for AI features)
- SendGrid API Key (for emails)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd altshift
```

2. **Install client dependencies**

```bash
cd client
npm install
```

3. **Install server dependencies**

```bash
cd ../server
npm install
```

4. **Configure environment variables**

Create `server/.env`:

```env
APP_PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=AltShift
JWT_SECRET=your_jwt_secret_key_here
SENDGRID_API_KEY=SG.your_sendgrid_key_here
GROQ_API_KEY=gsk_your_groq_key_here
CLIENT_URL=http://localhost:5173
```

### Development

**Run the client:**

```bash
cd client
npm run dev
```

Client runs at `http://localhost:5173`

**Run the server:**

```bash
cd server
npm run watch  # Compile TypeScript in watch mode
npm run dev    # Run with nodemon (in another terminal)
```

Server runs at `http://localhost:4000`
GraphQL playground at `http://localhost:4000/graphql`

### Build for Production

**Build client:**

```bash
cd client
npm run build
```

**Build server:**

```bash
cd server
npm run build
npm start
```

---

# Project Details

## Project Goal

The primary goal of AltShift is to deliver a seamless, high-performance real-time collaborative editing experience comparable to industry leaders like Google Docs and Notion. It aims to bridge the gap between traditional word processing and modern AI assistance, providing users with a powerful workspace where creating, editing, and sharing documents feels instantaneous and intuitive.

## Technical Challenges

Building a real-time collaborative editor introduces several complex engineering challenges:

- **Concurrency & Conflict Resolution**: Implementing robust strategies (like Operational Transformation or CRDTs) to ensure that multiple users editing the same document simultaneously do not overwrite each other's changes.
- **State Synchronization**: Managing WebSocket connections across multiple rooms and ensuring consistent document state propagation between clients and the database in real-time.
- **Rich Text Serialization**: Efficiently converting complex Slate.js JSON structures to identifying markdown or HTML for storage and AI processing, and accurately reconstructing them on retrieval.
- **AI Latency & Context**: Integrating Large Language Models (LLMs) in a way that feels responsive. Streaming responses and managing context window limits when dealing with large documents or multiple attachments.
- **Scalability**: Designing the architecture to handle increasing numbers of concurrent active documents and WebSocket connections without degrading performance.

## Project Structure

```
altshift/
├── client/          # Frontend React application
├── server/          # Backend Node.js server
└── README.md
```

## Architecture Overview

### Client-Side (Frontend)

- **Framework**: React 19 with TypeScript
- **Editor**: Slate.js for rich text editing
- **Real-time**: Socket.IO client for WebSocket communication
- **Build Tool**: Vite with React compiler plugin
- **Styling**: Custom SaaS-themed CSS

### Server-Side (Backend)

- **Runtime**: Node.js with Express 5
- **GraphQL**: Apollo Server for API
- **Real-time**: Socket.IO server with WebSocket engine
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **AI Integration**: Groq SDK (Llama 3.1) for content generation
- **Email Service**: SendGrid for verification and notifications

## Tech Stack

### Client Dependencies

| Library          | Purpose                    | Version  |
| ---------------- | -------------------------- | -------- |
| React            | UI framework               | ^19.1.1  |
| React DOM        | React rendering            | ^19.1.1  |
| Slate            | Rich text editor framework | ^0.118.1 |
| Slate React      | React bindings for Slate   | ^0.118.2 |
| Socket.IO Client | WebSocket client           | ^4.8.1   |
| Immutable        | Immutable data structures  | ^5.1.3   |
| Date-fns         | Date formatting            | ^4.1.0   |

### Server Dependencies

| Library       | Purpose              | Version  |
| ------------- | -------------------- | -------- |
| Express       | Web framework        | ^5.1.0   |
| Apollo Server | GraphQL server       | ^5.0.0   |
| Socket.IO     | WebSocket server     | ^4.8.1   |
| MongoDB       | Database driver      | ^6.20.0  |
| Mongoose      | MongoDB ODM          | ^8.19.2  |
| GraphQL       | Query language       | ^16.11.0 |
| CORS          | Cross-origin support | ^2.8.5   |
| SendGrid/Mail | Email delivery       | ^8.1.6   |
| JSONWebToken  | Authentication       | ^9.0.2   |
| BcryptJS      | Password hashing     | ^3.0.3   |
| PDF-Parse     | PDF text extraction  | ^2.4.5   |
| Mammoth       | Word doc extraction  | ^1.11.0  |

## Current Features

### Implemented

- ✅ **Authentication**: User Signup, Login, Forgot Password, Email Verification (SendGrid)
- ✅ **Document Management**: Create, Edit, Delete, Archive, Restore
- ✅ **Rich Text Editor**: Slate.js integration with formatting support
- ✅ **Real-time Collaboration**: Socket.IO-based sync for multi-user editing
- ✅ **AI Assistant**: Generate document content from prompts and attachments (PDF/Word) using Groq (Llama 3.1)
- ✅ **Sharing**: Public/Private visibility toggles, collaborator invitations
- ✅ **Organization**: Dashboard with document lists, recently used, favorites
- ✅ **GraphQL API**: Comprehensive mutation/query set for all operations

### Planned

- 📋 User presence indicators (cursors/avatars)
- 📋 Offline editing with sync queue
- 📋 Document version history (UI implementation)
- 📋 Advanced rich text (tables, images)
- 📋 AWS deployment

## Database Schema

### User Schema

```typescript
{
  uuid: UUID,
  email: string (unique),
  password: string, // Hashed
  personalInformation: {
    firstName: string,
    lastName?: string,
    DOB?: Date,
    profilePicture?: string
  },
  isCollaborating: [ObjectId],
  isFavorite: [ObjectId],
  resetPasswordToken?: string,
  resetPasswordExpires?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Document Schema

```typescript
{
  uuid: UUID,
  title: string,
  content: string (Slate JSON),
  isPublic: boolean,
  visibility: "PUBLIC" | "SHARED" | "PRIVATE",
  owner: ObjectId,
  collaborators: [ObjectId],
  invitations: [ObjectId],
  versions: [{ content: string, createdAt: Date }],
  isArchived: boolean,
  archiveType?: "MANUAL" | "SCHEDULED",
  scheduledDeletionTime?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## GraphQL API

### Queries

```graphql
query {
  getUser(uuid: ID!): User
  getAllUsers: [User!]!
  # Document queries...
}
```

### Mutations

```graphql
mutation {
  createDocumentWithAI(prompt: String!, attachments: [AttachmentInput]): Document!
  login(email: String!, password: String!): AuthPayload!
  # See mutationDefs.ts for full list
}
```

## Future Enhancements

**Advanced Collaboration**:

- [ ] User presence cursors and selection highlighting.
- [ ] Commenting threads and mentions (@user).
- [ ] "Track Changes" mode (suggestion mode).

**Offline Capabilities**:

- [ ] Local-first architecture using IndexedDB.
- [ ] Background synchronization queue for offline edits.

**Enhanced Editor Features**:

- [ ] Image and video uploads/embedding.
- [ ] Nested tables and complex layout blocks.
- [ ] Markdown shortcuts support.

**Analytics & History**:

- [ ] Detailed document version history with diff visualization.
- [ ] User activity logs and contribution stats.

**Infrastructure**:

- [ ] Migration to a microservices architecture.
- [ ] Deployment to AWS (ECS/Fargate) with Redis for socket scaling.

## License

MIT.

## Note

The project is provided as is.
