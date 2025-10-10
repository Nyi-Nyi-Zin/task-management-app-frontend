# Task Management Web App Frontend

A React + TypeScript web application for managing boards, lists, and tasks with a clean UI using **shadcn/ui**, featuring light/dark theme support and pagination.  

## 🎯 Project Overview

The Task Management Frontend allows users to create boards, organize tasks in lists, and manage projects efficiently. The app includes protected routes for authenticated users, responsive design, and modern UI components.  

### Key Features

- **Board & List Management**: Create and organize boards and lists  
- **Task Cards**: Create, edit, delete, and move tasks  
- **Pagination**: Efficient handling of large task lists  
- **Light/Dark Theme**: Toggle between themes seamlessly  
- **Protected Routes**: Access restricted to authenticated users  
- **Upcoming Features**: Search & filtering for tasks and boards  

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript  
- **Build Tool**: Vite 5.4.19  
- **UI Library**: shadcn/ui  
- **Styling**: Tailwind CSS 3.4.17  
- **State Management**: Redux Toolkit + React Redux  
- **Data Fetching**: TanStack React Query + Axios  
- **Form Handling**: React Hook Form + Zod validation  
- **Routing**: React Router DOM 6.30.1  
- **Authentication**: JWT-based with refresh token support  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+  
- Yarn or npm  
- Modern web browser  

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd task-management-app-frontend
```
2. **Install dependencies**

```bash
npm install
```
3. **Environment Setup**
 Create a .env file in the root directory:
```bash
VITE_API_URL=http://localhost:4000/
```

4. **Start development server**
```bash
npm run dev
```

 # 📱 Core Features
1. **Boards & Lists**

- Board Creation: Organize projects as boards

- List Management: Add, edit, and reorder lists

- Task Cards: Add, edit, delete, and move tasks within lists

- Pagination: Navigate large task lists easily

2. **Authentication & Protected Routes**

- Login / Signup: JWT-based authentication

- Route Protection: Access restricted to authenticated users

3. **Light & Dark Theme**

- Toggle between light and dark modes seamlessly using shadcn/ui + Tailwind

4. **Upcoming Features**

- Search & Filtering: Quickly locate tasks and boards

**🎨 UI/UX Features**

- shadcn/ui: Modern, reusable components

- Tailwind CSS: Utility-first styling

- Responsive Design: Optimized for desktop and mobile

- Component Architecture: Tables, forms, modals, and layout components

**🔧 Development Tools**

- ESLint & Prettier: Code quality and formatting

- TypeScript: Strong typing

- Husky: Git hooks for linting and formatting

- Vite: Fast dev server and build tool


**Build for production**

- npm run build

🤝 Contributing

- Clone the repository

- Create a feature branch

- Make changes

- Submit a pull request

Code Standards

- TypeScript: Strict type checking

- ESLint & Prettier: Enforced formatting

- Conventional Commits: Standard commit messages

**Built with ❤️ using React, TypeScript, shadcn/ui, and modern web technologies**
