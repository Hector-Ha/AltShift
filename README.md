# AltShift - Collaborative Document Editor

AltShift is a real-time collaborative document editor built with modern web technologies. It bridges the gap between traditional word processing and AI-assisted creation, offering a seamless environment for writing and collaboration.

---

## ⚡ TL;DR

**What**: Real-time collaborative document editor with AI-powered content generation  
**Stack**: React + TypeScript + Node.js + MongoDB + GraphQL + Socket.IO  
**Features**: Multi-user editing, AI document generation, rich text formatting, notifications  
**Setup**: Clone → Install deps → Add env vars → `npm run dev`

### Why AltShift?

- ⚡**Real-time Collaboration** - Multiple users can edit documents simultaneously with WebSocket-based sync
- ⚡**AI-Powered Generation** - Create documents from prompts and attachments using Llama 3.1
- ⚡**Rich Text Editing** - Full-featured editor with formatting, tables, images, and more
- ⚡**Secure & Private** - Granular visibility controls (Public, Shared, Private)
- ⚡**Responsive Design** - Works seamlessly across desktop and mobile devices
- ⚡**Real-time Notifications** - Stay updated on document changes and collaboration invites

---

## Features

### Document Management

- ✅ Create, edit, delete, and duplicate documents
- ✅ Archive with optional scheduled deletion (30 days)
- ✅ Document versioning and snapshot history
- ✅ Search and filter by ownership, collaboration status, and archive state
- ✅ Favorite documents for quick access

### Collaboration

- ✅ Real-time multi-user editing with Socket.IO
- ✅ User presence indicators with active status
- ✅ Invite collaborators via email with notification system
- ✅ Granular access control (Owner, Collaborator, Viewer)
- ✅ Transfer document ownership

### AI Integration

- ✅ Generate documents from natural language prompts
- ✅ Support for PDF and Word document attachments as context
- ✅ In-editor AI assistant for content generation
- ✅ Markdown to Slate.js conversion for rich formatting

### Rich Text Editing (Slate.js)

- ✅ Multiple heading levels, lists, blockquotes
- ✅ Text formatting (bold, italic, underline, strikethrough)
- ✅ Text and background colors
- ✅ Tables with multiple rows and columns
- ✅ Image and video embeds
- ✅ Hyperlinks
- ✅ Text alignment options

### User Management

- ✅ Secure authentication with JWT
- ✅ Password reset via email (SendGrid)
- ✅ User profiles with customizable information
- ✅ Email verification system

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **MongoDB** instance (local or cloud)
- **SendGrid API Key** (for emails)
- **Groq API Key** (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/altshift.git
   cd altshift
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Configure environment variables**

   Create `server/.env`:

   ```env
   APP_PORT=4000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=AltShift
   JWT_SECRET=your_jwt_secret_key_here
   SENDGRID_API_KEY=SG.your_sendgrid_key_here
   SENDGRID_SENDER_EMAIL=noreply@yourdomain.com
   GROQ_API_KEY=gsk_your_groq_key_here
   CLIENT_URL=http://localhost:5173
   ```

   Create `client/.env` (optional):

   ```env
   VITE_SERVER_URL=http://localhost:4000
   ```

4. **Start the development servers**

   ```bash
   # From the root directory
   npm run dev

   # Or start separately:
   # Client (Terminal 1)
   cd client && npm run dev

   # Server (Terminal 2)
   cd server && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

---

## Tech Stack

### Frontend

| Technology       | Purpose                 | Version  |
| ---------------- | ----------------------- | -------- |
| React 19         | UI Framework            | ^19.1.1  |
| TypeScript       | Type Safety             | ~5.8.3   |
| Vite             | Build Tool              | ^7.1.7   |
| Slate.js         | Rich Text Editor        | ^0.118.1 |
| Apollo Client    | GraphQL Client          | ^4.0.9   |
| Socket.IO Client | Real-time Communication | ^4.8.1   |
| React Router     | Routing                 | ^7.10.1  |
| Lucide React     | Icons                   | ^0.562.0 |

### Backend

| Technology          | Purpose          | Version |
| ------------------- | ---------------- | ------- |
| Node.js + Express 5 | Web Server       | ^5.1.0  |
| TypeScript          | Type Safety      | ^5.9.3  |
| Apollo Server       | GraphQL Server   | ^5.0.0  |
| Socket.IO           | WebSocket Server | ^4.8.1  |
| MongoDB + Mongoose  | Database         | ^8.19.2 |
| JWT                 | Authentication   | ^9.0.2  |
| Bcrypt.js           | Password Hashing | ^3.0.3  |
| SendGrid            | Email Service    | ^8.1.6  |

---

## Project Structure

```
altshift/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── styles/        # CSS stylesheets
│   │   ├── apollo/        # GraphQL client setup
│   │   ├── socket/        # Socket.IO client
│   │   ├── gql/           # Generated GraphQL types
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── graphql/       # GraphQL schema & resolvers
│   │   ├── models/        # Mongoose models
│   │   ├── socket/        # Socket.IO handlers
│   │   ├── interfaces/    # TypeScript interfaces
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Server entry point
│   ├── dist/              # Compiled JavaScript
│   └── package.json
│
└── package.json           # Root workspace config
```

---

## Documentation

### Database Schema

#### User Schema

```typescript
{
  email: string (unique)
  password: string (hashed)
  personalInformation: {
    firstName: string
    lastName: string
    jobTitle?: string
    organization: string
    DOB?: Date
    profilePicture?: string
  }
  ownership: ObjectId[]
  isCollaborating: ObjectId[]
  isFavorite: ObjectId[]
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

#### Document Schema

```typescript
{
  title: string
  content: string (Slate JSON)
  visibility: "PUBLIC" | "SHARED" | "PRIVATE"
  owner: ObjectId
  collaborators: ObjectId[]
  invitations: ObjectId[]
  versions: [{
    content: string
    createdAt: Date
  }]
  isArchived: boolean
  archiveType?: "MANUAL" | "SCHEDULED"
  scheduledDeletionTime?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

#### Notification Schema

```typescript
{
  recipient: ObjectId;
  sender: ObjectId;
  type: "DOCUMENT_INVITE" |
    "DOCUMENT_UPDATE" |
    "DOCUMENT_DELETE" |
    "OWNERSHIP_TRANSFER";
  document: ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}
```

### GraphQL API

#### Key Queries

```graphql
# Get a specific document
getDocumentByID(id: ID!): Document

# Get all accessible documents with filters
getDocuments(
  filter: DocumentFilterInput
  sort: DocumentSortInput
  pagination: PaginationInput
): [Document!]!

# Get user information
getUserByID(id: ID!): User

# Get notifications
myNotifications(filter: NotificationFilter): [Notification!]!
```

#### Key Mutations

```graphql
# Authentication
createUser(input: createUserInput!): AuthPayload!
login(email: String!, password: String!): AuthPayload!

# Document operations
createDocument(input: createDocumentInput!): Document!
createDocumentWithAI(prompt: String!, attachments: [AttachmentInput]): Document!
updateDocument(documentID: ID!, input: updateDocumentInput!): Document!

# Collaboration
inviteCollaborator(documentID: ID!, email: String!): Document!
acceptCollaborateInvitation(documentID: ID!, notificationID: ID): Document!
removeCollaborator(documentID: ID!, userID: ID!): Document!

# AI
generateAIContent(prompt: String!, context: String!): String!
```

### Socket.IO Events

#### Client → Server

- `join-document` - Join a document room for real-time updates
- `text-update` - Send document content changes
- `cursor-move` - Broadcast cursor position

#### Server → Client

- `active-users` - List of users currently viewing the document
- `join-document` - New user joined the document
- `text-update` - Document content changed
- `doc-activity` - User viewing/left document
- `new-notification` - Real-time notification delivery

---

## Configuration

### Client Environment Variables

```env
VITE_SERVER_URL=http://localhost:4000  # Backend URL
```

### Server Environment Variables

```env
APP_PORT=4000                          # Server port
MONGODB_URI=mongodb://...              # MongoDB connection string
JWT_SECRET=your_secret_here            # JWT signing secret
SENDGRID_API_KEY=SG.xxx                # SendGrid API key
SENDGRID_SENDER_EMAIL=noreply@...      # Email sender address
GROQ_API_KEY=gsk_xxx                   # Groq AI API key
CLIENT_URL=http://localhost:5173       # Frontend URL
```

---

## Development

### Run Development Servers

```bash
# Run both client and server concurrently
npm run dev

# Or run separately
cd client && npm run dev
cd server && npm run dev
```

### Build for Production

```bash
# Build client
cd client && npm run build

# Build server
cd server && npm run build
```

### Code Generation

```bash
# Generate GraphQL types (client)
cd client && npm run codegen

# Generate GraphQL types (server)
cd server && npm run codegen
```

---

## Known Issues & Limitations

- **Pagination**: Page breaks in the Slate editor are calculated dynamically and may need refinement for complex layouts
- **Offline Mode**: Not yet implemented; changes require an active connection
- **Browser Storage**: localStorage/sessionStorage are not used due to artifact constraints
- **File Uploads**: Currently limited to PDF and Word documents for AI context

---

## Roadmap

### Coming Soon

- [ ] User presence cursors with real-time positions
- [ ] Commenting threads and @mentions
- [ ] "Track Changes" mode for suggestions
- [ ] Offline editing with sync queue
- [ ] Document templates library
- [ ] Export to PDF/DOCX
- [ ] Advanced search with filters

### Future Enhancements

- [ ] Markdown shortcuts support
- [ ] Nested tables and complex layouts
- [ ] Image uploads and management
- [ ] Document version diff visualization
- [ ] Activity logs and contribution stats
- [ ] AWS deployment scripts
- [ ] Redis for scaling Socket.IO
- [ ] Microservices architecture

---

## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Slate.js](https://docs.slatejs.org/) for rich text editing
- AI powered by [Groq](https://groq.com/) and Llama 3.1
- Email delivery by [SendGrid](https://sendgrid.com/)
- Inspired by collaborative tools like Google Docs and Notion

---

<br/>

**⭐ Star this repo if you find it helpful!**

Design and Develop by. The project is provided as is
_\- Hector Ha_
