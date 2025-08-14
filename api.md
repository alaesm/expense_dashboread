# Admin API Documentation



## 🔐 Authentication

All admin APIs require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Admin Roles
- **super_admin**: Can create, update, delete other admins + all admin permissions
- **admin**: Can view and manage users, update own profile

---

## 👑 Admin Management APIs



---

### 2. Admin Login

**Endpoint:** `POST /api/admin/login`  
**Description:** Authenticate admin and receive JWT token  
**Authentication:** None

**Request Body:**
```json
{
  "email": "admin@expenses.com",
  "password": "admin123456"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "admin_doc_id_123",
      "email": "admin@expenses.com",
      "name": "Super Administrator",
      "role": "super_admin",
      "isActive": true,
      "createdAt": "2025-08-14T01:35:00.000Z",
      "lastLogin": "2025-08-14T01:36:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiYWRtaW5fZG9jX2lkXzEyMyIsImVtYWlsIjoiYWRtaW5AZXhwZW5zZXMuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNjk0NzM2NDAwLCJleHAiOjE2OTQ4MjI4MDB9.signature",
    "expiresIn": "24h"
  }
}
```

**Error Response (401):**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

### 3. Get Admin Profile

**Endpoint:** `GET /api/admin/profile`  
**Description:** Get current admin's profile information  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "id": "admin_doc_id_123",
    "email": "admin@expenses.com",
    "name": "Super Administrator",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2025-08-14T01:35:00.000Z",
    "lastLogin": "2025-08-14T01:36:00.000Z"
  }
}
```

---

### 4. Update Admin Profile

**Endpoint:** `PUT /api/admin/profile`  
**Description:** Update current admin's profile  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Admin Name",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "id": "admin_doc_id_123",
    "email": "admin@expenses.com",
    "name": "Updated Admin Name",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2025-08-14T01:35:00.000Z",
    "updatedAt": "2025-08-14T01:45:00.000Z",
    "lastLogin": "2025-08-14T01:36:00.000Z"
  }
}
```

---

### 5. Create New Admin

**Endpoint:** `POST /api/admin`  
**Description:** Create a new admin account (Super Admin only)  
**Authentication:** Required (Super Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin2@expenses.com",
  "password": "admin123456",
  "name": "Second Administrator",
  "role": "admin"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Admin created successfully",
  "data": {
    "id": "admin_doc_id_456",
    "email": "admin2@expenses.com",
    "name": "Second Administrator",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-08-14T02:00:00.000Z",
    "updatedAt": "2025-08-14T02:00:00.000Z",
    "lastLogin": null
  }
}
```

---

### 6. Get All Admins

**Endpoint:** `GET /api/admin`  
**Description:** Retrieve list of all admin accounts  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Admins retrieved successfully",
  "data": [
    {
      "id": "admin_doc_id_123",
      "email": "admin@expenses.com",
      "name": "Super Administrator",
      "role": "super_admin",
      "isActive": true,
      "createdAt": "2025-08-14T01:35:00.000Z",
      "lastLogin": "2025-08-14T01:36:00.000Z"
    },
    {
      "id": "admin_doc_id_456",
      "email": "admin2@expenses.com",
      "name": "Second Administrator",
      "role": "admin",
      "isActive": true,
      "createdAt": "2025-08-14T02:00:00.000Z",
      "lastLogin": null
    }
  ]
}
```

---

### 7. Get Admin by ID

**Endpoint:** `GET /api/admin/:id`  
**Description:** Get specific admin information by ID  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**
- `id` (string): Admin document ID

**Example:**
```
GET /api/admin/admin_doc_id_456
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Admin retrieved successfully",
  "data": {
    "id": "admin_doc_id_456",
    "email": "admin2@expenses.com",
    "name": "Second Administrator",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-08-14T02:00:00.000Z",
    "lastLogin": null
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Admin not found"
}
```

---

### 8. Update Admin by ID

**Endpoint:** `PUT /api/admin/:id`  
**Description:** Update specific admin account (Super Admin only)  
**Authentication:** Required (Super Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (string): Admin document ID

**Request Body:**
```json
{
  "name": "Updated Admin Name",
  "isActive": false,
  "role": "admin"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Admin updated successfully",
  "data": {
    "id": "admin_doc_id_456",
    "email": "admin2@expenses.com",
    "name": "Updated Admin Name",
    "role": "admin",
    "isActive": false,
    "createdAt": "2025-08-14T02:00:00.000Z",
    "updatedAt": "2025-08-14T02:30:00.000Z",
    "lastLogin": null
  }
}
```

---

### 9. Delete Admin by ID

**Endpoint:** `DELETE /api/admin/:id`  
**Description:** Delete specific admin account (Super Admin only)  
**Authentication:** Required (Super Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**
- `id` (string): Admin document ID

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Admin deleted successfully"
}
```

---

## 👥 User Management APIs

### 10. Get All Users

**Endpoint:** `GET /api/users`  
**Description:** Retrieve all users from Firebase Authentication  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters (Optional):**
- `page` (number): Page number for pagination
- `limit` (number): Number of users per page (max 100)

**Examples:**
```
GET /api/users
GET /api/users?page=1&limit=10
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "firebase_user_uid_123",
      "email": "user1@example.com",
      "name": "John Doe",
      "emailVerified": true,
      "photoURL": "https://example.com/photo.jpg",
      "phoneNumber": "+1234567890",
      "createdAt": "2025-08-01T10:00:00Z",
      "lastLogin": "2025-08-14T09:00:00Z",
      "isActive": true,
      "countryCode": "US",
      "currencyCode": "USD",
      "disabled": false
    },
    {
      "id": "firebase_user_uid_456",
      "email": "user2@example.com",
      "name": "Jane Smith",
      "emailVerified": true,
      "photoURL": null,
      "phoneNumber": null,
      "createdAt": "2025-08-05T14:30:00Z",
      "lastLogin": "2025-08-13T16:45:00Z",
      "isActive": true,
      "countryCode": "UK",
      "currencyCode": "GBP",
      "disabled": false
    }
  ],
  "count": 2
}
```

**Success Response with Pagination (200):**
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "firebase_user_uid_123",
      "email": "user1@example.com",
      "name": "John Doe"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 45,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 11. Get Users Count

**Endpoint:** `GET /api/users/count`  
**Description:** Get total number of users  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Users count retrieved successfully",
  "data": {
    "totalUsers": 1250
  }
}
```

---

### 12. Get User by ID

**Endpoint:** `GET /api/users/:id`  
**Description:** Get specific user information by Firebase UID  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**
- `id` (string): Firebase user UID

**Example:**
```
GET /api/users/firebase_user_uid_123
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User retrieved successfully",
  "data": {
    "id": "firebase_user_uid_123",
    "email": "user1@example.com",
    "name": "John Doe",
    "emailVerified": true,
    "photoURL": "https://example.com/photo.jpg",
    "phoneNumber": "+1234567890",
    "createdAt": "2025-08-01T10:00:00Z",
    "lastLogin": "2025-08-14T09:00:00Z",
    "isActive": true,
    "countryCode": "US",
    "currencyCode": "USD",
    "disabled": false
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

---

## 📊 Analytics APIs

### 13. Get User Analytics

**Endpoint:** `GET /api/users/analytics`  
**Description:** Get comprehensive user analytics including counts and top codes  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User analytics retrieved successfully",
  "data": {
    "totalUsers": 1250,
    "topCountryCodes": [
      {
        "countryCode": "US",
        "count": 450
      },
      {
        "countryCode": "UK",
        "count": 320
      },
      {
        "countryCode": "CA",
        "count": 280
      },
      {
        "countryCode": "AU",
        "count": 150
      },
      {
        "countryCode": "DE",
        "count": 50
      }
    ],
    "topCurrencyCodes": [
      {
        "currencyCode": "USD",
        "count": 520
      },
      {
        "currencyCode": "EUR",
        "count": 380
      },
      {
        "currencyCode": "GBP",
        "count": 290
      },
      {
        "currencyCode": "CAD",
        "count": 35
      },
      {
        "currencyCode": "AUD",
        "count": 25
      }
    ]
  }
}
```

---

### 14. Get Most Used Country Codes

**Endpoint:** `GET /api/users/analytics/country-codes`  
**Description:** Get most frequently used country codes by users  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters (Optional):**
- `limit` (number): Number of results to return (default: 10)

**Example:**
```
GET /api/users/analytics/country-codes?limit=5
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Most used country codes retrieved successfully",
  "data": [
    {
      "countryCode": "US",
      "count": 450
    },
    {
      "countryCode": "UK",
      "count": 320
    },
    {
      "countryCode": "CA",
      "count": 280
    },
    {
      "countryCode": "AU",
      "count": 150
    },
    {
      "countryCode": "DE",
      "count": 50
    }
  ]
}
```

---

### 15. Get Most Used Currency Codes

**Endpoint:** `GET /api/users/analytics/currency-codes`  
**Description:** Get most frequently used currency codes by users  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters (Optional):**
- `limit` (number): Number of results to return (default: 10)

**Example:**
```
GET /api/users/analytics/currency-codes?limit=5
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Most used currency codes retrieved successfully",
  "data": [
    {
      "currencyCode": "USD",
      "count": 520
    },
    {
      "currencyCode": "EUR",
      "count": 380
    },
    {
      "currencyCode": "GBP",
      "count": 290
    },
    {
      "currencyCode": "CAD",
      "count": 35
    },
    {
      "currencyCode": "AUD",
      "count": 25
    }
  ]
}
```

---

## 🔧 Debug & Testing APIs

### 16. Debug Firebase Collections

**Endpoint:** `GET /api/users/debug/collections`  
**Description:** Debug Firebase Authentication and Firestore collections  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Debug completed - check server logs",
  "data": {
    "status": "debug completed",
    "message": "Check server logs for detailed information"
  }
}
```

---

### 17. Create Test User

**Endpoint:** `POST /api/users/debug/create-test-user`  
**Description:** Create a test user in Firebase Authentication  
**Authentication:** Required (Admin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "testuser@example.com",
  "password": "test123456",
  "name": "Test User"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Test user created successfully",
  "data": {
    "uid": "firebase_user_uid_789",
    "email": "testuser@example.com",
    "displayName": "Test User",
    "emailVerified": true
  }
}
```

---

### 18. Health Check

**Endpoint:** `GET /health`  
**Description:** Check server health status  
**Authentication:** None

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Server is healthy",
  "timestamp": "2025-08-14T01:30:46.952Z"
}
```

---

### 19. Test Firebase Connection

**Endpoint:** `GET /test/firebase`  
**Description:** Test Firebase connection status  
**Authentication:** None

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Firebase connection is working",
  "firestore": "connected",
  "timestamp": "2025-08-14T01:30:46.952Z"
}
```

**Error Response (500):**
```json
{
  "status": "error",
  "message": "Firebase connection failed",
  "error": "Detailed error message",
  "timestamp": "2025-08-14T01:30:46.952Z"
}
```

---

## ❌ Error Handling

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

### Error Response Format

All APIs return errors in this consistent format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional, for validation errors
}
```

### Common Error Examples

**Validation Error (400):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters long",
    "Name must be at least 2 characters long"
  ]
}
```

**Authentication Required (401):**
```json
{
  "status": "error",
  "message": "Access token is required"
}
```

**Invalid Token (403):**
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

**Insufficient Permissions (403):**
```json
{
  "status": "error",
  "message": "Super admin access required"
}
```

**Resource Not Found (404):**
```json
{
  "status": "error",
  "message": "Admin not found"
}
```

---

## 📮 Postman Collection

### Quick Setup

1. **Import the API collection** (if available)
2. **Set up environment variables:**
   - `baseURL`: `http://localhost:3000`
   - `adminToken`: Your JWT token from login

### Environment Variables

```json
{
  "baseURL": "http://localhost:3000",
  "adminToken": "your_jwt_token_here"
}
```

### Testing Sequence

1. **Create First Admin** → `POST {{baseURL}}/api/admin/setup/first-admin`
2. **Login** → `POST {{baseURL}}/api/admin/login` → Copy token
3. **Set Token** → Update `adminToken` environment variable
4. **Get Users** → `GET {{baseURL}}/api/users`
5. **Get Analytics** → `GET {{baseURL}}/api/users/analytics`

---

## 🔧 Development Features

### Clean Architecture
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Repositories**: Data access layer
- **Models**: Data entities
- **Middlewares**: Authentication, validation, error handling

### Firebase Integration
- **Authentication**: User management from Firebase Auth
- **Firestore**: Admin accounts and user settings
- **Security**: Service account based authentication

### Security Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Admin vs Super Admin permissions
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error messages

---

## 🚀 Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secure-production-jwt-secret-with-64-characters-minimum
JWT_EXPIRY=24h
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Security Checklist
- [ ] Add Firebase service account key
- [ ] Change JWT secret to a strong random string
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Remove debug endpoints

---

## 📞 Support

For issues or questions:
1. Check server logs for detailed error information
2. Use debug endpoints for troubleshooting
3. Verify Firebase configuration
4. Ensure proper authentication headers

---

**Last Updated:** August 14, 2025  
**Version:** 1.0.0
