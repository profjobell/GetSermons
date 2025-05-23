import React, { useState } from 'react';
import { GHOST_API_URL } from '../App'; // Assuming App.js exports it

function UrlInput({ addJob, updateJobStatus, addErrorMessage }) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url.trim()) {
      addErrorMessage('URL cannot be empty.');
      return;
    }

    const tempJobId = `url_${Date.now()}`; // Temporary ID for UI tracking

    // Immediately add job to UI
    addJob({
      id: tempJobId,
      type: 'url',
      name: url, // Using 'name' to store the URL for consistency with file uploads
      status: 'submitting_url',
    });

    console.log(`[UrlInput] Simulating POST to ${GHOST_API_URL}/processUrl with URL: ${url}`);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock successful API response from our backend /processUrl function
      const mockApiResponse = {
        message: 'URL received, processing started (simulated).',
        url: url,
        // serviceJobId is the ID our backend (e.g. Firebase function) would assign
        // and track in Firestore.
        serviceJobId: `serviceJob_${Date.now()}`,
      };
      console.log('[UrlInput] Mock API Response:', mockApiResponse);

      // Update job with serviceJobId and new status
      updateJobStatus(tempJobId, 'processing_queued', mockApiResponse.serviceJobId);
      setUrl(''); // Clear input field on success
    } catch (error) {
      console.error('[UrlInput] Mock API Call failed:', error);
      addErrorMessage(`Failed to submit URL ${url}: ${error.message}`);
      updateJobStatus(tempJobId, 'url_submission_failed');
    }
  };

  return (
    <div>
      <h2>URL Input</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter media URL"
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button type="submit">Submit URL</button>
      </form>
      <p>Enter a direct URL to an audio or video file.</p>
    </div>
  );
}

export default UrlInput;
