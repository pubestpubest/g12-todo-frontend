# G12 Todo Frontend

A modern React-based frontend application for managing and fetching todo tasks. Built with TypeScript, Vite, and styled with Pico CSS for a clean, accessible user interface.

## 🚀 Features

- **Task Fetching**: Retrieve task details by ID with real-time API integration
- **Modern UI**: Clean and responsive interface using Pico CSS framework
- **TypeScript**: Full type safety for better development experience
- **Modal Interface**: Elegant task display in modal windows
- **Error Handling**: Comprehensive error states and user feedback
- **Docker Support**: Containerized deployment with Nginx
- **Development Tools**: ESLint configuration and hot reload

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **Styling**: Pico CSS 2.1.1
- **HTTP Client**: Axios 1.11.0
- **Package Manager**: pnpm
- **Container**: Docker with Nginx
- **Linting**: ESLint with React plugins

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Docker** and **Docker Compose** (for containerized deployment)

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd g12-todo-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:5173`

### Production Setup with Docker

1. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   PROJECT_NAME=g12-todo
   NGINX_PROXY=http://g12-todo-backend:3000
   NGINX_PORT=5173
   ```

2. **Create the external network** (if not exists)

   ```bash
   docker network create g12-todo-net
   ```

3. **Build and run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
g12-todo-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── TaskModal.tsx   # Task display modal
│   │   └── index.ts        # Component exports
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── Type.ts             # TypeScript type definitions
│   └── main.tsx            # Application entry point
├── docker-compose.yaml     # Docker Compose configuration
├── Dockerfile              # Docker build instructions
├── nginx.conf              # Nginx configuration
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## 🎯 Usage

1. **Fetch a Task**: Enter a task ID in the input field and click "Fetch Task" or press Enter
2. **View Task Details**: Task information will be displayed in a modal window
3. **Error Handling**: Invalid task IDs or network errors will show appropriate error messages

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build locally
- `pnpm lint` - Run ESLint to check code quality

## 🌐 API Integration

The application integrates with a backend API to fetch task data:

- **Endpoint**: `/api/v1/tasks/{taskId}`
- **Method**: GET
- **Response**: Task object with status, message, and data

### Task Data Structure

```typescript
interface Task {
  status: string;
  message: string;
  data: {
    taskId: number;
    title: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updateAt: Date;
  };
}
```

## 🐳 Docker Configuration

The application uses a multi-stage Docker build:

1. **Builder Stage**: Uses Node.js Alpine to install dependencies and build the application
2. **Runner Stage**: Uses Nginx Alpine to serve the built application

### Environment Variables

- `PROJECT_NAME`: Name of the project (used for container naming)
- `NGINX_PROXY`: Backend API proxy URL
- `NGINX_PORT`: Port for the frontend application

## 🔒 Security

- Environment variables are properly managed and excluded from version control
- API calls are made through a proxy configuration
- Input validation is implemented for task IDs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in the `.env` file or stop other services using port 5173
2. **Docker network issues**: Ensure the external network `g12-todo-net` exists
3. **API connection errors**: Verify the backend service is running and accessible

### Development Tips

- Use the browser's developer tools to inspect network requests
- Check the console for any JavaScript errors
- Verify environment variables are properly set

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.
