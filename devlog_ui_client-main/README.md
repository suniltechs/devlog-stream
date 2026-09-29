# Devlog Stream Dashboard ⚡

A high-performance, real-time log monitoring dashboard designed to provide instant visibility into your stream performance. Built with **Next.js 16**, **Tailwind CSS**, and **Socket.io**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![Socket.io](https://img.shields.io/badge/Socket.io-4-white?style=flat-square&logo=socket.io)

---

## 🚀 Key Features

- **⚡ Real-Time Monitoring**: Instant log delivery via WebSocket connection.
- **📊 Live Metrics Bar**: Track **Logs per Minute (Velocity)**, **Critical Error Counts**, and **Stream Stability** in real-time.
- **🎯 Granular Filtering**: Isolated views for **Info**, **Success**, **Warning**, and **Error** logs.
- **🔍 Powerful Search**: Fast full-text search across all streaming logs with highlight support.
- **💎 Premium UI/UX**: Modern glassmorphic design with custom scrollbars, sleek SVG icons, and a high-performance "Command Center" feel.
- **📑 Log History**: Automatic buffering and scrolling with a "Pause/Resume" feature to handle high-frequency streams.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **State Management**: React Hooks (`useMemo`, `useCallback`, `useSocket`)
- **Real-Time Communication**: [Socket.io-client](https://socket.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: Custom SVG icons for high-performance rendering.

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- Local backend server running (typically on port 4000)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/suniltechs/devlog_ui_client.git
    cd devlog_ui_client
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup environment variables**:
    Create a `.env.local` file:
    ```bash
    NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
    ```

4.  **Run development server**:
    ```bash
    npm run dev
    ```

---

## 💎 Developed By

Developed with ❤️ by **[Sunil Sowrirajan](https://www.linkedin.com/in/sunil-sowrirajan-40548826b/)**.

---

## 📜 License

This project is private and for internal use only.
