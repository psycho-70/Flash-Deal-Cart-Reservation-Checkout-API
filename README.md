# Flash Deal Cart Reservation & Checkout API

A backend API for managing flash deal product reservations with Redis-based stock locking and MongoDB for persistent storage.

## Tech Stack backend

- **Node.js** with Express
- **MongoDB** (Mongoose) - Permanent product stock and order storage
- **Redis** - Reservation management with TTL-based auto-expiry
- **express-rate-limit** - Basic rate limiting

### Frontend
- **Next.js** – Frontend framework
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Utility-first CSS framework
- **Fetch API** – API communication


## How to Start

1. **Prerequisites:**
   - Node.js installed
   - MongoDB running on `localhost:27017`
   - Redis running on `localhost:6379`

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```
   Or with nodemon:
   ```bash
   npx nodemon server.js
   ```

4. **Server runs on:** `http://localhost:5000`

## API Endpoints

### Products

- `POST /api/products` - Create a product
  ```json
  {
    "name": "Product Name",
    "sku": "SKU123",
    "stock": 200,
    "price": 99.99
  }
  ```

- `GET /api/products/:productId/status` - Get product stock status
  Returns: `totalStock`, `reservedStock`, `availableStock`

### Cart (Reservations)

- `POST /api/cart/reserve` - Reserve a single product
  ```json
  {
    "userId": "user123",
    "productId": "productId",
    "quantity": 2
  }
  ```

- `POST /api/cart/reserve-multiple` - Reserve multiple products (transactional)
  ```json
  {
    "userId": "user123",
    "items": [
      { "productId": "id1", "quantity": 2 },
      { "productId": "id2", "quantity": 1 }
    ]
  }
  ```

- `POST /api/cart/cancel` - Cancel a reservation
  ```json
  {
    "userId": "user123",
    "productId": "productId"
  }
  ```

### Checkout

- `POST /api/checkout` - Finalize purchase
  ```json
  {
    "userId": "user123",
    "items": [
      { "productId": "id1", "quantity": 2 },
      { "productId": "id2", "quantity": 1 }
    ]
  }
  ```

## How Reservation Lock Logic Works

1. **Reservation Process:**
   - When a user reserves a product, Redis stores: `reservation:userId:productId` with TTL of 10 minutes (600 seconds)
   - Stock availability is calculated as: `totalStock - totalReservedStock`
   - `totalReservedStock` is computed by scanning all `reservation:*:productId` keys in Redis

2. **Concurrency Prevention:**
   - Redis operations are atomic
   - Stock checks happen before reservation creation
   - Multiple SKU reservations use transaction-like rollback (if one fails, all are cancelled)

3. **Overselling Prevention:**
   - Always checks available stock before reserving
   - Available = MongoDB stock - sum of all Redis reservations
   - Atomic Redis operations prevent race conditions

## How Expiration Works

- **Redis TTL:** Each reservation key has a 10-minute expiration (600 seconds)
- **Automatic Release:** When TTL expires, Redis automatically deletes the key
- **Stock Return:** Expired reservations automatically free up stock (no manual cleanup needed)
- **Checkout Validation:** Checkout verifies reservation exists before processing

## Notes

- Reservations expire automatically after 10 minutes via Redis TTL
- Stock is permanently reduced only at checkout
- Rate limiting: 100 requests per 15 minutes per IP
- All endpoints include input validation and error handling
