# 📅 ConfHub – Conference Management System

ConfHub is a **modern web-based platform** for managing academic and professional conferences.
It streamlines the entire conference lifecycle, from **paper submission** to **review management** and **session scheduling**, ensuring a smooth and professional experience for organizers, reviewers, and participants.

---

## 🚀 Features

* **User Roles & Authentication**

  * Organizer, Sub-Organizer, Reviewer, Author
  * Secure login & registration
  * Social login (SSO) support
  * Password reset functionality

* **Conference Management**

  * Create & manage conferences
  * Approve or reject conference requests
  * Assign sub-organizers
  * Manage reviewers and review requests

* **Paper Submission & Review**

  * Authors can submit papers
  * Reviewers can review assigned papers
  * Review requests can be approved/rejected by organizers

* **Dashboard & Analytics**

  * Role-specific dashboards
  * Insights into conference statistics
  * Ongoing and upcoming conference tracking

* **Responsive Design**

  * Built with **React**, **Tailwind CSS**, and **React Icons**
  * Mobile-friendly navigation & layouts

---

## 🛠️ Tech Stack

**Frontend:**

* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) for fast development & hot module replacement
* [Tailwind CSS](https://tailwindcss.com/) for modern responsive design
* [React Router](https://reactrouter.com/) for navigation
* [React Icons](https://react-icons.github.io/react-icons/) for scalable vector icons
* [Axios](https://axios-http.com/) for API calls

**Backend:**

* [Strapi](https://strapi.io/) (Headless CMS) for managing conference data
* REST API integration with authentication and role-based access

**Database:**

* [PostgreSQL](https://www.postgresql.org/) (or other supported DBs via Strapi)

---

## 📂 Project Structure

```
confhub/
│
├── src/
│   ├── assets/           # Images, icons, and static files
│   ├── components/       # Reusable React components
│   ├── pages/            # Page-level components
│   ├── styles/           # CSS/Tailwind styles
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
│
├── public/               # Static public files
├── package.json          # Dependencies & scripts
└── vite.config.js        # Vite configuration
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ehtishamanwar1122/confhub.git
cd confhub
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

This will start the app at:
**Frontend:** `http://localhost:5173`
**Backend (Strapi):** `http://localhost:1337`

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with:

```
VITE_API_URL=http://localhost:1337
```

---

## 📸 Screenshots

| Home Page                            | Dashboard                                 |
| ------------------------------------ | ----------------------------------------- |
| ![Home Page](./screenshots/home.png) | ![Dashboard](./screenshots/dashboard.png) |

---

## 📌 Roadmap

* [ ] Implement certificate verification via blockchain
* [ ] Add event scheduling calendar
* [ ] Enable real-time notifications
* [ ] Integrate payment system for registrations

---

## 🤝 Contributing

We welcome contributions! Please fork the repo and submit a pull request with your changes.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---
