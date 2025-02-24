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

  // Select DOM elements
const themeToggleBtn = document.querySelector('.theme-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const historyBox = document.querySelector('.history-box');
const closeHistoryBtn = document.querySelector('.close-history');

// Toggle dark mode
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Toggle history sidebar
document.querySelector('.history-toggle-btn').addEventListener('click', () => {
  historyBox.classList.add('show');
});

// Close history sidebar
closeHistoryBtn.addEventListener('click', () => {
  historyBox.classList.remove('show');
});

// Add event listener to the history box to close it if clicked outside
document.addEventListener('click', (e) => {
  if (!historyBox.contains(e.target) && !e.target.classList.contains('history-toggle-btn')) {
    historyBox.classList.remove('show');
  }
});

// Optional: Auto-hide history box after a set period if not interacted with (e.g., 5 seconds)
let historyTimeout;
historyBox.addEventListener('mouseenter', () => {
  clearTimeout(historyTimeout); // Reset timeout when mouse enters
});

historyBox.addEventListener('mouseleave', () => {
  historyTimeout = setTimeout(() => {
    historyBox.classList.remove('show');
  }, 5000); // Hide after 5 seconds
});

  