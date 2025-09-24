export const state = {
    tasks: [],
    schedule: [],
    ui: { activeView: 'scheduler' },
    timer: {
        interval: null, remainingTime: 25 * 60, totalDuration: 25 * 60,
        isRunning: false, isPaused: false, isBreak: false, pomodorosCompleted: 0,
        settings: { work: 25, shortBreak: 5, longBreak: 15 }
    },
    camera: { isPersonPresent: true, autoPaused: false, }
};