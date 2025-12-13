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
---
## 🧪 **Postman Test Table – User Auth Flow**

| #                  | API Name                                     | Method  | Endpoint                     | Headers                                                                    | Body (JSON)                                                                                               | Expected Response                                                     |
| ------------------ | -------------------------------------------- | ------- | ---------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **🔹 AUTH MODULE** |                                              |         |                              |                                                                            |                                                                                                           |                                                                       |
| 1                  | **Register User**                            | `POST`  | `/api/v1/auth/register`      | `Content-Type: application/json`                                           | `json { "firstname": "Alice", "lastname": "Nguyen", "email": "alice@example.com", "password": "123456" }` | `200 OK` → trả về `{ "access_token": "...", "refresh_token": "..." }` |
| 2                  | **Login (Authenticate)**                     | `POST`  | `/api/v1/auth/authenticate`  | `Content-Type: application/json`                                           | `json { "email": "alice@example.com", "password": "123456" }`                                             | `200 OK` → trả về `{ "access_token": "...", "refresh_token": "..." }` |
| 3                  | **Wrong Password**                           | `POST`  | `/api/v1/auth/authenticate`  | `Content-Type: application/json`                                           | `json { "email": "alice@example.com", "password": "wrongpass" }`                                          | `403 Forbidden` hoặc `401 Unauthorized`                               |
| 4                  | **Refresh Token**                            | `POST`  | `/api/v1/auth/refresh-token` | `Authorization: Bearer <refresh_token>`                                    | —                                                                                                         | `200 OK` → trả về access_token mới                                    |
| **🔹 USER MODULE** |                                              |         |                              |                                                                            |                                                                                                           |                                                                       |
| 5                  | **Get Current User**                         | `GET`   | `/api/v1/users`              | `Authorization: Bearer <access_token>`                                     | —                                                                                                         | `200 OK` → `{ "name": "alice@example.com" }`                          |
| 6                  | **Change Password – Success**                | `PATCH` | `/api/v1/users`              | `Authorization: Bearer <access_token>`<br>`Content-Type: application/json` | `json { "currentPassword": "123456", "newPassword": "654321", "confirmationPassword": "654321" }`         | `200 OK`                                                              |
| 7                  | **Change Password – Wrong Current Password** | `PATCH` | `/api/v1/users`              | `Authorization: Bearer <access_token>`<br>`Content-Type: application/json` | `json { "currentPassword": "wrongpass", "newPassword": "654321", "confirmationPassword": "654321" }`      | `400 Bad Request`                                                     |
| 8                  | **Change Password – Mismatch Confirm**       | `PATCH` | `/api/v1/users`              | `Authorization: Bearer <access_token>`<br>`Content-Type: application/json` | `json { "currentPassword": "123456", "newPassword": "654321", "confirmationPassword": "999999" }`         | `400 Bad Request`                                                     |
| 9                  | **Unauthorized (Missing Token)**             | `GET`   | `/api/v1/users`              | *(none)*                                                                   | —                                                                                                         | `401 Unauthorized`                                                    |
| 10                 | **Forbidden (Invalid Role)**                 | `GET`   | `/api/v1/users`              | `Authorization: Bearer <JWT_OF_ADMIN>`                                     | —                                                                                                         | `403 Forbidden`                                                       |

---
# 🗂️ **Task List Module — `/api/v1/task-lists`**

## **API Endpoints**

| # | API Name                | Method | Endpoint                            | Body                           | Description           |
| - | ----------------------- | ------ | ----------------------------------- | ------------------------------ | --------------------- |
| 1 | **List Task Lists**     | GET    | `/api/v1/task-lists`                | —                              | Lấy toàn bộ Task List |
| 2 | **Create Task List**    | POST   | `/api/v1/task-lists`                | `{ "name": "Personal Tasks" }` | Tạo Task List mới     |
| 3 | **Get Task List By ID** | GET    | `/api/v1/task-lists/{task_list_id}` | —                              | Lấy Task List theo ID |
| 4 | **Update Task List**    | PUT    | `/api/v1/task-lists/{task_list_id}` | `{ "name": "Updated Name" }`   | Cập nhật Task List    |
| 5 | **Delete Task List**    | DELETE | `/api/v1/task-lists/{task_list_id}` | —                              | Xoá Task List         |
---
# 📝 **Task Module — `/api/v1/task-lists/{task_list_id}/tasks`**

## **API Endpoints**

| #  | API Name                    | Method | Endpoint                                            | Body                                                                     | Description                        |
| -- | --------------------------- | ------ | --------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------- |
| 6  | **List Tasks in Task List** | GET    | `/api/v1/task-lists/{task_list_id}/tasks`           | —                                                                        | Lấy danh sách task của 1 task list |
| 7  | **Create Task**             | POST   | `/api/v1/task-lists/{task_list_id}/tasks`           | `{ "title": "Do homework", "description": "Math", "status": "PENDING" }` | Tạo task mới trong task list       |
| 8  | **Get Task By ID**          | GET    | `/api/v1/task-lists/{task_list_id}/tasks/{task_id}` | —                                                                        | Lấy task theo ID                   |
| 9  | **Update Task**             | PUT    | `/api/v1/task-lists/{task_list_id}/tasks/{task_id}` | `{ "title": "Updated", "status": "DONE" }`                               | Cập nhật task                      |
| 10 | **Delete Task**             | DELETE | `/api/v1/task-lists/{task_list_id}/tasks/{task_id}` | —                                                                        | Xoá task                           |

---


### 💻 Frontend

**Tech Stack**
- ⚛️ **React 18**
- 🧱 **HTML5 + CSS3**
- ⚡ **Axios** for REST API communication.
- 🔄 **React Router** for navigation.
- 🕒 **Vanilla JavaScript + React Hooks** for timer logic.
- 📊 **Custom Chart Components (HTML Canvas / Chart.js)** for data visualization.

**Key Features**
- Simple, clean, and lightweight React UI (no UI framework).
- Task Dashboard with CRUD operations connected to backend APIs.
- Focus Session Timer (Pomodoro-style).
- Weekly performance visualization using HTML Canvas or Chart.js.
- JWT-based authentication stored in browser localStorage.

**Directory Structure**
