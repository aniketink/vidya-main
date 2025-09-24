// js/ui.js - FINAL CORRECTED VERSION

import { dom } from './dom.js';
import { state } from './state.js';

let radius, circumference;

export function initializeUI() {
    const ring = dom.progressRingIndicator;
    if (ring) {
        radius = ring.r.baseVal.value;
        circumference = 2 * Math.PI * radius;
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = circumference;
    }
}

export function renderAll() {
    // renderView is handled by main.js now
    renderTasks();
    renderSchedule();
    renderTimerUI();
    updateTimerSettingsUI();
}

export function renderTasks() {
    dom.taskList.innerHTML = '';
    if (state.tasks.length === 0) {
        dom.taskList.innerHTML = '<li class="placeholder">No tasks added yet.</li>';
        return;
    }
    state.tasks.forEach(task => {
        const item = document.createElement('li');
        item.className = 'task-item';
        if (task.hours <= 0) item.classList.add('completed');
        item.dataset.id = task.id;
        item.innerHTML = `
            <div class="task-item-details">
                <strong>${task.subject}: ${task.name}</strong>
                <span>Due: ${task.dueDate} | ${task.hours} hours left | Priority: ${task.priorityText}</span>
            </div>
            <button class="delete-btn">&times;</button>
        `;
        dom.taskList.appendChild(item);
    });
}

export function renderSchedule() {
    dom.scheduleOutput.innerHTML = '';
    if (state.schedule.length === 0) {
        dom.scheduleOutput.innerHTML = '<p class="placeholder">Your study plan will appear here...</p>';
        return;
    }
    const scheduleByDay = state.schedule.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
    }, {});
    for (const date in scheduleByDay) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'schedule-day';
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        dayDiv.appendChild(dateHeader);
        scheduleByDay[date].forEach(item => {
            const itemDiv = document.createElement('div');
            const typeClass = item.type === 'break' ? 'break' : 'study';
            itemDiv.className = `schedule-item ${typeClass}`;
            itemDiv.innerHTML = `<strong>${item.time}</strong><span>${item.task}</span>`;
            dayDiv.appendChild(itemDiv);
        });
        dom.scheduleOutput.appendChild(dayDiv);
    }
}

export function showScheduleLoading(isLoading) {
    const btnSpan = dom.generateScheduleBtn.querySelector('span');
    if (isLoading) {
        btnSpan.innerHTML = '<div class="loader"></div> <span>Generating...</span>';
    } else {
        btnSpan.textContent = 'Generate Schedule with AI';
    }
}

export function renderTimerUI() {
    const time = state.timer.remainingTime;
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    
    dom.timerDisplay.textContent = `${minutes}:${seconds}`;
    document.title = state.timer.isRunning ? `${minutes}:${seconds} - Focusing...` : 'Study Suite - Enhanced';

    const percentage = (state.timer.totalDuration > 0) ? (state.timer.remainingTime / state.timer.totalDuration) : 1;
    const offset = circumference - (percentage * circumference);
    dom.progressRingIndicator.style.strokeDashoffset = offset;
    dom.progressRingIndicator.style.stroke = state.timer.isBreak ? 'var(--accent-blue)' : 'var(--accent-green)';
    
    dom.timerDisplay.style.color = state.camera.autoPaused ? 'orange' : (state.timer.isPaused ? 'var(--accent-yellow)' : 'var(--text-color)');

    dom.timerStartBtn.disabled = state.timer.isRunning && !state.timer.isPaused;
    dom.timerPauseBtn.disabled = !state.timer.isRunning;
    dom.timerResetBtn.disabled = !state.timer.isRunning;
    dom.timerStopBtn.disabled = !state.timer.isRunning;
    dom.timerPauseBtn.textContent = state.timer.isPaused ? 'Resume' : 'Pause';
}

export function updateCameraStatus(text, color) {
    dom.statusText.textContent = text;
    dom.statusText.style.backgroundColor = color;
}

export function updateCurrentTaskDisplay() {
    if (state.schedule.length > 0) {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        const nextTask = state.schedule.find(item => {
            if (item.date !== todayStr || item.type !== 'study') return false;
            const correspondingTask = state.tasks.find(t => `${t.subject}: ${t.name}` === item.task && t.hours > 0);
            if (!correspondingTask) return false;

            const [startHour] = item.time.split(':')[0].trim().split(' - ')[0].trim().split(':').map(Number);
            return startHour >= now.getHours();
        });
        
        dom.currentTaskDisplay.textContent = nextTask ? nextTask.task : "All tasks for today are complete!";
    } else {
        dom.currentTaskDisplay.textContent = "Generate a schedule to see your next task.";
    }
}

export function updateTimerSettingsUI() {
    dom.workMinutesInput.value = state.timer.settings.work;
    dom.shortBreakMinutesInput.value = state.timer.settings.shortBreak;
    dom.longBreakMinutesInput.value = state.timer.settings.longBreak;
}