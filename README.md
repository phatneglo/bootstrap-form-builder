# Bootstrap Form Builder

A modern, drag-and-drop form builder using **vanilla JavaScript** and **pure Bootstrap 5** classes. Features resizable components, key-value options, advanced API integration with authentication, and organized property cards.

## ✨ Features

- 🎨 **Pure Bootstrap 5** - No custom CSS, clean Bootstrap aesthetic
- 🧩 **Drag & Drop** - Intuitive component placement
- 📏 **Resizable Components** - Drag handles to resize columns directly in canvas
- 📱 **Responsive Columns** - Bootstrap grid system (col-12, col-md-6, etc.)
- ⚙️ **Real-time Editing** - Edit properties instantly with grouped cards
- 🔑 **Key-Value Options** - Separate labels and values for select/radio
- 🌐 **Advanced API Integration** - GET/POST, headers, authentication, property picker
- 🧪 **API Testing** - Test endpoints before use with visual feedback
- 💾 **JSON Import/Export** - Save and load form designs
- 👁️ **Live Preview** - See your form in action
- 🔧 **Modular Architecture** - Easy to extend and maintain

## 🚀 Quick Start

1. Open `index.html` in a modern web browser
2. Drag components from the left palette to the canvas
3. **Resize components** by dragging the blue handles on the left/right
4. Click components to edit their properties in organized cards
5. Use toolbar buttons to save, load, or preview your form

## 📦 Components

### Form Fields
- Text Input
- Email Input
- Number Input
- Phone Input
- Date Input
- Text Area
- Select Dropdown (with API support)
- Checkbox
- Radio Group (with API support)

### Typography
- Heading 1-4 (H1, H2, H3, H4)
- Paragraph

### Layout
- Line Separator (HR)

## 🎯 Key Features Explained

### 1. **Resizable Components**
- **Blue handles** appear on hover (left and right sides)
- Drag handles to resize component width
- Real-time width indicator shows column size
- Automatically updates column class (col-3, col-6, col-12, etc.)
- Can also resize via properties panel dropdown

### 2. **Key-Value Options** (Select, Radio)
Instead of simple strings, options now have separate labels and values:

```json
{
  "options": [
    { "label": "Google Search", "value": "google" },
    { "label": "Social Media", "value": "social_media" }
  ]
}
```

**In Properties Panel:**
- Add/remove options with buttons
- Edit label (what user sees) and value (what gets submitted)
- Supports both old format (strings) and new format (objects)

### 3. **Advanced API Integration** 🆕

Load options dynamically from external APIs with full control:

#### **Step-by-Step API Setup:**

1. **Select Data Source**: Choose "From API" in Options card

2. **Enter API URL**: 
   ```
   https://api.example.com/countries
   ```

3. **Select HTTP Method**:
   - GET (default) - For reading data
   - POST - For sending data/auth

4. **Add Headers** (Optional):
   - Click "+ Add Header"
   - Common examples:
     ```
     Authorization: Bearer your-token-here
     Content-Type: application/json
     X-API-Key: your-api-key
     ```

5. **Test API**:
   - Click "Test API" button
   - See results in modal:
     - ✓ Success/Error status
     - Sample data from response
     - Available properties detected

6. **Pick Properties** (Easy Mode!):
   - After successful test, click "Pick" button next to Label/Value Key
   - See all available properties from API
   - Click property name to select it
   - No typing needed!

7. **Response Path** (Optional):
   - If your API returns nested data:
   ```json
   {
     "status": "success",
     "data": {
       "items": [...]
     }
   }
   ```
   - Set Response Path to: `data.items`

#### **API Response Examples:**

**Simple Array:**
```json
[
  { "name": "Philippines", "code": "PH" },
  { "name": "United States", "code": "US" }
]
```
- Label Key: `name`
- Value Key: `code`

**Nested Response:**
```json
{
  "data": {
    "countries": [
      { "countryName": "Philippines", "id": "ph" }
    ]
  }
}
```
- Response Path: `data.countries`
- Label Key: `countryName`
- Value Key: `id`

**With Authentication:**
```json
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

### 4. **Grouped Property Cards**
Properties are now organized in Bootstrap cards:

- **Layout Card**
  - Column Width (with note about resize)
  - Spacing

- **Content Card**
  - Label, Name, Placeholder
  - Type-specific properties
  - Required checkbox

- **Options Card** (for select/radio)
  - Data Source selector
  - **Manual Entry Mode**:
    - Label-value pairs editor
    - Add/remove options
  - **API Mode**:
    - API URL
    - HTTP Method (GET/POST)
    - Headers manager
    - Test API button
    - Property pickers
    - Response path

## 🏗️ Project Structure

```
form-editor/
├── index.html                     # Main application page
├── README.md                      # Documentation
├── assets/
│   ├── css/
│   │   └── drag-indicators.css   # Minimal drag & resize styles
│   └── js/
│       ├── main.js               # App entry point
│       ├── core/                 # Core system
│       │   ├── FormBuilder.js   
│       │   ├── ComponentRegistry.js
│       │   ├── EventBus.js
│       │   └── StateManager.js
│       ├── modules/              # Features
│       │   ├── Canvas.js
│       │   ├── Palette.js
│       │   ├── PropertiesPanel.js (Enhanced with API features)
│       │   ├── Toolbar.js
│       │   ├── DragDrop.js
│       │   └── Resize.js        
│       ├── components/           # Component renderers
│       │   ├── BaseComponent.js 
│       │   ├── FormField.js     
│       │   ├── Typography.js
│       │   └── Layout.js
│       ├── utils/
│       │   ├── uuid.js
│       │   ├── dom.js
│       │   ├── json.js
│       │   └── api.js           # NEW: API testing utilities
│       └── config/
│           ├── components-config.js (Updated with API properties)
│           └── bootstrap-config.js
└── examples/
    └── sample-forms.json         
```

## 🎨 Complete Usage Guide

### Creating a Select with API Integration

1. **Drag "Select Dropdown" to canvas**

2. **Click to select it**

3. **In Options Card:**
   - Set Data Source to "From API"
   - Enter URL: `https://jsonplaceholder.typicode.com/users`
   - Keep Method as "GET"
   - Skip headers (no auth needed for this API)

4. **Click "Test API":**
   - Modal shows 10 users found
   - Sample data displayed
   - Available properties listed: id, name, username, email, etc.

5. **Click "Pick" next to Label Key:**
   - Modal shows all properties with examples
   - Click "name" (shows "Leanne Graham" as example)

6. **Click "Pick" next to Value Key:**
   - Click "id" (shows "1" as example)

7. **Done!** Your dropdown will now load user names from the API

### Adding Authentication Headers

For APIs requiring authentication:

1. In Options Card (API Mode)
2. Click "+ Add Header"
3. Enter:
   - Key: `Authorization`
   - Value: `Bearer your-token-here`
4. Add more headers as needed
5. Test API to verify authentication works

### Handling Nested API Responses

If your API returns:
```json
{
  "success": true,
  "data": {
    "results": [
      { "title": "Item 1", "value": "item1" }
    ]
  }
}
```

Set Response Path to: `data.results`

### Manual Options with Key-Value

1. Select dropdown/radio component
2. In "Options" card, keep "Manual Entry"
3. Click "+" to add options
4. For each option:
   - **Label**: What users see (e.g., "United States")
   - **Value**: What gets submitted (e.g., "US")

## 🔧 Keyboard Shortcuts

- `Delete` - Remove selected component
- `Escape` - Deselect component

## 📝 JSON Format

### Select with API Integration

```json
{
  "id": "comp-1",
  "type": "select",
  "properties": {
    "label": "Country",
    "name": "country",
    "dataSource": "api",
    "apiUrl": "https://api.example.com/countries",
    "apiMethod": "GET",
    "apiHeaders": [
      { "key": "Authorization", "value": "Bearer token123" },
      { "key": "X-API-Key", "value": "abc123" }
    ],
    "apiLabelKey": "countryName",
    "apiValueKey": "countryCode",
    "apiResponsePath": "data.countries",
    "columnClass": "col-12",
    "wrapperClass": "mb-3"
  }
}
```

### Select with Manual Options

```json
{
  "id": "comp-2",
  "type": "select",
  "properties": {
    "label": "How did you hear about us?",
    "name": "source",
    "dataSource": "manual",
    "options": [
      { "label": "Google Search", "value": "google" },
      { "label": "Social Media", "value": "social_media" },
      { "label": "Friend Referral", "value": "referral" }
    ],
    "columnClass": "col-md-6",
    "wrapperClass": "mb-3"
  }
}
```

## 🌐 API Integration Tips

### Common API Patterns

**REST API with Bearer Token:**
```
Method: GET
Header: Authorization = Bearer eyJhbGciOiJIUzI1...
```

**API with API Key:**
```
Method: GET
Header: X-API-Key = your_api_key_here
```

**GraphQL Endpoint:**
```
Method: POST
Header: Content-Type = application/json
(Note: You may need a middleware to convert GraphQL responses)
```

### Troubleshooting

**"No array found in response"**
- Check if API returns an array at root level
- If nested, set Response Path (e.g., `data.items`)
- Click Test API to see actual structure

**"CORS Error"**
- API must allow cross-origin requests
- Add appropriate CORS headers on server
- Or use a proxy/backend to make API calls

**Authentication Failed**
- Verify header key/value are correct
- Check if token is still valid
- Some APIs need multiple headers (auth + content-type)

## 🛠️ Extending

### Adding a New Component

1. **Define in `components-config.js`**
2. **Add rendering logic** in appropriate component class
3. **Add property editing** in `PropertiesPanel.js`

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Debugging

Access the form builder instance in console:
```javascript
window.formBuilder.getState()        // Get current state
window.formBuilder.exportJSON()      // Export form data
window.formBuilder.clear()           // Clear canvas
```

## 📄 License

MIT License - Feel free to use in your projects!

---

**New in this version:**
- ✨ HTTP Method selection (GET/POST)
- 🔐 Headers manager for authentication
- 🧪 Test API button with visual results
- 🎯 Smart property picker - auto-detect fields
- 📦 Response path for nested data
- 🎨 Enhanced UI with modals and feedback

Built with ❤️ using Vanilla JavaScript and Bootstrap 5
