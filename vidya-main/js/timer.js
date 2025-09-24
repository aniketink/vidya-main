// js/timer.js - FINAL CORRECTED VERSION

import { state } from './state.js';
import { dom } from './dom.js';
import * as ui from './ui.js';
import * as notifications from './notifications.js';
import { save } from './storage.js';
// --- UPDATE THIS LINE: We need to import the camera's start function as well ---
import { stopCamera, initCameraAndDetection } from './camera.js';

const ROUNDS_BEFORE_LONG_BREAK = 4;

function runInterval() {
    clearInterval(state.timer.interval);
    state.timer.interval = setInterval(() => {
        if (state.timer.isPaused) return;
        state.timer.remainingTime--;
        ui.renderTimerUI();
        if (state.timer.remainingTime < 0) {
            handleTimerEnd();
        }
    }, 1000);
}

export function start() {
    // --- ADD THIS LINE: This is the core of the fix ---
    // Re-initialize the camera every time a new session starts.
    initCameraAndDetection();

    state.timer.isRunning = true;
    state.timer.isPaused = false;
    state.camera.autoPaused = false;
    state.timer.isBreak = false;
    state.timer.totalDuration = state.timer.settings.work * 60;
    state.timer.remainingTime = state.timer.settings.work * 60;
    ui.renderTimerUI();
    runInterval();
}

export function pause(isAutoPause = false) {
    if (!state.timer.isRunning || state.timer.isPaused) return;
    state.timer.isPaused = true;
    state.camera.autoPaused = isAutoPause;
    ui.renderTimerUI();
}

export function resume() {
    if (!state.timer.isRunning || !state.timer.isPaused) return;
    state.timer.isPaused = false;
    state.camera.autoPaused = false;
    ui.renderTimerUI();
}

export function reset() {
    if (!state.timer.isRunning) return;
    clearInterval(state.timer.interval);
    const isBreak = state.timer.isBreak;
    const duration = isBreak
        ? (state.timer.pomodorosCompleted % ROUNDS_BEFORE_LONG_BREAK === 0 ? state.timer.settings.longBreak : state.timer.settings.shortBreak)
        : state.timer.settings.work;
    state.timer.totalDuration = duration * 60;
    state.timer.remainingTime = duration * 60;
    if (!state.timer.isPaused) runInterval();
    ui.renderTimerUI();
}

export function stop() {
    clearInterval(state.timer.interval);
    state.timer.isRunning = false;
    state.timer.isPaused = false;
    state.camera.autoPaused = false;
    state.timer.isBreak = false;
    state.timer.totalDuration = state.timer.settings.work * 60;
    state.timer.remainingTime = state.timer.settings.work * 60;
    stopCamera();
    ui.renderTimerUI();
    save();
}

function handleTimerEnd() {
    clearInterval(state.timer.interval);
    state.timer.isRunning = false;

    if (!state.timer.isBreak) {
        state.timer.pomodorosCompleted++;
        
        const currentTaskText = dom.currentTaskDisplay.textContent;
        const taskToUpdate = state.tasks.find(t => `${t.subject}: ${t.name}` === currentTaskText);
        if (taskToUpdate && taskToUpdate.hours > 0) {
            taskToUpdate.hours = Math.max(0, taskToUpdate.hours - 0.5); 
        }
        
        save();
        
        if (state.timer.pomodorosCompleted % ROUNDS_BEFORE_LONG_BREAK === 0) {
            notifications.show("Long break time!", 'success');
            startBreak(state.timer.settings.longBreak);
        } else {
            notifications.show("Take a short break!", 'success');
            startBreak(state.timer.settings.shortBreak);
        }
    } else {
        notifications.show("Break's over! Back to work.", 'info');
        stop();
        ui.updateCurrentTaskDisplay();
    }
}

function startBreak(duration) {
    state.timer.isRunning = true;
    state.timer.isPaused = false;
    state.camera.autoPaused = false;
    state.timer.isBreak = true;
    state.timer.totalDuration = duration * 60;
    state.timer.remainingTime = duration * 60;
    ui.renderTimerUI();
    runInterval();
}