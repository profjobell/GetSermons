import React, { useState, useEffect } from 'react';
import { GHOST_API_URL } from '../App'; // Assuming App.js exports it

function Controls({ transcripts, addTranscript, addErrorMessage }) {
  const [selectedTranscriptId, setSelectedTranscriptId] = useState('');
  const [removalDescriptions, setRemovalDescriptions] = useState('');
  const [availableTranscripts, setAvailableTranscripts] = useState([]);

  useEffect(() => {
    // Populate available transcripts for the dropdown
    // We only want transcripts that have been loaded (i.e., have text)
    const loadedTranscripts = Object.values(transcripts).filter(t => t && t.text);
    setAvailableTranscripts(loadedTranscripts);
    // If no transcript is selected or the selected one is no longer available, reset
    if (!selectedTranscriptId && loadedTranscripts.length > 0) {
        // setSelectedTranscriptId(loadedTranscripts[0].id || loadedTranscripts[0].transcriptId);
    } else if (selectedTranscriptId && !loadedTranscripts.find(t => (t.id || t.transcriptId) === selectedTranscriptId)) {
        // setSelectedTranscriptId(''); // Reset if previously selected one is gone
    }
  }, [transcripts, selectedTranscriptId]);


  const handleContentRemoval = async () => {
    if (!selectedTranscriptId) {
      addErrorMessage('Please select a transcript to modify.');
      return;
    }
    if (!removalDescriptions.trim()) {
      addErrorMessage('Please enter descriptions of content to remove.');
      return;
    }

    const descriptionsArray = removalDescriptions.split('\n').map(d => d.trim()).filter(d => d);
    if (descriptionsArray.length === 0) {
      addErrorMessage('No valid removal descriptions provided.');
      return;
    }

    const targetTranscript = availableTranscripts.find(t => (t.id || t.transcriptId) === selectedTranscriptId);
    if (!targetTranscript) {
      addErrorMessage('Selected transcript not found or is not loaded.');
      return;
    }

    const originalText = targetTranscript.originalText || targetTranscript.text; // Prefer original if available

    console.log(`[Controls] Simulating POST to ${GHOST_API_URL}/removeContent`);
    console.log(`[Controls] Transcript ID: ${selectedTranscriptId}, Descriptions:`, descriptionsArray);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock API response from our backend /removeContent function
      // This should use the actual contentRemover.js logic if we could import it here,
      // but for now, we'll just mock a simplified removal.
      let processedText = originalText;
      descriptionsArray.forEach(desc => {
        const regex = new RegExp(desc.replace(/[.*+?^${}()|[\]\]/g, '\\$&'), 'gi');
        processedText = processedText.replace(regex, '[REMOVED_CONTENT]');
      });
      processedText = processedText.replace(/(\[REMOVED_CONTENT\]\s*)+/g, '[REMOVED_CONTENT]').trim();


      const mockApiResponse = {
        transcriptId: selectedTranscriptId, // The ID of the transcript that was processed
        originalText: originalText,
        processedText: processedText,
        message: 'Content removal simulated successfully.',
      };
      console.log('[Controls] Mock API Response:', mockApiResponse);

      // Update the transcript in App.js state
      // addTranscript should be able to handle updates if transcriptId already exists
      addTranscript(selectedTranscriptId, {
        ...targetTranscript, // Spread existing transcript data
        text: mockApiResponse.processedText, // Update with processed text
        // originalText: mockApiResponse.originalText, // Keep original
        removalHistory: [
          ...(targetTranscript.removalHistory || []),
          { timestamp: new Date().toISOString(), descriptions: descriptionsArray, resultingText: mockApiResponse.processedText }
        ]
      });

      addErrorMessage('Content removal simulation successful. Transcript updated.'); // Use addErrorMessage for success too for now
      setRemovalDescriptions(''); // Clear input
    } catch (error) {
      console.error('[Controls] Mock API Call for content removal failed:', error);
      addErrorMessage(`Failed to process content removal for transcript ${selectedTranscriptId}: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Content Removal Controls</h2>
      {availableTranscripts.length === 0 ? (
        <p>No transcripts available for modification. Please process a file/URL and load a transcript first.</p>
      ) : (
        <>
          <div>
            <label htmlFor="transcriptSelect">Select Transcript to Modify: </label>
            <select
              id="transcriptSelect"
              value={selectedTranscriptId}
              onChange={(e) => setSelectedTranscriptId(e.target.value)}
            >
              <option value="">--Select a Transcript--</option>
              {availableTranscripts.map(t => (
                <option key={t.id || t.transcriptId} value={t.id || t.transcriptId}>
                  Job: {t.jobId || t.serviceJobId} (ID: {t.id || t.transcriptId})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="removalDescriptions">Enter phrases to remove (one per line):</label>
            <textarea
              id="removalDescriptions"
              value={removalDescriptions}
              onChange={(e) => setRemovalDescriptions(e.target.value)}
              placeholder="e.g., remove this sentence&#x0a;and also this phrase"
              rows="4"
              style={{ width: '95%', marginTop: '5px' }}
            />
          </div>

          <button onClick={handleContentRemoval} style={{ marginTop: '10px' }}>
            Apply Content Removal (Simulated)
          </button>
        </>
      )}
    </div>
  );
}

export default Controls;
