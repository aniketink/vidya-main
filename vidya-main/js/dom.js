// js/dom.js - FINAL CORRECTED VERSION

export const dom = {
    // Navigation
    mainNav: document.getElementById('main-nav'),
    getStartedBtn: document.getElementById('get-started-btn'),

    // Section Views
    schedulerView: document.getElementById('scheduler'),
    timerView: document.getElementById('timer'),
    homeView: document.getElementById('home'),
    aboutView: document.getElementById('about'),

    // Scheduler Elements
    taskForm: document.getElementById('task-form'),
    taskSubjectInput: document.getElementById('task-subject'),
    taskNameInput: document.getElementById('task-name'),
    taskDueDateInput: document.getElementById('task-due-date'),
    taskHoursInput: document.getElementById('task-hours'),
    taskPriorityInput: document.getElementById('task-priority'),
    taskList: document.getElementById('task-list'),
    generateScheduleBtn: document.getElementById('generate-schedule-btn'),
    scheduleOutput: document.getElementById('schedule-output'),
    dailyHoursInput: document.getElementById('daily-hours'),
    clearDataBtn: document.getElementById('clear-data-btn'),

    // Timer Elements
    timerDisplay: document.getElementById('timer-display'),
    currentTaskDisplay: document.getElementById('current-task-display'),
    progressRingIndicator: document.getElementById('progress-ring-indicator'),
    video: document.getElementById('video'),
    statusText: document.getElementById('status-text'),
    timerStartBtn: document.getElementById('timer-start-btn'),
    timerPauseBtn: document.getElementById('timer-pause-btn'),
    timerResetBtn: document.getElementById('timer-reset-btn'),
    timerStopBtn: document.getElementById('timer-stop-btn'),
    
    // Timer Settings
    workMinutesInput: document.getElementById('work-minutes'),
    shortBreakMinutesInput: document.getElementById('short-break-minutes'),
    longBreakMinutesInput: document.getElementById('long-break-minutes'),

    // General
    notification: document.getElementById('notification'),
};