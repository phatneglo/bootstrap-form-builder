/**
 * Typography Component - Renders text elements
 * Pure Bootstrap classes
 */

import BaseComponent from './BaseComponent.js';

export class Typography extends BaseComponent {
    render() {
        const content = this.properties.content || '';
        const textAlign = this.properties.textAlign || '';
        
        let element = '';
        
        switch (this.type) {
            case 'h1':
                element = `<h1 class="${textAlign}">${content}</h1>`;
                break;
            case 'h2':
                element = `<h2 class="${textAlign}">${content}</h2>`;
                break;
            case 'h3':
                element = `<h3 class="${textAlign}">${content}</h3>`;
                break;
            case 'h4':
                element = `<h4 class="${textAlign}">${content}</h4>`;
                break;
            case 'paragraph':
                element = `<p class="${textAlign}">${content}</p>`;
                break;
            default:
                element = `<p>${content}</p>`;
        }

        return this.renderWrapper(element);
    }
}

export default Typography;
