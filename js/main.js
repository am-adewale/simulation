// js/main.js

import { getAIResponse } from './api.js';
import { addMessageToChat, showLoader } from './dom.js';
import { truncateText, formatAIResponse } from './helpers.js';

// DOM Elements.
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const chatWindow = document.getElementById('chat-window');
const headerSection = document.querySelector('.header');
const promptsContainer = document.querySelector('.prompts');
const promptCards = document.querySelectorAll('.prompt-card');
const searchHistory = document.getElementById('search-history');

let firstQuestionSet = false;

/**
 * Save a user message in search history.
 * @param {string} message 
 */
function saveMessageToHistory(message) {
  const li = document.createElement('li');
  li.textContent = truncateText(message);
  searchHistory.appendChild(li);

  // Optionally, persist the history in localStorage.
  const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
  history.push({ message, sender: 'user', timestamp: new Date().toISOString() });
  localStorage.setItem('chatHistory', JSON.stringify(history));
}

/**
 * Handle sending the user input.
 */
async function handleUserInput() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add the user message to the chat.
  addMessageToChat(chatWindow, message, 'user');

  // Hide quick prompts immediately.
  if (!promptsContainer.classList.contains('hidden')) {
    promptsContainer.classList.add('hidden');
  }

  // On the first question, hide the header and save history.
  if (!firstQuestionSet) {
    saveMessageToHistory(message);
    headerSection.classList.add('hidden');
    firstQuestionSet = true;
  }

  // Clear and refocus the input.
  userInput.value = '';
  userInput.focus();

  // Disable the submit button to prevent duplicates.
  submitBtn.disabled = true;

  // Show a loader.
  const loader = showLoader(chatWindow);

  try {
    // Get the AI response.
    const rawResponse = await getAIResponse(message);
    const aiText = formatAIResponse(rawResponse);

    // Remove loader and enable the button.
    loader.remove();
    submitBtn.disabled = false;

    // Add AI response to the chat.
    addMessageToChat(chatWindow, aiText, 'ai');
  } catch (error) {
    loader.remove();
    submitBtn.disabled = false;
    console.error("Error while getting AI response:", error);
    addMessageToChat(chatWindow, "Sorry, there was an error processing your request. Please try again.", 'ai');
  }
}

// Event listeners.
submitBtn.addEventListener('click', handleUserInput);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});

userInput.addEventListener('input', () => {
  // Hide prompts when the user starts typing.
  if (!promptsContainer.classList.contains('hidden')) {
    promptsContainer.classList.add('hidden');
  }
});

// Handle prompt card clicks.
promptCards.forEach((card) => {
  card.addEventListener('click', () => {
    const promptText = card.querySelector('p').textContent.trim();
    userInput.value = promptText;

    if (!promptsContainer.classList.contains('hidden')) {
      promptsContainer.classList.add('hidden');
    }
  });
});
