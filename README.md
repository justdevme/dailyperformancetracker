# 🚀 Daily Performance Tracker

> A full-stack productivity app that helps users **track daily tasks, focus sessions, and personal performance scores** — built with **Spring Boot, PostgreSQL, Docker, and React**.

---

## 📋 Overview

**Daily Performance Tracker** allows users to:
- Register and log in securely using **JWT Authentication**.
- Manage their daily **tasks** and **focus sessions**.
- Calculate a **daily performance score** (0–100) based on productivity metrics.
- View **weekly performance charts** for self-improvement insights.

This project is designed as a multi-phase full-stack application for both learning and real-world use.

---

## 🧩 Tech Stack

### 🖥️ Backend
- **Spring Boot 3.3.4**
- **Spring Security (JWT)**
- **Spring Data JPA**
- **PostgreSQL**
- **Lombok**
- **Swagger (OpenAPI Docs)**
- **Docker Compose**

### 💻 Frontend
- **React (Vite or CRA)**
- **React Router**
- **Bootstrap / CSS**
- **Fetch API / Axios** for REST calls

---

## ⚙️ Backend Features

| Feature | Endpoint | Description |
|----------|-----------|-------------|
| 🔐 Register | `POST /api/v1/auth/register` | Create new user |
| 🔑 Login | `POST /api/v1/auth/authenticate` | Authenticate & return JWT |
| 👤 Profile | `GET /api/v1/users/me` | Get current user info |
| ✅ Tasks CRUD | `GET/POST/PUT/DELETE /api/v1/tasks` | Manage daily tasks |
| ⏱️ Focus Sessions | `POST /api/v1/focus/start`, `/stop` | Track focused work time |
| 📊 Daily Metrics | `GET /api/v1/metrics/day?date=YYYY-MM-DD` | Get score + stats |
| 📅 Weekly Metrics | `GET /api/v1/metrics/week?start=YYYY-MM-DD` | Weekly performance data |

---

## 🔧 How to Run (Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/justdevme/dailyperformancetracker.git
cd dailyperformancetracker
