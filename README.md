# money trail | an expense tracker API

A secure and extensible Expense Tracker API built with **NestJS**, **Prisma ORM**, and **PostgreSQL**. This backend service allows users to manage personal expenses with features such as authentication, filtering, and full CRUD operations.


## Features

- 🔐 **User Authentication**
  - Sign up and log in with JWT-based authentication
  - Secure password hashing
    
- 📊 **Expense Management**
  - Create, update, and delete expenses
  - View expenses filtered by:
    - Past week
    - Past month
    - Last 3 months
    - Custom date range
    - Min and max cost of expenses
      
- 🧑‍💼 **User Isolation**
  - Each user has their own private set of expenses
- ⚙️ **Tech Stack**
  - **NestJS** - Scalable Node.js framework
  - **Prisma ORM** - Type-safe database access
  - **PostgreSQL** - Relational database
  - **JWT** - JSON Web Token for authentication

---

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/adedapo0x/moneyTrail.git
cd moneyTrail
```
2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Create a `.env` file in the root directory with the following variables:
```
POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
DATABASE_URL
JWT_ACCESS_TOKEN_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRY_TIME
JWT_REFRESH_TOKEN_EXPIRY_TIME, JWT_REFRESH_TOKEN_SECRET_KEY
```

4. Set up the database:
```bash
npx prisma migrate dev
# or
yarn prisma migrate dev
```

## Running the Application

### Development Mode

```bash
npm run start:dev
# or
yarn start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
# or
yarn build
yarn start:prod
```

The API will be available at `http://localhost:3000` by default.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and receive JWT token |
| POST | `/auth/refresh` | Used to generate new access tokens |
| POST | `/auth/logout` | Log out the user |


### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses for logged in user |
| POST | `/expenses` | Create a new expense |
| PATCH | `/expenses/:id` | Update existing expense |
| DELETE | `/expenses/:id` | Delete an expense |

### Filtering Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses?filter=past-week` | Get expenses from past week |
| GET | `/expenses?filter=past-month` | Get expenses from past month |
| GET | `/expenses?filter=last-3-months` | Get expenses from past 3 months |
| GET | `/expenses?filter=last-6-months` | Get expenses from the past 6 months |
| GET | `/expenses?filter/custom?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Get expenses for custom date range |
| GET | `/expenses?minAmount=2000&maxAmount=10000` | Get expenses within that range |
