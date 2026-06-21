# Medium Clone

> A feature-rich clone of Medium, a popular blogging and publishing platform. This project is currently **under development** and not yet live.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

Medium Clone is an attempt to recreate the core functionality of Medium, a publishing platform where writers can share their stories. This project aims to provide a seamless user experience for reading, writing, and discovering articles.

**Status:** 🚧 Under Development - Not Live

## ✨ Features

### Implemented
- [x] User Authentication (Sign up, Login, Logout)
- [ ] Create, Read, Update, Delete Articles
- [x] User Profiles
- [ ] Article Search & Filtering
- [ ] Responsive Design
- [x] Rich Text Editor

### Planned
- [ ] Comments & Discussions
- [ ] Like/Clap System
- [x] Following System
- [ ] Recommendations Engine
- [ ] Dark Mode
- [ ] Social Sharing

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **UI Icons:** React Icons
- **Animations:** Motion

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js (Full-stack)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Password Hashing:** Bcryptjs

### Tools & Services
- **Version Control:** Git & GitHub
- **Environment:** Node.js, npm
- **Database Driver:** pg

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- npm or yarn
- Git
-  PostgreSQL

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TrickyNoodle/medium-clone.git
   cd medium-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the backend directory
        > Note: Use `.env.example` as reference
   - Add necessary environment variables (database URL, Auth Provider secret and id)
    - Run following once `.env` is set
        ```bash
        #Instantiate the Database
        npx prisma db push

        #Generate Prisma Client
        npx prisma generate
        ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

## 💻 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Sign up for a new account
3. Explore the platform:
   - Read articles
   - Write new articles
   - Edit your profile
   - Search for content

## 📁 Project Structure
```bash
app/              # Routes & pages
components/       # Reusable UI
prisma/           # Database schema
public/           # Static assets

auth.ts           # NextAuth config
store.ts          # Global state
package.json      # Dependencies
```


## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note:** This project is for educational purposes and is currently under development. Not all features are implemented.
