// js/camera.js - CORRECTED AND ENHANCED

import { state } from './state.js';
import { dom } from './dom.js';
import * as ui from './ui.js';
import * as timer from './timer.js';
import * as notifications from './notifications.js'; // Import notifications

let isCameraInitialized = false;
let detectionInterval = null;

export function stopCamera() {
    if (dom.video && dom.video.srcObject) {
        dom.video.srcObject.getTracks().forEach(track => track.stop());
        dom.video.srcObject = null;
    }
    clearInterval(detectionInterval);
    if (dom.statusText) {
        ui.updateCameraStatus("Camera Off", "#555");
    }
    isCameraInitialized = false;
}

export async function initCameraAndDetection() {
    if (isCameraInitialized) return;
    
    try {
        ui.updateCameraStatus("Loading Models...", "orange");
        await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
        
        ui.updateCameraStatus("Starting Camera...", "orange");
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        dom.video.srcObject = stream;
        
        await new Promise((resolve) => {
            dom.video.onloadedmetadata = () => resolve();
        });
        
        await dom.video.play();
        isCameraInitialized = true;
        startDetectionLoop();

    } catch (err) {
        console.error("Camera/Model Initialization Error:", err);
        ui.updateCameraStatus("Camera Error", "red");
        isCameraInitialized = false;
    }
}

function startDetectionLoop() {
    clearInterval(detectionInterval);
    detectionInterval = setInterval(async () => {
        if (!dom.video.srcObject || !faceapi.nets.tinyFaceDetector.params) return;

        const detections = await faceapi.detectAllFaces(dom.video, new faceapi.TinyFaceDetectorOptions());
        const personDetected = detections.length > 0;

        // Only act if the presence state has changed
        if (personDetected !== state.camera.isPersonPresent) {
            handlePersonPresence(personDetected);
        }
    }, 1500); // Check every 1.5 seconds
}

function handlePersonPresence(isPresent) {
    // Update the state
    state.camera.isPersonPresent = isPresent;

    if (isPresent) {
        // --- LOGIC FOR WHEN FACE RETURNS ---
        ui.updateCameraStatus("FACE DETECTED", "rgba(0, 255, 0, 0.7)");
        // Only resume if the timer is running, paused, AND was auto-paused by this system
        if (state.timer.isRunning && state.timer.isPaused && state.camera.autoPaused) {
            notifications.show("Welcome back! Resuming timer.", "info");
            timer.resume();
        }
    } else {
        // --- LOGIC FOR WHEN FACE DISAPPEARS ---
        ui.updateCameraStatus("NO FACE DETECTED", "rgba(255, 0, 0, 0.7)");
        // Only pause if the timer is currently running and not already paused
        if (state.timer.isRunning && !state.timer.isPaused) {
            notifications.show("You seem to be away. Pausing timer.", "info");
            timer.pause(true); // Pass 'true' to indicate this is an AUTO-pause
        }
    }
}