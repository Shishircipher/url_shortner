# 🔗 URL Shortener Backend with PocketBase

This project is a simple backend for a URL shortener. It turns long URLs into short codes and stores them in a local PocketBase database. You can also check recent URLs, stats, and more.

---

## 🚀 Features

* Create short URLs with unique short codes
* View recent URLs
* Track active (non-expired) URLs
* Support batch URL shortening
* Auto-expiration support (e.g., 10 days from creation)

---

## 📦 Installation

```bash
npm install
```

---

## 🧠 Tech Used

* **Node.js + Express** – Web server
* **PocketBase** – Lightweight local database

---

## 🛠️ Setup Instructions

### 1. Download & Run PocketBase

Download the latest PocketBase binary from:
👉 [https://pocketbase.io/docs/](https://pocketbase.io/docs/)

Then run it:

```bash
./pocketbase serve
```

It will run on: [http://127.0.0.1:8090](http://127.0.0.1:8090)

---

### 2. Create a Super Admin

Open the PocketBase Admin UI:
👉 [http://127.0.0.1:8090/\_/](http://127.0.0.1:8090/_/)

Then:

1. Register or log in as a super admin.
2. Click `+ New Collection`.
3. Name it `urls`.
4. Add the following fields:

   * `short_code` → **Text**
   * `original_url` → **Text**
   * `expires_at` → **DateTime**

---

### 3. Update Collection Rules

To allow public creation of short links, remove superuser-only restriction:

* Go to the **Rules** tab for the `urls` collection
* Set:

  * **Create Rule:** `true`
  * **List Rule:** `true`
  * **View Rule:** `true`
  * Leave **Update** and **Delete** empty (or restrict as needed)
* Click **Save**

---

### 4. Start the Server

```bash
node server.js
```

Server will run on [http://localhost:3000](http://localhost:3000)

---

## 📬 API Endpoints

### `POST /shorten`

Create a short URL.

```json
{
  "original_url": "https://example.com"
}
```

Returns:

```json
{
  "short_code": "aB3xYz",
  "expires_at": "2025-05-26T12:00:00Z"
}
```

---

### `GET /urls/recent`

Get 5 most recent short URLs.

---

### `GET /stats/active`

Get count of active short URLs grouped by creation date.

---

### `POST /urls/batch`

Shorten multiple URLs in one request.

```json
{
  "urls": [
    "https://example.com/1",
    "https://example.com/2"
  ]
}
```

---

