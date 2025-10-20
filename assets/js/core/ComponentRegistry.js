/**
 * ComponentRegistry - Central registry for all component types
 * Factory pattern for creating component instances
 */

import { COMPONENT_DEFINITIONS, getComponentDefinition } from '../config/components-config.js';
import { generateId } from '../utils/uuid.js';

class ComponentRegistry {
    constructor() {
        this.definitions = COMPONENT_DEFINITIONS;
    }

    // Create a new component instance
    createComponent(type, customProperties = {}) {
        const definition = getComponentDefinition(type);
        
        if (!definition) {
            throw new Error(`Component type "${type}" not found`);
        }

        const component = {
            id: generateId('comp'),
            type: type,
            properties: {
                ...definition.defaultProperties,
                ...customProperties
            }
        };

        return component;
    }

    // Get all component definitions
    getAllDefinitions() {
        return this.definitions;
    }

    // Get component definition by type
    getDefinition(type) {
        return getComponentDefinition(type);
    }

    // Get components by category
    getComponentsByCategory(category) {
        return Object.values(this.definitions).filter(
            comp => comp.category === category
        );
    }

    // Check if component type exists
    hasComponent(type) {
        return !!this.definitions[type];
    }
}

export default new ComponentRegistry();
