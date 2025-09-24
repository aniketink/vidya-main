# StudyBuddy (Vidya Ai)

An AI-Powered Study Schedule Generator designed to enhance student productivity. This project was submitted as part of the **AI VidyaSetu 1.0 - Code for New Bharat** initiative, aiming to build a more organized and resilient student workforce for a Viksit Bharat 2047.

![StudyBuddy Screenshot](https://i.imgur.com/your-screenshot-url.png) <!-- It's highly recommended to replace this with a screenshot of your actual application -->

## 🚀 Key Features

-   🤖 **AI-Powered Scheduler**: Instead of a generic LLM, StudyBuddy uses a sophisticated in-house algorithm that intelligently prioritizes tasks based on:
    -   **Urgency**: A scoring model that gives higher weight to tasks with closer due dates.
    -   **Importance**: User-defined priority levels (Low, Medium, High).
    -   **Magnitude**: A small boost for longer tasks to encourage starting them earlier.
-   ⏱️ **Intelligent Focus Timer**: A smart Pomodoro timer with a unique, camera-based presence detection feature.
    -   **Auto-Pause**: The timer automatically pauses if the user steps away from the camera.
    -   **Auto-Resume**: The timer resumes when the user returns, ensuring accurate tracking of focus time.
-   🧑‍🚀 **Modern & Engaging UI**: A sleek, dark-themed interface with subtle glassmorphism effects, a dynamic animated gradient background, and an interactive 3D astronaut model on the homepage.
-   📊 **Integrated Design Process**: The entire 5-step Design Thinking process (Empathize, Define, Ideate, Test) is documented directly within the app's "Design Process" section.
-   💾 **Persistent Data**: All tasks, schedules, and timer settings are saved locally in your browser using `localStorage`, so your data is preserved between sessions.

## 🛠️ Technology Stack

-   **Frontend**: HTML5, CSS3, JavaScript (ES Modules)
-   **Core Libraries**:
    -   [**face-api.js**](https://github.com/justadudewhohacks/face-api.js/): For the real-time face detection that powers the Intelligent Focus Timer.
    -   [**@google/model-viewer**](https://modelviewer.dev/): For rendering the 3D astronaut model on the homepage.
-   **Architecture**: The application is built with a modular Vanilla JS structure, separating concerns for state management, DOM manipulation, UI rendering, and core logic.

## ⚙️ Getting Started

This is a static web application with no backend dependencies. To run it locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/vidya-main.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd vidya-main
    ```

3.  **Run a local server:**
    Since the project uses JavaScript modules, you need to serve the files from a local server. Opening `index.html` directly from the file system will result in CORS errors.

    If you have VS Code, the easiest way is to use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
    -   Install the extension.
    -   Right-click on `index.html` and select "Open with Live Server".

    Alternatively, you can use Python's built-in HTTP server:
    ```bash
    # For Python 3
    python -m http.server
    ```
    Then, open your browser and go to `http://localhost:8000`.

## 📂 Project Structure

```
.
├── index.html          # The main HTML file for the single-page application.
├── style.css           # All styles for the application.
├── js/
│   ├── main.js         # Entry point, event listeners, and app initialization.
│   ├── state.js        # Central state management object.
│   ├── dom.js          # References to all DOM elements.
│   ├── ui.js           # Functions for rendering and updating the UI.
│   ├── scheduler.js    # The core logic for the "in-house AI" scheduler.
│   ├── timer.js        # Logic for the Pomodoro timer.
│   ├── camera.js       # Logic for face detection using face-api.js.
│   ├── storage.js      # Functions for saving/loading data to localStorage.
│   └── notifications.js# Handles showing on-screen notifications.
└── models/             # Pre-trained models for face-api.js.
```

## 🎨 Design & Development Process

This project was built following the 5 steps of Design Thinking to ensure a user-centric and effective solution:

1.  **Empathize**: We interviewed and surveyed local students to understand their core struggles with time management, stress, and distractions.
2.  **Define**: We articulated a clear problem statement: students need an intelligent, automated tool to create effective study plans.
3.  **Ideate**: We brainstormed several solutions and selected the combination of an AI scheduler and a smart focus timer as the most impactful approach.
4.  **Prototype**: We built the functional prototype you see here, focusing on the core features and user experience.
5.  **Test**: We defined a clear testing strategy with measurable success metrics, such as task completion rates and user satisfaction scores.

## 👥 Team

| Name          | Role                      |
| ------------- | ------------------------- |
| **Aniket Roy**| Team Lead & AI Developer  |
| **Yash**      | Frontend Developer        |
| **Ankit**     | Backend & Logic Developer |
| **Sumanta**   | UI/UX Designer            |
| **Saptak**    | Tester & QA               |

