## EndPoints:

### Auth:
```
  POST /api/v1/auth/register - Register a new user.
  POST /api/v1/auth/login - User login.
  GET /api/v1/auth/logout - User logout.
  POST /api/v1/auth/resetPassword - Request to Reset the password.
  PATCH /api/v1/auth/resetPassword - set new password.
```

### Users:
```
  GET /api/v1/users - Get all users (admin only).
  GET /api/v1/users/:userId - Get a single user by ID (admin or owner only).
  PATCH /api/v1/users/:userId - Update a user by ID (admin or owner only).
  PATCH /api/v1/users/password - Update a user password (owner only).
  PATCH /api/v1/users/email - Update a user email (owner only).
  PATCH /api/v1/users/email/verify - Verify user email (owner only).
  PATCH /api/v1/users/phone - Update a user phone (owner only).
  PATCH /api/v1/users/phone/verify - Verify user phone (owner only).
  DELETE /api/v1/users/:userId - Delete a user by ID (admin or owner only).
```

### Addresses:
```
  GET /api/v1/addresses - Get user addresses.
  GET /api/v1/addresses/:addressId - Get a user address by id.
  POST /api/v1/addresses - Create a user address.
  PUT /api/v1/addresses/:addressId - Update a user address.
  DELETE /api/v1/addresses/:addressId - Delete a user address.
```

### Payment Method:
```
  GET /api/v1/payments - Get user payment method.
  GET /api/v1/payments/:paymentId - Get a user payment method.
  POST /api/v1/payments - Create a user payment method.
  PUT /api/v1/payments/:paymentId - Update a user payment method.
  DELETE /api/v1/payments/:paymentId - Delete a user payment method.
```

### WishList:
```
  GET /api/v1/wishList - Get all products that is in wish list.
  POST /api/v1/wishList - Add product to wish list.
  DELETE /api/v1/wishList/:productId - Delete product from wish list.
```

### Tokens:
```
  GET /api/v1/token - Get all tokens data of the user.
  GET /api/v1/token/:tokenId - Get token data.
  DELETE /api/v1/token/:tokenId - Logout from specific device.
```

### Carts:
```
  GET /api/v1/cart - Get all products that is in cart with its quantity.
  POST /api/v1/cart - Add product to cart.
  PUT /api/v1/cart/:productId - Update quantity of product in cart.
  DELETE /api/v1/cart/:productId - Delete product from the cart.
```

### Categories:
```
  GET /api/v1/categories - Get all categories.
  GET /api/v1/categories/:categoryId - Get a single category by ID.
  POST /api/v1/categories - Create a new category (admin only).
  PUT /api/v1/categories/:categoryId - Update a category by ID (admin only).
  DELETE /api/v1/categories/:categoryId - Delete a category by ID (admin only).
```

### Products:
  **Products:**
  ```
    GET /api/v1/products - Get all products.
    GET /api/v1/products/:productId - Get a single product by ID.
    POST /api/v1/products - Create a new product (admin only).
    PUT /api/v1/products/:productId - Update a product by ID (admin only).
    DELETE /api/v1/products/:productId - Delete a product by ID (admin only).
  ```
  **Reviews:**
  ```
    GET /api/v1/products/reviews/:productId - Get all reviews of specific product.
    GET /api/v1/products/reviews/:reviewId - Get a single review by ID.
    POST /api/v1/products/reviews - Create a new review on specific product.
    PUT /api/v1/products/reviews/:reviewId - Update a review by ID.
    DELETE /api/v1/products/reviews/:reviewId - Delete a review by ID.
  ```

### Orders:
  **Order:**
  ```
    GET /api/v1/orders - Get all orders (admin only).
    GET /api/v1/orders/:userId - Get orders of specific user (admin or owner only).
    GET /api/v1/orders/:orderId - Get a single order by ID (admin or owner only).
    POST /api/v1/orders - Create a new order.
    PUT /api/v1/orders/address/:orderId - update address of order (owner only).
    PUT /api/v1/orders/status/:orderId - update status of order (admin or owner only)
    DELETE /api/v1/orders/:orderId - Delete an order by ID (admin only).
  ```

  **OrderItem:**
  ```
    POST /api/v1/orders/orderItems/:orderId/:productId - Add product to a specific order (owner only).
    PUT /api/v1/orders/orderItems/:orderId/:productId - Update quantity of product in a specific order (owner only).
    DELETE /api/v1/orders/orderItems/:orderId/:productId - Delete product from an order (owner only).
  ```
  **Reviews:**
  ```
    GET /api/v1/orders/reviews/:orderId - Get the review of specific order.
    POST /api/v1/orders/reviews - Create a new review on specific order(owner only).
    PUT /api/v1/orders/reviews/:reviewId - Update a review by ID.
    DELETE /api/v1/orders/reviews/:reviewId - Delete a review by ID.
  ```
  **Checkout:**
  ```
    POST /api/v1/orders/checkout - checkout the order
  ```

