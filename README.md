## 1. Home
**GET Home**
- **Endpoint:** `{{base_url}}/`
- **Input:** None
- **Functionality:** Get content from Max Mall homepage.

## 2. Product Operations

**Add New Product**
- **Endpoint:** `{{base_url}}/products`
- **Method:** POST
- **Input:**
  - JSON Body with fields: `id`, `name`, `description`, `quantity`, `price`
- **Functionality:** Add a new product to Max Mall.

**Retrieve All Products**
- **Endpoint:** `{{base_url}}/products`
- **Method:** GET
- **Input:** None
- **Functionality:** Retrieve a list of all available products.

**Delete Specific Product**
- **Endpoint:** `{{base_url}}/products/:name`
- **Method:** DELETE
- **Input:**
  - URL Parameter: `name`
- **Functionality:** Delete a specific product from Max Mall.

## 3. Order Operations

**Retrieve All Orders**
- **Endpoint:** `{{base_url}}/orders`
- **Method:** GET
- **Input:** None
- **Functionality:** Retrieve a list of all placed orders.

**Create New Shopping Order**
- **Endpoint:** `{{base_url}}/orders`
- **Method:** POST
- **Input:**
  - JSON Body with fields: `productId`, `quantity`
- **Functionality:** Place a new shopping order in Max Mall.

**Delete Shopping Order**
- **Endpoint:** `{{base_url}}/orders/:id`
- **Method:** DELETE
- **Input:**
  - URL Parameter: `id`
- **Functionality:** Delete a specific shopping order from Max Mall.
