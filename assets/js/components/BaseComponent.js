/**
 * BaseComponent - Base class for rendering components
 * Pure Bootstrap classes only
 */

export class BaseComponent {
    constructor(component) {
        this.component = component;
        this.id = component.id;
        this.type = component.type;
        this.properties = component.properties;
    }

    // Render component wrapper with column classes
    renderWrapper(content) {
        const wrapper = document.createElement('div');
        wrapper.className = `${this.properties.columnClass || 'col-12'} fb-component`;
        wrapper.setAttribute('data-component-id', this.id);
        wrapper.setAttribute('data-component-type', this.type);
        
        // Add wrapper classes
        const inner = document.createElement('div');
        inner.className = this.properties.wrapperClass || 'mb-3';
        inner.style.position = 'relative';
        inner.innerHTML = content;
        
        // Add action buttons
        const actions = this.renderActions();
        inner.appendChild(actions);
        
        // Add resize handles
        const resizeHandles = this.renderResizeHandles();
        inner.appendChild(resizeHandles);
        
        wrapper.appendChild(inner);
        return wrapper;
    }

    // Render action buttons (delete, etc.)
    renderActions() {
        const actions = document.createElement('div');
        actions.className = 'fb-component-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm rounded-circle';
        deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
        deleteBtn.setAttribute('data-action', 'delete');
        deleteBtn.style.width = '24px';
        deleteBtn.style.height = '24px';
        deleteBtn.style.padding = '0';
        deleteBtn.style.fontSize = '14px';
        deleteBtn.type = 'button';
        
        actions.appendChild(deleteBtn);
        return actions;
    }

    // Render resize handles
    renderResizeHandles() {
        const container = document.createElement('div');
        
        const leftHandle = document.createElement('div');
        leftHandle.className = 'fb-resize-handle fb-resize-handle-left';
        leftHandle.setAttribute('data-resize', 'left');
        
        const rightHandle = document.createElement('div');
        rightHandle.className = 'fb-resize-handle fb-resize-handle-right';
        rightHandle.setAttribute('data-resize', 'right');
        
        container.appendChild(leftHandle);
        container.appendChild(rightHandle);
        
        return container;
    }

    // Get property value with fallback
    getProp(key, defaultValue = '') {
        return this.properties[key] || defaultValue;
    }

    // Render method (to be overridden by subclasses)
    render() {
        return this.renderWrapper('<div>Base Component</div>');
    }
}

export default BaseComponent;
