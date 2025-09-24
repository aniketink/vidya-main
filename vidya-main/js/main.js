// js/main.js - FINAL CORRECTED VERSION

import { state } from './state.js';
import { dom } from './dom.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import * as scheduler from './scheduler.js';
import * as timer from './timer.js';
import * as camera from './camera.js';
import * as notifications from './notifications.js';

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.toggle('active', li.dataset.section === sectionId);
    });

    if (sectionId === 'timer') {
        ui.updateCurrentTaskDisplay();
        camera.initCameraAndDetection();
    } else {
        camera.stopCamera();
    }
}

async function handleGenerateSchedule() {
    const dailyHours = parseInt(dom.dailyHoursInput.value);
    if (state.tasks.filter(t => t.hours > 0).length === 0) {
        notifications.show("Please add at least one incomplete task.", 'error');
        return;
    }
    ui.showScheduleLoading(true);
    dom.generateScheduleBtn.disabled = true;
    try {
        const schedule = await scheduler.generateScheduleWithLLM(state.tasks.filter(t => t.hours > 0), dailyHours);
        if (schedule) {
            state.schedule = schedule;
            storage.save();
            ui.renderSchedule();
            notifications.show("New schedule generated!", "success");
        }
    } catch (error) {
        console.error("Schedule generation failed:", error);
        notifications.show("Failed to generate schedule. Check API key & console.", "error");
    } finally {
        ui.showScheduleLoading(false);
        dom.generateScheduleBtn.disabled = false;
    }
}

function handleAddTask(event) {
    event.preventDefault();
    const dueDate = dom.taskDueDateInput.value;
    if (new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
        notifications.show("Due date cannot be in the past.", "error");
        return;
    }
    const newTask = {
        id: Date.now(),
        subject: dom.taskSubjectInput.value,
        name: dom.taskNameInput.value,
        dueDate: dueDate,
        hours: parseInt(dom.taskHoursInput.value),
        priority: dom.taskPriorityInput.value,
        priorityText: dom.taskPriorityInput.options[dom.taskPriorityInput.selectedIndex].text
    };
    state.tasks.push(newTask);
    storage.save();
    ui.renderTasks();
    dom.taskForm.reset();
    dom.taskSubjectInput.focus();
}

function handleDeleteTask(event) {
    if (event.target.classList.contains('delete-btn')) {
        const taskItem = event.target.closest('.task-item');
        if (taskItem) {
            const taskId = parseInt(taskItem.dataset.id);
            state.tasks = state.tasks.filter(task => task.id !== taskId);
            storage.save();
            ui.renderTasks();
        }
    }
}

function handleClearData() {
    if (confirm("Are you sure you want to clear all your tasks and settings? This cannot be undone.")) {
        localStorage.removeItem('studySuiteState');
        window.location.reload();
    }
// js/main.js - Find and replace this one function
}
function handleTimerSettingsChange() {
    // Step 1: Update the settings state from the input fields. This part is correct.
    state.timer.settings.work = parseInt(dom.workMinutesInput.value) || 25;
    state.timer.settings.shortBreak = parseInt(dom.shortBreakMinutesInput.value) || 5;
    state.timer.settings.longBreak = parseInt(dom.longBreakMinutesInput.value) || 15;

    // Step 2 (The Fix): If the timer is NOT running, we now manually update the
    // display without calling timer.stop(), which prevents the camera from turning off.
    if (!state.timer.isRunning) {
        // Set the timer's duration and remaining time to the new work value
        state.timer.totalDuration = state.timer.settings.work * 60;
        state.timer.remainingTime = state.timer.settings.work * 60;
        
        // Directly call the UI update function to show the change
        ui.renderTimerUI();
    }
    // If the timer *is* running, we do nothing here. The new settings will simply be
    // saved and will apply to the *next* work/break session automatically.

    // Step 3: Save the newly updated settings to local storage.
    storage.save();
}

function setupEventListeners() {
    dom.mainNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' && e.target.dataset.section) {
            showSection(e.target.dataset.section);
        }
    });
    
    dom.getStartedBtn.addEventListener('click', () => showSection('scheduler'));
    
    dom.taskForm.addEventListener('submit', handleAddTask);
    dom.taskList.addEventListener('click', handleDeleteTask);
    dom.generateScheduleBtn.addEventListener('click', handleGenerateSchedule);
    dom.clearDataBtn.addEventListener('click', handleClearData);
    
    dom.timerStartBtn.addEventListener('click', timer.start);
    dom.timerPauseBtn.addEventListener('click', () => {
        state.timer.isPaused ? timer.resume() : timer.pause(false);
    });
    dom.timerResetBtn.addEventListener('click', timer.reset);
    dom.timerStopBtn.addEventListener('click', timer.stop);
    
    dom.workMinutesInput.addEventListener('change', handleTimerSettingsChange);
    dom.shortBreakMinutesInput.addEventListener('change', handleTimerSettingsChange);
    dom.longBreakMinutesInput.addEventListener('change', handleTimerSettingsChange);
}

function initializeApp() {
    storage.load();
    ui.initializeUI();
    ui.renderAll();
    setupEventListeners();
    showSection('home');
}

document.addEventListener('DOMContentLoaded', initializeApp);