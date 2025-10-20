/**
 * EventBus - Centralized event management
 * Allows modules to communicate without direct dependencies
 */

class EventBus {
    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    off(eventName, callback) {
        if (!this.events[eventName]) return;
        
        this.events[eventName] = this.events[eventName].filter(
            cb => cb !== callback
        );
    }

    emit(eventName, data) {
        if (!this.events[eventName]) return;
        
        this.events[eventName].forEach(callback => {
            callback(data);
        });
    }

    once(eventName, callback) {
        const wrapper = (data) => {
            callback(data);
            this.off(eventName, wrapper);
        };
        this.on(eventName, wrapper);
    }
}

export default new EventBus();
