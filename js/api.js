// js/api.js

/**
 * Send a message to the backend and return the AI response.
 * @param {string} message 
 * @returns {Promise<string>}
 */
export async function getAIResponse(message) {
  try {
    const response = await fetch('http://172.20.10.4:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error contacting server:', error);
    return 'Error: Could not contact server.';
  }
}
