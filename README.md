## BuySell@IIITH

## Brief Problem Description

Whatscap has introduced a new policy imposing a **10% tax on total profits** generated from Buy-Sell groups. To **avoid this taxation**, we need a **dedicated marketplace** exclusively for the **IIIT Community** where students and faculty can buy and sell items without relying on external platforms.

This project aims to build a **MERN-stack web application** that allows IIIT members to **list, browse, and purchase** products seamlessly. The platform will provide **secure authentication, item management, a cart system, order processing, and review features** while ensuring privacy and scalability.

The platform will support:
- **Role-based functionality**: Users can act as both buyers and sellers.
- **Secure transactions**: Implementing **hashed OTP-based verification**.
- **IIIT-exclusive access**: Only IIIT emails can register.
- **Search and filter options**: To enhance user experience.

By creating this **independent marketplace**, we eliminate reliance on Whatscap groups and **avoid unnecessary taxation**, ensuring a **cost-effective** and **user-friendly** buying/selling experience.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Nodemon](https://www.npmjs.com/package/nodemon) (for backend development)

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/KRishika01/Buy_Sell_IIITH.git
cd Buy_Sell_IIITH
npm install
```

### Running the Project
#### Frontend

Start the frontend development server:

```sh
npm run dev
```

Open http://localhost:5173 in your browser.

#### Backend

Start the backend servers:
```sh
nodemon buy_sell.js
nodemon chatbot.js
```
