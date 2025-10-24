# AltShift - Mini Docs Editor

AltShift is a lightweight, real-time collaborative rich-text editor built with TypeScript, Quill, and Socket.IO. It supports multi-user document editing with WebSocket-based synchronization and MongoDB persistence. The project is deployed on AWS for scalability and reliability, leveraging free-tier services for cost-effective hosting.

This README provides an overview of the architecture, required libraries, and instructions for setting up the client, server, and AWS deployment.

## Architecture Overview

The application is divided into client-side (frontend) and server-side (backend) components, with some features planned for future implementation. The client uses Quill for the editor UI and Socket.IO for real-time collaboration, while the server handles WebSocket syncing and MongoDB persistence. AWS services host the app and backend for production-grade scalability.

## Client-Side Dependencies

| Library                             | Purpose                                                                        | Install Command                                             |
| ----------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Quill (quill)                       | Builds the rich-text editor UI.                                                | `npm install quill`                                         |
| Socket.IO Client (socket.io-client) | Enables real-time collaboration via WebSocket.                                 | `npm install socket.io-client @types/socket.io-client`      |
| React (react, react-dom)            | Renders the editor UI and manages components (required for Quill integration). | `npm install react react-dom @types/react @types/react-dom` |

## Server-Side Dependencies

| Library                   | Purpose                                          | Install Command                      |
| ------------------------- | ------------------------------------------------ | ------------------------------------ |
| Socket.IO (socket.io, ws) | Runs the WebSocket server for real-time updates. | `npm install socket.io ws @types/ws` |
| MongoDB Driver (mongodb)  | Connects the server to MongoDB for persistence.  | `npm install mongodb @types/mongodb` |
| Express.js (express)      | Hosts the WebSocket server and API endpoints.    | `npm install express @types/express` |

## Deferred Features (Planned)

- **Awareness Handling**: User presence (cursors/avatars) with Socket.IO events.
- **Offline Support**: Local edit queuing with IndexedDB.
- **Authentication & Room Management**: Secure access with jsonwebtoken.

## AWS Deployment

AltShift leverages AWS Free Tier services for hosting and scaling. Follow these steps to deploy:

### Frontend Hosting:

1. Build the React app: `npm run build`.
2. Upload the `dist/` folder to an S3 bucket with static website hosting enabled: `aws s3 sync dist/ s3://your-bucket`.
3. Configure CloudFront as a CDN and invalidate the cache after updates: `aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"`.

### Backend Deployment:

1. Launch a t3.micro EC2 instance (free tier eligible).
2. Install Node.js, Express, and Socket.IO on the instance.
3. Connect to AWS DocumentDB (MongoDB-compatible) using the MongoDB driver.
4. Expose the WebSocket port (e.g., 1234) via EC2 security group rules.
