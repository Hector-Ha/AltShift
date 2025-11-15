# AltShift - Collaborative Document Editor

AltShift is a real-time collaborative document editor built with TypeScript, Slate.js, Socket.IO, and GraphQL. It features multi-user document editing with WebSocket-based synchronization and MongoDB persistence.

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

### Server-Side (Backend)

- **Runtime**: Node.js with Express 5
- **GraphQL**: Apollo Server for API
- **Real-time**: Socket.IO server with WebSocket engine
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript

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

## Getting Started

### Prerequisites

- Node.js (>= 18)
- MongoDB instance (local or cloud)
- npm or yarn

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

## Current Features

### Implemented

- ✅ Basic Slate editor integration
- ✅ Socket.IO connection setup
- ✅ Room-based WebSocket communication
- ✅ GraphQL API with Apollo Server
- ✅ MongoDB schemas (User, Document)
- ✅ User creation mutations
- ✅ Express middleware integration

### In Progress

- 🔄 Real-time collaborative editing
- 🔄 Operational Transformation (OT) implementation
- 🔄 User authentication
- 🔄 Document persistence

### Planned

- 📋 User presence indicators (cursors/avatars)
- 📋 Offline editing with sync queue
- 📋 Document versioning
- 📋 Access control and permissions
- 📋 Rich text formatting toolbar
- 📋 AWS deployment configuration

## Database Schema

### User Schema

```typescript
{
  uuid: UUID,
  email: string (unique),
  password: string,
  personalInformation: {
    firstName: string,
    lastName?: string,
    DOB?: Date
  },
  ownership: [ObjectId],  // References to owned documents
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date
}
```

### Document Schema

```typescript
{
  uuid: UUID,
  title: string (default: "Untitled Document"),
  content: string,
  isPublic: boolean,
  owner: ObjectId,        // Reference to User
  collaborators: [ObjectId],  // References to Users
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date
}
```

## GraphQL API

### Queries

```graphql
# Get user by UUID
query {
  getUser(uuid: ID!): User
}

# Get all users
query {
  getAllUsers: [User!]!
}
```

### Mutations

```graphql
# Create new user
mutation {
  createUser(
    email: String!
    password: String!
    personalInformation: PersonalInformationInput!
  ): User!
}
```

## Socket.IO Events

### Client Events

- `connect` - Establish connection
- `disconnect` - Close connection

### Server Events

- `room-joined` - Emitted when user joins a room
  ```typescript
  {
    data: Set<string>; // Array of socket IDs in room
  }
  ```

## Project Configuration

### Client (Vite)

- **Port**: 5173 (default)
- **TypeScript**: Strict mode enabled
- **React Compiler**: Babel plugin enabled
- **ESLint**: Configured with React hooks plugin

### Server

- **Port**: 4000 (configurable via `.env`)
- **TypeScript**: Strict mode with ES2024 target
- **Module System**: ES Modules (type: "module")
- **CORS**: Enabled for all origins (development)

## Development Scripts

### Client

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server

```bash
npm run watch    # Compile TypeScript in watch mode
npm run dev      # Run with nodemon
npm run build    # Compile TypeScript
npm start        # Run compiled code
```

## Testing

GraphQL test queries are available in `server/test/graphql/test_queries.graphql`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Notes

- MongoDB connection is currently commented out in `server/src/index.ts`
- Authentication system is not yet implemented
- The editor currently supports basic text input with placeholder functionality
- WebSocket rooms are hardcoded to "Test Room" for development

## Future Enhancements

- [ ] Implement operational transformation for conflict resolution
- [ ] Add user authentication with JWT
- [ ] Implement document sharing and permissions
- [ ] Add rich text formatting (bold, italic, lists)
- [ ] Deploy to AWS using S3, CloudFront, and EC2
- [ ] Add IndexedDB for offline support
- [ ] Implement document versioning and history
- [ ] Add user presence indicators
