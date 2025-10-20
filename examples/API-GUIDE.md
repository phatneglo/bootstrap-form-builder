# API Integration Quick Reference

## 📡 Testing the Form Builder with Real APIs

### Example 1: JSONPlaceholder Users
**A free fake API for testing**

```
URL: https://jsonplaceholder.typicode.com/users
Method: GET
Headers: (none needed)
Response Path: (empty - array at root)
Label Key: name
Value Key: id

Result: 10 user names in dropdown
```

---

### Example 2: JSONPlaceholder Posts
**Another free API endpoint**

```
URL: https://jsonplaceholder.typicode.com/posts
Method: GET
Headers: (none needed)
Response Path: (empty)
Label Key: title
Value Key: id

Result: 100 post titles
```

---

### Example 3: RESTCountries API
**Free country data**

```
URL: https://restcountries.com/v3.1/all
Method: GET
Headers: (none needed)
Response Path: (empty)
Label Key: name.common
Value Key: cca2

Result: All countries
Note: For nested properties use dot notation
```

---

### Example 4: Nested Response Example
**When data is nested in response**

```json
API Response:
{
  "status": "success",
  "data": {
    "items": [
      { "productName": "Widget", "sku": "WDG-001" },
      { "productName": "Gadget", "sku": "GDG-002" }
    ]
  }
}

Configuration:
URL: https://your-api.com/products
Method: GET
Response Path: data.items
Label Key: productName
Value Key: sku
```

---

### Example 5: With Authentication
**API requiring Bearer token**

```
URL: https://api.yourservice.com/options
Method: GET
Headers:
  - Key: Authorization
    Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Key: Content-Type
    Value: application/json

Response Path: (depends on your API)
Label Key: (pick from test results)
Value Key: (pick from test results)
```

---

### Example 6: With API Key
**API using X-API-Key header**

```
URL: https://api.service.com/data
Method: GET
Headers:
  - Key: X-API-Key
    Value: your_api_key_here
  - Key: Accept
    Value: application/json
```

---

## 🎯 Step-by-Step Testing Guide

### Testing with JSONPlaceholder (No Auth Required)

1. **Add a Select component to canvas**

2. **In Options Card, set:**
   - Data Source: `From API`
   - API URL: `https://jsonplaceholder.typicode.com/users`
   - HTTP Method: `GET`
   - Headers: (leave empty)

3. **Click "Test API"**
   - You should see: "API Test Successful"
   - "Found 10 items"
   - Sample data displayed
   - Properties: id, name, username, email, address, phone, website, company

4. **Click "Pick" button next to Label Key**
   - Select `name` from the list
   - You'll see "Leanne Graham" as example

5. **Click "Pick" button next to Value Key**
   - Select `id` from the list
   - You'll see "1" as example

6. **Done!** Preview your form to see the dropdown populated with user names

---

## 🔐 Common Authentication Patterns

### Pattern 1: Bearer Token
```
Header Key: Authorization
Header Value: Bearer YOUR_TOKEN_HERE
```

### Pattern 2: API Key in Header
```
Header Key: X-API-Key
Header Value: YOUR_API_KEY
```

### Pattern 3: API Key in Custom Header
```
Header Key: api-key
Header Value: YOUR_API_KEY
```

### Pattern 4: Basic Auth (Base64)
```
Header Key: Authorization
Header Value: Basic BASE64_ENCODED_CREDENTIALS
```

### Pattern 5: Multiple Headers
```
Header 1:
  Key: Authorization
  Value: Bearer TOKEN
Header 2:
  Key: Content-Type
  Value: application/json
Header 3:
  Key: X-Request-ID
  Value: unique-id-123
```

---

## 🐛 Troubleshooting

### Error: "No array found in response"
**Problem:** API returns object, not array

**Solutions:**
1. Check response structure in Test API modal
2. Set Response Path if array is nested
3. Example: If response is `{"data": {"users": [...]}}`, set path to `data.users`

---

### Error: "CORS policy" or "Network error"
**Problem:** Browser blocked cross-origin request

**Solutions:**
1. API server must send CORS headers
2. Use a backend proxy to make API calls
3. For development, use Chrome with CORS disabled (not recommended for production)

---

### Error: "401 Unauthorized" or "403 Forbidden"
**Problem:** Authentication failed

**Solutions:**
1. Verify token/API key is correct
2. Check token hasn't expired
3. Ensure header key is correct (Authorization, X-API-Key, etc.)
4. Check if token needs "Bearer " prefix

---

### Property Picker Shows Unexpected Fields
**Problem:** API returns nested objects

**Solution:**
- Use dot notation for nested fields
- Example: If API returns `{"user": {"profile": {"name": "John"}}}`
- You can't pick nested properties directly
- Consider using a different endpoint or transforming data

---

## 📚 Free APIs for Testing

1. **JSONPlaceholder** - https://jsonplaceholder.typicode.com
   - users, posts, comments, todos, etc.
   - No auth required

2. **REST Countries** - https://restcountries.com
   - Country data
   - No auth required

3. **Open Trivia DB** - https://opentdb.com/api.php
   - Trivia questions
   - No auth required

4. **Dog API** - https://dog.ceo/api/breeds/list/all
   - Dog breeds
   - No auth required

5. **Star Wars API** - https://swapi.dev/api
   - Star Wars data
   - No auth required

---

## 💡 Pro Tips

1. **Always Test First**: Click "Test API" before configuring keys
2. **Use Property Picker**: Don't type keys manually - use the picker!
3. **Check Response Path**: If test fails, try different paths
4. **Save Headers**: Headers are saved with your form JSON
5. **Security Note**: Don't expose API keys in client-side code for production

---

## 🎓 Example Form with API

See `sample-forms.json` for a complete example with:
- Manual options dropdown
- API-powered dropdown (JSONPlaceholder users)
- Manual radio buttons
- All with proper configuration

Load it via "Load JSON" button to see it in action!
