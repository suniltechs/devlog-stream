# Devlog Stream Server 📡

The high-performance core of the Devlog ecosystem. This server acts as a real-time log aggregator and broadcaster, bridging the gap between your applications (producers) and the monitoring dashboard (consumers).

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5-lightgrey?style=flat-square&logo=express)
![Socket.io](https://img.shields.io/badge/Socket.io-4-white?style=flat-square&logo=socket.io)

---

## 🛠️ Core Functionality

- **🔄 Log Ingestion**: Accepts logs via **REST API** (`POST /log`) or **WebSocket** (`socket.emit('log', ...)`).
- **📢 Real-Time Broadcasting**: Instantly rebroadcasts incoming logs to all connected dashboard clients using the `new-log` event.
- **🛡️ Robustness**: Built-in error handling for port conflicts and connection drops.
- **🌐 Cross-Origin Support**: Fully configured CORS for seamless integration with frontend dashboards.

---

## 📡 API Reference

### WebSocket Events

#### Inbound (`log`)
Send a log to the server to be broadcast.
```json
{
  "type": "info | success | warning | error",
  "message": "The log message string",
  "source": "Optional service name"
}
```

#### Outbound (`new-log`)
The server emits this event to all connected clients when a new log is received.

---

### REST API

#### `POST /log`
Ingest a log via a standard HTTP request.

**Body:**
```json
{
  "type": "error",
  "message": "Database connection failed",
  "source": "auth-service",
  "timestamp": "2024-03-29T15:00:00Z"
}
```

**Response:** `202 Accepted`

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1.  **Navigate to the server directory**:
    ```bash
    cd devlog_ui_server
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the server**:
    ```bash
    npm start
    ```
    The server will start on `http://localhost:4000` (or the port specified in your `PORT` environment variable).

---

## 💎 Developed By

Part of the Devlog ecosystem developed by **[Sunil Sowrirajan](https://www.linkedin.com/in/sunil-sowrirajan-40548826b/)**.

---

## 📜 License

This project is private and for internal use only.
