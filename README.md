# 🎨 Bootstrap Form Builder

A powerful, drag-and-drop form builder built with vanilla JavaScript and Bootstrap 5. Create beautiful, responsive forms with an intuitive visual interface, complete with API integration for dynamic data sources.

![Form Builder Interface](https://github.com/phatneglo/bootstrap-form-builder/blob/main/examples/screenshot.png)

## ✨ Features

- **🎯 Visual Form Building**: Drag-and-drop interface for creating forms
- **📱 Responsive Design**: Bootstrap 5 powered responsive layouts
- **🔌 API Integration**: Connect dropdowns and radio groups to live APIs
- **💾 JSON Export/Import**: Save and load form configurations
- **👁️ Live Preview**: See your form in action before deployment
- **🎨 Customizable**: Easy to extend with new components
- **⌨️ Keyboard Shortcuts**: Delete key to remove components, Escape to deselect
- **📏 Resizable Components**: Visual resize handles for responsive layouts

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/phatneglo/bootstrap-form-builder.git
   cd bootstrap-form-builder
   ```

2. **Open in browser**
   ```bash
   # Serve with any static server
   python -m http.server 8000
   # or
   npx serve .
   # or simply open index.html in your browser
   ```

3. **Start building!**
   - Drag components from the left palette
   - Configure properties in the right panel
   - Preview your form with the Preview button

## 📁 Project Structure

```
bootstrap-form-builder/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── drag-indicators.css # Minimal CSS for drag/drop feedback
│   └── js/
│       ├── main.js            # Application entry point
│       ├── core/              # Core application modules
│       │   ├── FormBuilder.js     # Main controller class
│       │   ├── ComponentRegistry.js # Component factory
│       │   ├── EventBus.js         # Event management system
│       │   └── StateManager.js     # Application state management
│       ├── modules/           # Feature modules
│       │   ├── Palette.js          # Component palette (left sidebar)
│       │   ├── Canvas.js           # Form canvas (center)
│       │   ├── DragDrop.js         # Drag and drop functionality
│       │   ├── PropertiesPanel.js  # Properties editor (right sidebar)
│       │   ├── Toolbar.js          # Top toolbar actions
│       │   └── Resize.js           # Component resizing
│       ├── components/        # Component renderers
│       │   ├── BaseComponent.js    # Base component class
│       │   ├── FormField.js        # Form input components
│       │   ├── Typography.js       # Text components (H1-H4, P)
│       │   └── Layout.js           # Layout components (separators)
│       ├── config/            # Configuration files
│       │   ├── components-config.js # Component definitions
│       │   └── bootstrap-config.js  # Bootstrap class options
│       └── utils/             # Utility functions
│           ├── api.js              # API integration utilities
│           ├── json.js             # JSON import/export
│           ├── uuid.js             # ID generation
│           └── dom.js              # DOM utilities
├── examples/
│   ├── sample-forms.json      # Example form configurations
│   └── API-GUIDE.md          # API integration guide
└── README.md                 # This file
```

## 🏗️ Architecture Overview

### Core System

The application follows a modular architecture with clear separation of concerns:

#### **FormBuilder** (`core/FormBuilder.js`)
- Main controller that initializes all modules
- Coordinates module communication
- Handles global keyboard shortcuts
- Provides public API for external access

#### **EventBus** (`core/EventBus.js`)
- Centralized event management system
- Allows modules to communicate without direct dependencies
- Supports `on()`, `off()`, `emit()`, and `once()` methods

#### **StateManager** (`core/StateManager.js`)
- Manages application state and component hierarchy
- Handles CRUD operations on components
- Manages selection state
- Provides JSON serialization/deserialization

#### **ComponentRegistry** (`core/ComponentRegistry.js`)
- Factory for creating component instances
- Manages component definitions
- Provides component lookup by type and category

### Module System

Each feature is implemented as an independent module:

#### **Palette** (`modules/Palette.js`)
- Displays available components in categorized sections
- Handles drag initialization for components
- Renders component icons and labels

#### **Canvas** (`modules/Canvas.js`)
- Main workspace for form building
- Renders components using appropriate renderers
- Handles component selection and highlighting
- Manages drag-to-reorder functionality
- Loads API data for dynamic components

#### **DragDrop** (`modules/DragDrop.js`)
- Handles drag and drop from palette to canvas
- Shows visual drop indicators
- Calculates drop positions and insert indices

#### **PropertiesPanel** (`modules/PropertiesPanel.js`)
- Dynamic property editor based on component type
- Supports manual and API data sources
- Includes API testing and property picking
- Real-time property updates

#### **Toolbar** (`modules/Toolbar.js`)
- Handles form-level actions (clear, save, load, preview)
- Manages JSON import/export
- Renders live form preview with API data

#### **Resize** (`modules/Resize.js`)
- Provides visual resize handles for components
- Maps pixel widths to Bootstrap column classes
- Shows width indicators during resize

## 🧩 Component System

### Component Structure

Each component follows this structure:

```javascript
{
  id: "comp-1234567890-abc123def",
  type: "text", // Component type identifier
  properties: {
    // Component-specific properties
    label: "Text Field",
    name: "textField",
    placeholder: "",
    required: false,
    columnClass: "col-12",
    wrapperClass: "mb-3",
    // ... other properties
  }
}
```

### Available Components

#### **Form Fields**
- **Text Input** (`text`) - Single-line text input
- **Email Input** (`email`) - Email validation
- **Number Input** (`number`) - Numeric input with min/max/step
- **Phone Input** (`tel`) - Telephone number input
- **Date Input** (`date`) - Date picker
- **Text Area** (`textarea`) - Multi-line text input
- **Select Dropdown** (`select`) - Dropdown with manual or API options
- **Checkbox** (`checkbox`) - Single checkbox
- **Radio Group** (`radio`) - Radio button group with manual or API options

#### **Typography**
- **Heading 1** (`h1`) - Large heading
- **Heading 2** (`h2`) - Medium heading
- **Heading 3** (`h3`) - Small heading
- **Heading 4** (`h4`) - Extra small heading
- **Paragraph** (`paragraph`) - Text paragraph

#### **Layout**
- **Line Separator** (`separator`) - Horizontal rule

### Adding New Components

To add a new component type:

1. **Define the component** in `config/components-config.js`:

```javascript
export const COMPONENT_DEFINITIONS = {
  // ... existing components
  myNewComponent: {
    type: 'myNewComponent',
    label: 'My New Component',
    icon: 'bi-my-icon',
    category: 'form-fields', // or 'typography', 'layout'
    defaultProperties: {
      label: 'My Component',
      name: 'myComponent',
      // ... other default properties
    }
  }
};
```

2. **Create a renderer** in `components/`:

```javascript
// components/MyNewComponent.js
import BaseComponent from './BaseComponent.js';

export class MyNewComponent extends BaseComponent {
  render() {
    const content = `
      <div class="my-component">
        <!-- Your component HTML here -->
      </div>
    `;
    return this.renderWrapper(content);
  }
}

export default MyNewComponent;
```

3. **Register the renderer** in `modules/Canvas.js`:

```javascript
// In renderComponent method
switch (component.type) {
  // ... existing cases
  case 'myNewComponent':
    componentInstance = new MyNewComponent(component);
    break;
}
```

4. **Add properties editor** in `modules/PropertiesPanel.js`:

```javascript
// In createContentCard method
case 'myNewComponent':
  content = this.getMyNewComponentContent(component);
  break;

// Add the method
getMyNewComponentContent(component) {
  return `
    <div class="mb-3">
      <label class="form-label small fw-bold">Label</label>
      <input type="text" class="form-control form-control-sm" name="label" value="${component.properties.label || ''}">
    </div>
    <!-- Add other property inputs -->
  `;
}
```

## 🔌 API Integration

The form builder supports dynamic data sources for select dropdowns and radio groups.

### API Configuration

Components can be configured to fetch options from APIs:

```javascript
{
  type: "select",
  properties: {
    dataSource: "api", // or "manual"
    apiUrl: "https://api.example.com/users",
    apiMethod: "GET", // or "POST"
    apiHeaders: [
      { key: "Authorization", value: "Bearer token123" }
    ],
    apiLabelKey: "name",
    apiValueKey: "id",
    apiResponsePath: "data.users" // optional, for nested arrays
  }
}
```

### API Testing

The properties panel includes built-in API testing:

1. **Test API** button validates the endpoint
2. **Property Picker** helps select correct label/value keys
3. **Real-time preview** shows actual API data

### Example APIs

See `examples/API-GUIDE.md` for comprehensive API integration examples including:
- JSONPlaceholder (users, posts)
- REST Countries API
- Authentication patterns
- Troubleshooting guide

## 📡 Event System

The application uses a centralized event system for module communication:

### Core Events

#### **Application Events**
- `app:ready` - Application fully initialized
- `state:changed` - Form state updated
- `state:cleared` - Form cleared
- `state:loaded` - Form loaded from JSON

#### **Component Events**
- `component:added` - New component added to canvas
- `component:selected` - Component selected for editing
- `component:deselected` - Component deselected
- `component:updated` - Component properties updated

### Event Usage

```javascript
// Listen to events
EventBus.on('component:added', (component) => {
  console.log('Component added:', component.type);
});

// Emit events
EventBus.emit('component:selected', component);

// One-time listeners
EventBus.once('app:ready', () => {
  console.log('App is ready!');
});
```

## 🎨 Styling and Theming

The application uses Bootstrap 5 classes exclusively. Custom styling is minimal and focused on drag-and-drop feedback.

### CSS Classes

#### **Component States**
- `.fb-component` - Base component wrapper
- `.fb-selected` - Selected component
- `.fb-dragging` - Component being dragged
- `.fb-resizing` - Component being resized

#### **Drag and Drop**
- `.fb-drop-indicator` - Drop position indicator
- `.fb-palette-item` - Palette component item
- `.fb-component-actions` - Action buttons container

#### **Resize Handles**
- `.fb-resize-handle` - Resize handle
- `.fb-resize-handle-left` - Left resize handle
- `.fb-resize-handle-right` - Right resize handle
- `.fb-width-indicator` - Width display tooltip

### Customization

To customize the appearance:

1. **Override Bootstrap classes** in your CSS
2. **Modify component renderers** to use different Bootstrap classes
3. **Update `bootstrap-config.js`** for different class options
4. **Extend `drag-indicators.css`** for custom drag feedback

## 🔧 Configuration

### Bootstrap Configuration

`config/bootstrap-config.js` defines available Bootstrap classes:

```javascript
export const COLUMN_OPTIONS = [
  { value: 'col-12', label: 'Full Width (12 columns)' },
  { value: 'col-md-6', label: 'Half Width (6 columns)' },
  // ... more options
];
```

### Component Configuration

`config/components-config.js` defines all available components with their default properties and metadata.

## 📊 JSON Format

Forms are saved as JSON with this structure:

```json
{
  "formId": "form-1234567890",
  "formName": "My Form",
  "version": "1.0.0",
  "components": [
    {
      "id": "comp-1234567890-abc123def",
      "type": "text",
      "properties": {
        "label": "Full Name",
        "name": "fullName",
        "placeholder": "Enter your name",
        "required": true,
        "columnClass": "col-md-6",
        "wrapperClass": "mb-3",
        "inputClass": "form-control",
        "labelClass": "form-label"
      }
    }
  ]
}
```

## 🚀 Deployment

### Static Hosting

The application is a static web app that can be deployed to any static hosting service:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Connect your repository
- **Vercel**: Deploy with zero configuration
- **AWS S3**: Upload files to S3 bucket
- **CDN**: Serve from any CDN

### Production Considerations

1. **API Security**: Don't expose API keys in client-side code
2. **CORS**: Ensure APIs support cross-origin requests
3. **HTTPS**: Use HTTPS for production deployments
4. **Caching**: Configure appropriate cache headers

## 🧪 Testing

### Manual Testing

1. **Component Creation**: Test all component types
2. **Drag and Drop**: Verify smooth drag operations
3. **Property Editing**: Test all property types
4. **API Integration**: Test with various APIs
5. **JSON Export/Import**: Verify data integrity
6. **Responsive Design**: Test on different screen sizes

### Browser Compatibility

- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/phatneglo/bootstrap-form-builder.git
   cd bootstrap-form-builder
   ```

3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Contribution Guidelines

#### **Code Style**
- Use ES6+ JavaScript features
- Follow existing naming conventions
- Add JSDoc comments for new functions
- Use meaningful variable names

#### **Component Development**
- Extend `BaseComponent` for new components
- Use Bootstrap classes exclusively
- Follow the existing property pattern
- Test with various screen sizes

#### **API Integration**
- Test with multiple API endpoints
- Handle error cases gracefully
- Provide clear error messages
- Document new features

#### **Pull Request Process**
1. **Create a feature branch** from `main`
2. **Make your changes** with clear commits
3. **Add tests** if applicable
4. **Update documentation** if needed
5. **Submit PR** with detailed description

### Areas for Contribution

- **New Components**: Add more form field types
- **API Integrations**: Support more data sources
- **Themes**: Add different Bootstrap themes
- **Validation**: Client-side form validation
- **Export Formats**: PDF, HTML, etc.
- **Accessibility**: Improve screen reader support
- **Performance**: Optimize rendering and memory usage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bootstrap Team** for the amazing CSS framework
- **Bootstrap Icons** for the icon set
- **JSONPlaceholder** for providing free API testing
- **Contributors** who help improve this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/phatneglo/bootstrap-form-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/phatneglo/bootstrap-form-builder/discussions)
- **Documentation**: Check the `examples/` folder for guides

## 🔮 Roadmap

### Version 2.0
- [ ] Form validation system
- [ ] Custom CSS editor
- [ ] Component templates
- [ ] Multi-step forms
- [ ] File upload component
- [ ] Advanced layout components

### Version 2.1
- [ ] Theme system
- [ ] Plugin architecture
- [ ] Real-time collaboration
- [ ] Form analytics
- [ ] A/B testing support

---
