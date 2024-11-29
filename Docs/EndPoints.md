## EndPoints:

### Auth:

```
  POST /api/v1/auth/register - Register a new user.
  POST /api/v1/auth/login - User login.
  GET /api/v1/auth/verify/:codeId - For verify emails and phone numbers.
  GET /api/v1/auth/resendVerification/:userId - For resend verification links to emails and phone numbers.
  GET /api/v1/auth/refreshToken - For get access token by using refresh token.
  GET /api/v1/auth/logout - For logout.
  POST /api/v1/auth/resetPassword - Request to Reset the password.
  PATCH /api/v1/auth/resetPassword - set new password.
```

### Users:

```
  GET /api/v1/users - Get all users.
  GET /api/v1/users/:userId - Get a single user by ID.
  GET /api/v1/users/avatar - Get a user profile image.
  PATCH /api/v1/users/:userId - Update a user by ID.
  PATCH /api/v1/users/password/:userId - Update a user password.
  PATCH /api/v1/users/role/:userId - Update a user role.
  DELETE /api/v1/users/:userId - Delete a user by ID.
```

### Addresses:

```
  GET /api/v1/addresses - Get user addresses.
  GET /api/v1/addresses/:addressId - Get a user address by id.
  GET /api/v1/addresses/user/:userId - Get addresses of specific user.
  POST /api/v1/addresses - Create a user address.
  PATCH /api/v1/addresses/:addressId - Update a user address.
  DELETE /api/v1/addresses/:addressId - Delete a user address.
```

### Payment Method:

```
  GET /api/v1/payments - Get user payment methods.
  GET /api/v1/payments/:paymentMethodId - Get a user payment method.
  GET /api/v1/payments/user/:userId - Get payments methods of specific user.
  POST /api/v1/payments - Create a user payment method.
  PATCH /api/v1/payments/:paymentMethodId - Update a user payment method.
  DELETE /api/v1/payments/:paymentMethodId - Delete a user payment method.
```

### WishList:

```
  GET /api/v1/wishList - Get all products that is in the wish list.
  POST /api/v1/wishList/:productId - Add product to wish list.
  DELETE /api/v1/wishList/:productId - Delete product from wish list.
```

### Carts:

```
  GET /api/v1/cart - Get all products that is in cart with its quantity.
  POST /api/v1/cart/:productId - Add product to cart.
  PATCH /api/v1/cart/:productId - Update quantity of product in cart.
  DELETE /api/v1/cart/:productId - Delete product from the cart.
```

### Categories:

```
  GET /api/v1/categories - Get all categories.
  GET /api/v1/categories/:categoryId - Get a single category by ID.
  POST /api/v1/categories - Create a new category.
  PATCH /api/v1/categories/:categoryId - Update a category by ID.
  DELETE /api/v1/categories/:categoryId - Delete a category by ID.
```

### Products:

```
  GET /api/v1/products - Get all products.
  GET /api/v1/products/:productId - Get a single product by ID.
  GET /api/v1/products/images/:imageName- Get a image file as file stream.
  POST /api/v1/products - Create a new product.
  PATCH /api/v1/products/:productId - Update a product by ID.
  DELETE /api/v1/products/:productId - Delete a product by ID.
```

### Products Reviews:

```
  GET /api/v1/products/reviews/product/:productId - Get all reviews of specific product.
  GET /api/v1/products/reviews/:reviewId - Get a single review by ID.
  POST /api/v1/products/reviews - Create a new review on specific product.
  PATCH /api/v1/products/reviews/:reviewId - Update a review by ID.
  DELETE /api/v1/products/reviews/:reviewId - Delete a review by ID.
```

### Orders:

**Order:**

```
  GET /api/v1/orders - Get all orders.
  GET /api/v1/orders/:userId - Get orders of specific user.
  GET /api/v1/orders/:orderId - Get a single order by ID.
  POST /api/v1/orders - Create a new order.
  PUT /api/v1/orders/address/:orderId - update address of order.
  PUT /api/v1/orders/status/:orderId - update status of order
  DELETE /api/v1/orders/:orderId - Delete an order by ID.
```

**OrderItem:**

```
  POST /api/v1/orders/orderItems/:orderId/:productId - Add product to a specific order.
  PUT /api/v1/orders/orderItems/:orderId/:productId - Update quantity of product in a specific order.
  DELETE /api/v1/orders/orderItems/:orderId/:productId - Delete product from an order.
```

**Reviews:**

```
  GET /api/v1/orders/reviews/:orderId - Get the review of specific order.
  POST /api/v1/orders/reviews - Create a new review on specific order.
  PUT /api/v1/orders/reviews/:reviewId - Update a review by ID.
  DELETE /api/v1/orders/reviews/:reviewId - Delete a review by ID.
```

**Checkout:**

```
  POST /api/v1/orders/checkout - checkout the order
```
