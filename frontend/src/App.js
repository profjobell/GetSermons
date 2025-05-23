import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import UrlInput from './components/UrlInput';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import Controls from './components/Controls';
import SaveCopyOptions from './components/SaveCopyOptions';

export const GHOST_API_URL = '/api'; // Conceptual API prefix

function App() {
  const [jobs, setJobs] = useState([]); // Example: [{ id, type, name, status, serviceJobId }]
  const [transcripts, setTranscripts] = useState({}); // Example: { transcriptId: { text, originalText, history } }
  const [errorMessages, setErrorMessages] = useState([]);

  // --- Job Handlers ---
  const addJob = (jobInfo) => {
    // jobInfo: { type: 'upload'/'url', name/url: string, serviceJobId: string (from backend) }
    const newJob = {
      id: `job_${Date.now()}`, // Internal UI job ID
      status: 'pending_confirmation', // Initial status until backend confirms
      ...jobInfo,
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
    console.log('[App.js] Added job:', newJob);
    // In a real app, we'd wait for backend confirmation before setting a more stable status
  };

  const updateJobStatus = (jobId, newStatus, serviceJobId = null) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId || (serviceJobId && job.serviceJobId === serviceJobId)
          ? { ...job, status: newStatus, ...(serviceJobId && !job.serviceJobId && { serviceJobId }) }
          : job
      )
    );
    console.log(`[App.js] Updated job ${jobId || serviceJobId} status to:`, newStatus);
  };

  // --- Transcript Handlers ---
  const addTranscript = (transcriptId, transcriptData) => {
    // transcriptData: { text: string, originalText: string, jobId: string }
    setTranscripts(prevTranscripts => ({
      ...prevTranscripts,
      [transcriptId]: { id: transcriptId, ...transcriptData },
    }));
    console.log('[App.js] Added/Updated transcript:', transcriptId, transcriptData);
  };

  // --- Error Handler ---
  const addErrorMessage = (message) => {
    const errorId = `err_${Date.now()}`;
    setErrorMessages(prevErrors => [...prevErrors, { id: errorId, message }]);
    console.error('[App.js] Error added:', message);
    // Optional: auto-remove error after some time
    setTimeout(() => {
      setErrorMessages(prevErrors => prevErrors.filter(err => err.id !== errorId));
    }, 5000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transcription Service</h1>
      </header>
      {errorMessages.length > 0 && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
          {errorMessages.map(err => <p key={err.id}>{err.message}</p>)}
        </div>
      )}
      <main>
        <FileUpload addJob={addJob} updateJobStatus={updateJobStatus} addErrorMessage={addErrorMessage} />
        <UrlInput addJob={addJob} updateJobStatus={updateJobStatus} addErrorMessage={addErrorMessage} />
        <TranscriptionDisplay
          jobs={jobs}
          transcripts={transcripts}
          updateJobStatus={updateJobStatus}
          addTranscript={addTranscript}
          addErrorMessage={addErrorMessage}
        />
        <Controls
          transcripts={transcripts} // To know which transcript to apply removal on
          addTranscript={addTranscript} // To update transcript after removal
          addErrorMessage={addErrorMessage}
        />
        <SaveCopyOptions transcripts={transcripts} />
      </main>
    </div>
  );
}

export default App;
