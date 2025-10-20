/**
 * Layout Component - Renders layout elements
 * Pure Bootstrap classes
 */

import BaseComponent from './BaseComponent.js';

export class Layout extends BaseComponent {
    render() {
        let content = '';

        switch (this.type) {
            case 'separator':
                content = '<hr>';
                break;
            default:
                content = '<div>Layout Element</div>';
        }

        return this.renderWrapper(content);
    }
}

export default Layout;
