import React from 'react';
import { GHOST_API_URL } from '../App'; // Assuming App.js exports it

function TranscriptionDisplay({ jobs, transcripts, updateJobStatus, addTranscript, addErrorMessage }) {

  const handleCheckStatus = async (serviceJobId, internalJobId) => {
    if (!serviceJobId) {
      addErrorMessage(`No serviceJobId available for job ${internalJobId} to check status.`);
      return;
    }
    console.log(`[TranscriptionDisplay] Checking status for serviceJobId: ${serviceJobId} (internal ID: ${internalJobId})`);
    updateJobStatus(internalJobId, 'status_checking...', serviceJobId);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock API response from our backend /getTranscriptionStatus
      // Possible statuses: 'processing', 'completed', 'failed' (align with backend/shared service)
      const possibleStatuses = ['processing', 'completed', 'failed'];
      const mockStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
      const mockApiResponse = {
        jobId: serviceJobId,
        status: mockStatus,
        // Conditionally add transcriptId if completed
        ...(mockStatus === 'completed' && { transcriptId: `transcript_${serviceJobId}` }),
        ...(mockStatus === 'failed' && { error: 'Simulated processing error.' }),
      };
      console.log('[TranscriptionDisplay] Mock API Status Response:', mockApiResponse);

      updateJobStatus(internalJobId, mockApiResponse.status, serviceJobId);

      if (mockApiResponse.status === 'completed' && mockApiResponse.transcriptId) {
        // If completed and transcriptId is available, automatically try to fetch it
        await handleFetchTranscript(mockApiResponse.transcriptId, internalJobId, serviceJobId);
      } else if (mockApiResponse.status === 'failed') {
        addErrorMessage(`Job ${serviceJobId} failed: ${mockApiResponse.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[TranscriptionDisplay] Mock API Call for status failed:', error);
      addErrorMessage(`Failed to check status for job ${serviceJobId}: ${error.message}`);
      updateJobStatus(internalJobId, 'status_check_failed', serviceJobId);
    }
  };

  const handleFetchTranscript = async (transcriptId, internalJobId, serviceJobId) => {
    console.log(`[TranscriptionDisplay] Fetching transcript for ID: ${transcriptId} (Job: ${internalJobId})`);
    // Optionally update job status to 'fetching_transcript'
    updateJobStatus(internalJobId, 'fetching_transcript', serviceJobId);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock API response from our backend /getTranscript
      const mockApiResponse = {
        transcriptId: transcriptId,
        text: `This is a simulated transcript for job ${serviceJobId} (Transcript ID: ${transcriptId}). The content is placeholder.`,
        // Include originalText if your model supports it, or just use 'text'
        originalText: `Original, unprocessed transcript for ${serviceJobId}.`,
        jobId: serviceJobId, // Link back to the service job ID
      };
      console.log('[TranscriptionDisplay] Mock API Transcript Response:', mockApiResponse);

      addTranscript(transcriptId, {
        text: mockApiResponse.text,
        originalText: mockApiResponse.originalText,
        jobId: internalJobId, // Link to internal job ID
        serviceJobId: serviceJobId // Link to service job ID
      });
      updateJobStatus(internalJobId, 'transcript_loaded', serviceJobId);

    } catch (error) {
      console.error('[TranscriptionDisplay] Mock API Call for transcript failed:', error);
      addErrorMessage(`Failed to fetch transcript ${transcriptId}: ${error.message}`);
      updateJobStatus(internalJobId, 'transcript_fetch_failed', serviceJobId);
    }
  };

  return (
    <div>
      <h2>Transcription Jobs & Display</h2>
      {jobs.length === 0 && <p>No transcription jobs started yet.</p>}
      <ul>
        {jobs.map(job => (
          <li key={job.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', paddingBottom: '10px' }}>
            <strong>Job ID (UI):</strong> {job.id} <br />
            {job.serviceJobId && <><strong>Job ID (Service):</strong> {job.serviceJobId} <br /></>}
            <strong>Type:</strong> {job.type} <br />
            <strong>Source:</strong> {job.name} <br />
            <strong>Status:</strong> {job.status} <br />
            
            {job.serviceJobId && job.status !== 'completed' && job.status !== 'transcript_loaded' && (
              <button onClick={() => handleCheckStatus(job.serviceJobId, job.id)} style={{marginRight: '5px'}}>
                Check Status
              </button>
            )}

            {/* Display transcript if available */}
            {Object.values(transcripts).map(t => {
              if (t.jobId === job.id || t.serviceJobId === job.serviceJobId) {
                return (
                  <div key={t.id || t.transcriptId} style={{ marginTop: '10px', padding: '10px', border: '1px solid #eee' }}>
                    <h4>Transcript (ID: {t.id || t.transcriptId})</h4>
                    <textarea value={t.text} readOnly style={{ width: '95%', height: '100px' }} />
                  </div>
                );
              }
              return null;
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TranscriptionDisplay;
