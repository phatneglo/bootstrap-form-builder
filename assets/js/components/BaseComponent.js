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

    // Render action buttons (drag handle, delete, etc.)
    renderActions() {
        const actions = document.createElement('div');
        actions.className = 'fb-component-actions';
        
        // Drag handle button (top-left)
        const dragBtn = document.createElement('button');
        dragBtn.className = 'btn btn-secondary btn-sm rounded-circle';
        dragBtn.innerHTML = '<i class="bi bi-grip-vertical"></i>';
        dragBtn.setAttribute('data-action', 'drag');
        dragBtn.style.width = '24px';
        dragBtn.style.height = '24px';
        dragBtn.style.padding = '0';
        dragBtn.style.fontSize = '12px';
        dragBtn.style.position = 'absolute';
        dragBtn.style.top = '-8px';
        dragBtn.style.left = '-8px';
        dragBtn.type = 'button';
        dragBtn.title = 'Drag to reorder';
        
        // Delete button (top-right)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm rounded-circle';
        deleteBtn.innerHTML = '<i class="bi bi-x"></i>';
        deleteBtn.setAttribute('data-action', 'delete');
        deleteBtn.style.width = '24px';
        deleteBtn.style.height = '24px';
        deleteBtn.style.padding = '0';
        deleteBtn.style.fontSize = '14px';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '-8px';
        deleteBtn.style.right = '-8px';
        deleteBtn.type = 'button';
        deleteBtn.title = 'Delete component';
        
        actions.appendChild(dragBtn);
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
