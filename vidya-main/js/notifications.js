import { dom } from './dom.js';
let timeoutId;
export function show(message, type = 'info', duration = 4000) {
    clearTimeout(timeoutId);
    const notification = dom.notification;
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    timeoutId = setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}