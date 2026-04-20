# API Documentation

## Base URL
```
https://v0-christmas-tree-farm-app.vercel.app
```

## Authentication

Admin endpoints require a valid session cookie obtained through the login endpoint.

### Login
**POST** `/api/admin/login`

Login with admin credentials to establish a session.

**Request body:**
```json
{
  "email": "admin@example.com",
  "password": "secure-password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Bejelentkezés sikeres",
  "user": {
    "id": 1,
    "email": "admin@example.com"
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "error": "Hibás email vagy jelszó"
}
```

**Errors:**
- `400` - Invalid credentials format
- `401` - Invalid email or password
- `403` - Forbidden origin (CSRF protection in production)

---

## Reservations

### Get All Reservations
**GET** `/api/admin/reservations`

Retrieve all reservations (admin only).

**Query Parameters:**
- `sortBy` (optional): Field to sort by (`name`, `email`, `date`, `status`, `createdAt`)
- `sortOrder` (optional): `asc` or `desc` (default: `desc`)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+36201234567",
      "date": "2024-12-15",
      "trees": 2,
      "status": "TREE_TAGGED",
      "treeNumbers": "12, 13",
      "paidTo": "János",
      "createdAt": "2024-11-01T10:30:00Z",
      "updatedAt": "2024-11-02T15:45:00Z"
    }
  ],
  "count": 42
}
```

**Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### Get Single Reservation
**GET** `/api/admin/reservations/[id]`

Retrieve a specific reservation by ID.

**Path Parameters:**
- `id` (required): Reservation ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+36201234567",
    "date": "2024-12-15",
    "trees": 2,
    "status": "TREE_TAGGED",
    "treeNumbers": "12, 13",
    "paidTo": "János",
    "createdAt": "2024-11-01T10:30:00Z",
    "updatedAt": "2024-11-02T15:45:00Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Foglalás nem található"
}
```

---

### Update Reservation
**PATCH** `/api/admin/reservations/[id]`

Update a reservation with validation.

**Path Parameters:**
- `id` (required): Reservation ID

**Request body (partial update):**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+36201234567",
  "date": "2024-12-16",
  "trees": 3,
  "status": "PICKED_UP_PAID",
  "treeNumbers": "12, 13, 14",
  "paidTo": "Sanyi"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+36201234567",
    "date": "2024-12-16",
    "trees": 3,
    "status": "PICKED_UP_PAID",
    "treeNumbers": "12, 13, 14",
    "paidTo": "Sanyi",
    "createdAt": "2024-11-01T10:30:00Z",
    "updatedAt": "2024-11-03T16:20:00Z"
  }
}
```

**Response (400 - Validation Error):**
```json
{
  "success": false,
  "error": "A következő fa sorszámok már foglaltak: 12 (Kiss János), 14 (Kovács Mária)"
}
```

**Validation Rules:**
- `status: TREE_TAGGED | CUT | PICKED_UP_PAID` requires `treeNumbers`
- `status: PICKED_UP_PAID` requires both `treeNumbers` and `paidTo`
- `treeNumbers` must contain unique positive integers (comma-separated)
- `paidTo` must be "János" or "Sanyi"
- Tree numbers cannot be already assigned to another reservation

**Errors:**
- `400` - Validation failed
- `401` - Unauthorized
- `404` - Reservation not found

---

### Delete Reservation
**DELETE** `/api/admin/reservations/[id]`

Delete a reservation permanently.

**Path Parameters:**
- `id` (required): Reservation ID

**Response (200):**
```json
{
  "success": true,
  "message": "Foglalás törölve"
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Foglalás nem található"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - Reservation not found

---

### Create Reservation (Public)
**POST** `/api/reservations`

Create a new reservation from the public booking form.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+36201234567",
  "date": "2024-12-15",
  "trees": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+36201234567",
    "date": "2024-12-15",
    "trees": 2,
    "status": "PENDING",
    "createdAt": "2024-11-04T12:00:00Z"
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Invalid request body"
}
```

---

### Get Availability (Public)
**GET** `/api/reservations`

Get reservation counts for all dates to show availability.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "2024-12-15": {
      "reserved": 15,
      "available": true
    },
    "2024-12-16": {
      "reserved": 28,
      "available": true
    },
    "2024-12-17": {
      "reserved": 35,
      "available": false
    }
  }
}
```

---

## Reservation Status Flow

```
PENDING (initial) 
  ↓
TREE_TAGGED (admin marks trees)
  ↓
CUT (admin confirms cut)
  ↓
PICKED_UP_PAID (customer picked up and paid)
```

**Status Requirements:**
- `TREE_TAGGED`: Requires `treeNumbers`
- `CUT`: Requires `treeNumbers`
- `PICKED_UP_PAID`: Requires `treeNumbers` AND `paidTo`

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (not logged in or invalid session)
- `403` - Forbidden (CSRF protection or permission denied)
- `404` - Not found
- `500` - Server error

---

## Rate Limiting

Currently no rate limiting is enforced. Consider adding rate limiting for production deployments.

---

## CORS

CORS is enforced in production. The app checks that the request origin matches the host header to prevent CSRF attacks.

In development (`NODE_ENV !== "production"`), CORS checks are disabled for easier testing.
