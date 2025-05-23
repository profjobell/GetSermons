import React from 'react';
import { GHOST_API_URL } from '../App'; // Assuming App.js exports it

function FileUpload({ addJob, updateJobStatus, addErrorMessage }) {
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempJobId = `upload_${file.name}_${Date.now()}`; // Temporary ID for UI tracking

      // Immediately add job to UI with an initial status
      addJob({
        id: tempJobId, // This is a UI-only ID for now
        type: 'upload',
        name: file.name,
        status: 'uploading',
      });

      console.log(`[FileUpload] Simulating upload for file: ${file.name}`);
      // Simulate API call to a conceptual endpoint that would trigger the backend function
      // In a real Firebase app, this would be client SDK directly to Storage,
      // and the Storage trigger would then call our backend 'handleFileUpload' function.
      // For simulation, we imagine an intermediary HTTP endpoint or just mock the flow.

      try {
        // Mocking the delay and result of an upload and initial processing trigger
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload time

        // This response would conceptually come from our backend *after* it's been triggered
        // by Storage and has created a job document in Firestore.
        const mockApiResponse = {
          message: 'File upload received by backend, processing started (simulated).',
          // serviceJobId is the ID our backend (e.g. Firebase function) would assign
          // and track in Firestore.
          serviceJobId: `serviceJob_${Date.now()}`,
          fileName: file.name,
        };
        console.log('[FileUpload] Mock API Response:', mockApiResponse);

        // Update job with serviceJobId and new status
        updateJobStatus(tempJobId, 'processing_queued', mockApiResponse.serviceJobId);
        // Note: We use tempJobId to find the job in UI state and update it with the serviceJobId

      } catch (error) {
        console.error('[FileUpload] Mock API Call failed:', error);
        addErrorMessage(`Failed to upload file ${file.name}: ${error.message}`);
        updateJobStatus(tempJobId, 'upload_failed');
      }
    }
    // Reset file input to allow uploading the same file again if needed
    event.target.value = null;
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <p>Select one or more files to transcribe.</p>
    </div>
  );
}

export default FileUpload;
