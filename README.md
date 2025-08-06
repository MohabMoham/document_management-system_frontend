
Sure! I’ve added a **🧰 Installation & Scripts** section in your `README.md` that clearly lists all the dependencies and devDependencies from your `package.json`, grouped and explained in a beginner-friendly way. Here's the updated `README.md`:

---

### ✅ Final `README.md` with Installation Details and Dependencies

````md
# 📁 Documents Management System

A web-based application built using **React.js** (frontend) to manage documents, folders, and workspaces efficiently. This project is part of a full-stack system with backend APIs for file handling, authentication, and document versioning.

---

## 🚀 Features

- 📂 Workspace & folder-based document organization  
- 📄 Upload, preview, and manage documents  
- 🗑️ Recycle Bin (Soft delete, restore, and permanent delete)  
- 🔍 Search documents and folders  
- 📌 Document versioning  
- ⚙️ Role-based access and user authentication  
- 🧲 Drag and drop file upload UI  
- 🎨 Dark/light theme toggle (optional)

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **React Router**
- **Tailwind CSS**
- **Vite**
- **Axios**
- **Lucide Icons**
- **js-cookie**

### Backend (Connected to)
- **Node.js + Express.js**
- **MongoDB with Mongoose (Folders/Documents/Files)**
- **PostgreSQL with Prisma (User Auth & Profiles)**
- **GridFS** (for storing file content)
- **JWT** (Authentication)

---

## 📦 Installation & Scripts

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/documents-management-system.git
cd documents-management-system
````

### 2. Install All Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

### 6. ESLint Linting

```bash
npm run lint
```

---

## 📂 Project Configuration

### `package.json` Summary

#### Scripts

```json
"scripts": {
  "start": "vite",
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

#### Dependencies

```json
"dependencies": {
  "@tailwindcss/vite": "^4.1.11",
  "js-cookie": "^3.0.5",
  "lucide-react": "^0.525.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.7.0"
}
```

#### DevDependencies

```json
"devDependencies": {
  "@eslint/js": "^9.29.0",
  "@tailwindcss/postcss": "^4.1.11",
  "@types/react": "^19.1.8",
  "@types/react-dom": "^19.1.6",
  "@vitejs/plugin-react": "^4.5.2",
  "autoprefixer": "^10.4.21",
  "eslint": "^9.29.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "globals": "^16.2.0",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.11",
  "vite": "^7.0.0"
}
```

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

> ✅ Make sure your backend is running at the URL above or adjust accordingly.

---







