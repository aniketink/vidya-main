// ===================================================================================
// js/scheduler.js - The Advanced, Mathematically-Robust In-House AI
// This version requires NO API keys and runs instantly in the browser.
// ===================================================================================

const SHORT_BREAK_MINUTES = 10;
const STUDY_BLOCK_HOURS = 1;

// --- AI Model Configuration ---
// These are the "dials" of our AI. We can tune them to change the AI's behavior.
const AI_WEIGHTS = {
    URGENCY: 2.0,      // How much to prioritize tasks that are due soon.
    IMPORTANCE: 1.5,   // How much to prioritize tasks the user marked as "High".
    MAGNITUDE: 0.5     // A small boost for longer tasks to encourage starting them.
};
const URGENCY_DECAY_CONSTANT = 0.1; // Lambda (λ) for the exponential decay function.

/**
 * Main function to generate the schedule.
 * It's exported as generateScheduleWithLLM to maintain compatibility with main.js.
 */
export async function generateScheduleWithLLM(tasks, maxDailyHours) {
    try {
        const schedule = generateAdvancedLocalSchedule(tasks, maxDailyHours);
        return schedule;
    } catch (error) {
        console.error("Failed to generate advanced local schedule:", error);
        alert("An error occurred while generating the schedule. Check the console for details.");
        return null;
    }
}

/**
 * The core advanced "in-house" AI scheduling logic.
 */
function generateAdvancedLocalSchedule(tasks, maxDailyHours) {
    if (!tasks || tasks.length === 0) return [];

    // --- Step 1: The AI Multi-Factor Priority Engine ---
    const scoredTasks = tasks.map(task => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        const daysRemaining = (dueDate - now) / (1000 * 60 * 60 * 24);

        // 1a. Urgency Score (Exponential Decay)
        let urgencyScore;
        if (daysRemaining < 0) {
            urgencyScore = 1000; // Massive penalty for overdue tasks
        } else {
            urgencyScore = Math.exp(-URGENCY_DECAY_CONSTANT * daysRemaining);
        }

        // 1b. Importance Score (Normalized)
        const importanceScore = parseInt(task.priority) / 3;

        // 1c. Magnitude Score (Logarithmic Scaling)
        const magnitudeScore = Math.log1p(task.hours); // ln(H + 1)

        // 1d. Final Weighted Priority Score
        const finalScore = 
            Math.pow(urgencyScore, AI_WEIGHTS.URGENCY) *
            Math.pow(importanceScore, AI_WEIGHTS.IMPORTANCE) *
            Math.pow(magnitudeScore, AI_WEIGHTS.MAGNITUDE);

        return { ...task, score: finalScore };
    });

    // --- Step 2: Task Prioritization ---
    scoredTasks.sort((a, b) => b.score - a.score);

    // --- Step 3: Task Decomposition into 1-Hour Blocks ---
    let studyBlocks = [];
    scoredTasks.forEach(task => {
        for (let i = 0; i < task.hours; i++) {
            studyBlocks.push({
                subject: task.subject,
                name: task.name,
                type: 'study'
            });
        }
    });

    // --- Step 4: Chronological Schedule Assembly ---
    let schedule = [];
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let hoursToday = 0;
    let studyBlocksToday = 0;
    let timeSlotInMinutes = 9 * 60; // Start day at 9:00 AM

    while (studyBlocks.length > 0) {
        if (hoursToday >= maxDailyHours) {
            currentDate.setDate(currentDate.getDate() + 1);
            hoursToday = 0;
            studyBlocksToday = 0;
            timeSlotInMinutes = 9 * 60;
        }

        const block = studyBlocks.shift();
        const startTime = formatTime(timeSlotInMinutes);
        timeSlotInMinutes += (STUDY_BLOCK_HOURS * 60);
        const endTime = formatTime(timeSlotInMinutes);

        schedule.push({
            date: currentDate.toISOString().split('T')[0],
            time: `${startTime} - ${endTime}`,
            task: `${block.subject}: ${block.name}`,
            type: 'study'
        });
        hoursToday += STUDY_BLOCK_HOURS;
        studyBlocksToday++;

        if (studyBlocksToday > 0 && studyBlocksToday % 2 === 0 && hoursToday < maxDailyHours) {
            const breakStartTime = formatTime(timeSlotInMinutes);
            timeSlotInMinutes += SHORT_BREAK_MINUTES;
            const breakEndTime = formatTime(timeSlotInMinutes);
            
            schedule.push({
                date: currentDate.toISOString().split('T')[0],
                time: `${breakStartTime} - ${breakEndTime}`,
                task: `Short Break`,
                type: 'break'
            });
        }
    }

    return schedule;
}

/**
 * Helper function to format minutes into a HH:MM string.
 */
function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}