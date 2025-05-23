# Conceptual Firestore Data Models

This document outlines the conceptual structure of data to be stored in Firestore.

## `transcriptionJobs` Collection

Stores information about each transcription job initiated by a user.

- **jobId** (String, Document ID): Unique identifier for the transcription job.
- **userId** (String, Optional): Identifier for the user who initiated the job (if authentication is implemented).
- **sourceType** (String): Type of the media source (e.g., "upload", "url").
- **sourceIdentifier** (String): Name of the uploaded file or the URL of the media.
- **status** (String): Current status of the job (e.g., "pending", "processing", "completed", "failed").
- **createdAt** (Timestamp): When the job was created.
- **updatedAt** (Timestamp): When the job status was last updated.
- **fileMetadata** (Object, Optional): Metadata for uploaded files (e.g., size, type).
    - `name` (String)
    - `size` (Number)
    - `contentType` (String)
- **transcriptId** (String, Optional): Identifier for the resulting transcript in the `transcripts` collection (once available).
- **errorDetails** (String, Optional): Error message if the job failed.

## `transcripts` Collection

Stores the actual transcription results.

- **transcriptId** (String, Document ID): Unique identifier for the transcript.
- **jobId** (String): Identifier of the job that generated this transcript (links back to `transcriptionJobs`).
- **originalTranscript** (String): The raw transcript text from the transcription service.
- **formattedTranscript** (String, Optional): Transcript with user-applied formatting (e.g., timestamps, speaker labels).
- **contentRemovalHistory** (Array of Objects, Optional): Log of content removal operations.
    - `timestamp` (Timestamp)
    - `removedDescriptions` (Array of Strings)
    - `resultingTranscriptSnapshot` (String)
- **createdAt** (Timestamp): When the transcript was first saved.
- **lastModified** (Timestamp): When the transcript was last modified (e.g., due to formatting or content removal).
