import { state } from './state.js';
const STORAGE_KEY = 'studySuiteState';

export function save() {
    const stateToSave = {
        tasks: state.tasks,
        schedule: state.schedule,
        timer: {
            pomodorosCompleted: state.timer.pomodorosCompleted,
            settings: state.timer.settings
        }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
}

export function load() {
    const savedStateJSON = localStorage.getItem(STORAGE_KEY);
    if (savedStateJSON) {
        const parsedState = JSON.parse(savedStateJSON);
        state.tasks = parsedState.tasks || [];
        state.schedule = parsedState.schedule || [];
        if (parsedState.timer) {
            state.timer.pomodorosCompleted = parsedState.timer.pomodorosCompleted || 0;
            if (parsedState.timer.settings) {
                state.timer.settings = parsedState.timer.settings;
            }
        }
    }
}