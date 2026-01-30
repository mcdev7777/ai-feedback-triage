export interface TriageRequest {
  text: string;
}

export interface TriageResponse {
  feedback_text: string;
  category: 'Bug Report' | 'Feature Request' | 'Praise/Positive Feedback' | 'General Inquiry';
  urgency_score: 1 | 2 | 3 | 4 | 5;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status_code: number;
}