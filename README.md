# GetSermons
Extracts the actual sermons from a transcript

---

## Web-Based Transcription Application

### Overview

This application provides a web-based interface for transcribing audio and video content. Users can upload multiple files or provide URLs to media. The system (conceptually) processes these sources, generates transcriptions, and allows users to perform basic content removal from the transcripts. All backend operations and transcription processes are currently simulated.

### Project Structure

The project is organized into three main directories:

*   **`frontend/`**: Contains the React frontend application. This is where the user interface components, state management, and interaction logic reside.
*   **`backend/`**: Contains conceptual Firebase Cloud Functions (`backend/functions/index.js`) and Firestore data model definitions (`backend/models.md`). These represent the server-side logic for handling requests, managing data, and interacting with services.
*   **`shared/`**: Contains shared utilities and conceptual service integrations:
    *   `transcriptionService.js`: A mock integration for a third-party transcription service.
    *   `contentRemover.js`: A basic utility for removing specified phrases from text.

### Conceptual Setup and Running

This section describes how one would conceptually set up and run the different parts of this application.

#### Frontend (React Application)

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Run the development server**:
    ```bash
    npm start
    # or
    # yarn start
    ```
    This will typically open the application in your web browser at `http://localhost:3000`.

#### Backend (Conceptual - Firebase Cloud Functions)

The `backend/functions/index.js` file contains placeholder Node.js functions intended for deployment as Firebase Cloud Functions. The `backend/models.md` file describes the intended Firestore database structure.

To deploy and run these backend functions in a real Firebase environment, you would typically:

1.  **Set up a Firebase project**: Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2.  **Install Firebase CLI**: If you don't have it, install the Firebase command-line tools globally:
    ```bash
    npm install -g firebase-tools
    ```
3.  **Login and Initialize Firebase**:
    ```bash
    firebase login
    firebase init functions # Choose JavaScript or TypeScript as appropriate
    # Also initialize Firestore if not already done: firebase init firestore
    ```
    Follow the prompts to connect to your Firebase project and configure the local `backend` directory. You might need to adjust the `firebase.json` configuration.
4.  **Deploy Functions**:
    ```bash
    firebase deploy --only functions
    ```
    This command will upload your functions to the Firebase environment. HTTP-triggered functions will be given URLs.

#### Shared Services (Conceptual Integration)

*   **Transcription Service (`shared/transcriptionService.js`)**:
    *   This file currently mocks interactions with a transcription service.
    *   **To integrate a real service** (e.g., Google Cloud Speech-to-Text, AssemblyAI, OpenAI Whisper):
        1.  Sign up for the chosen service and obtain API keys/credentials.
        2.  Modify the `requestTranscription` and `getTranscriptionJobStatus` functions in `shared/transcriptionService.js` to make actual API calls to the provider. This usually involves using their SDK or making HTTP requests.
        3.  Securely manage API keys. For Firebase, this can be done using Firebase environment configuration (`firebase functions:config:set service.apikey="YOUR_API_KEY"`) or Google Cloud Secret Manager.

*   **Content Removal (`shared/contentRemover.js`)**:
    *   This file provides a basic string/regex-based content removal function.
    *   For more sophisticated removal (e.g., understanding context, removing filler words based on patterns), this could be enhanced by:
        *   Integrating Natural Language Processing (NLP) libraries (e.g., spaCy, NLTK - if running in a Python backend, or JavaScript equivalents).
        *   Using more advanced regular expressions or custom algorithms.

### Key Features Implemented (Conceptually)

The application currently supports the following features in a simulated or placeholder capacity:

*   **Multi-File/URL Input**: Users can select multiple local files or submit URLs for transcription.
*   **Transcription Job Management**: The UI tracks initiated jobs (uploads/URLs) and their conceptual statuses.
*   **Transcription Processing (Mocked)**:
    *   Simulated calls to backend functions for initiating transcription.
    *   Simulated status checks (`processing`, `completed`, `failed`).
    *   Simulated retrieval of transcript text.
*   **Content Removal (Basic Implementation)**:
    *   Users can select a loaded transcript.
    *   Users can input phrases (one per line) to be removed.
    *   The `shared/contentRemover.js` script performs a basic string replacement, which is simulated in the frontend controls.
*   **Save/Copy Options (UI Placeholders)**: UI elements for saving or copying transcripts are present but not fully functional.
