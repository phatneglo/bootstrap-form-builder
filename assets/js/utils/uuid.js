/**
 * UUID Generator
 * Generates unique IDs for form components
 */

export function generateId(prefix = 'comp') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateFormId() {
    return `form-${Date.now()}`;
}
