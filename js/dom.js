// js/dom.js

import { typeText, copyToClipboard } from './helpers.js';

/**
 * Append a chat message bubble to the chat window.
 * @param {HTMLElement} chatWindow 
 * @param {string} text 
 * @param {('ai'|'user')} sender 
 */
export function addMessageToChat(chatWindow, text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message', sender);

  const msgContent = document.createElement('div');
  msgContent.classList.add('message-content');
  msgDiv.appendChild(msgContent);

  if (sender === 'ai') {
    // Use the typewriter effect.
    typeText(msgContent, text, 30);

    // Create actions container.
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('message-actions');

    // --- Copy Button ---
    const copyBtn = document.createElement('button');
    copyBtn.title = 'Copy';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.addEventListener('click', () => {
      try {
        copyToClipboard(text);
        alert('AI response copied!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy the AI response.');
      }
    });
    actionsDiv.appendChild(copyBtn);

    // --- Regenerate Button (Placeholder) ---
    const regenBtn = document.createElement('button');
    regenBtn.title = 'Regenerate';
    regenBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    regenBtn.addEventListener('click', () => {
      alert('Regenerate clicked for: ' + text);
      // Add your logic for regenerating the response.
    });
    actionsDiv.appendChild(regenBtn);

    // --- Stop Button ---
    const stopBtn = document.createElement('button');
    stopBtn.title = 'Stop';
    stopBtn.innerHTML = '<i class="fas fa-stop"></i>';
    stopBtn.addEventListener('click', () => {
      if (msgContent.stopTypewriter) {
        msgContent.stopTypewriter();
      }
    });
    actionsDiv.appendChild(stopBtn);

    // --- Share Button (Placeholder) ---
    const shareBtn = document.createElement('button');
    shareBtn.title = 'Share';
    shareBtn.innerHTML = '<i class="fas fa-share"></i>';
    shareBtn.addEventListener('click', () => {
      alert('Share functionality coming soon!');
      // Add logic to share the response.
    });
    actionsDiv.appendChild(shareBtn);

    msgDiv.appendChild(actionsDiv);
  } else {
    // For user messages, display text directly.
    msgContent.textContent = text;
  }

  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Show a loader in the chat window while waiting for the AI response.
 * @param {HTMLElement} chatWindow 
 * @returns {HTMLElement} The loader element.
 */
export function showLoader(chatWindow) {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  loader.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;
  chatWindow.appendChild(loader);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return loader;
}
