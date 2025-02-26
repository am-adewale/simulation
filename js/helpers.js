// js/helpers.js

/**
 * Truncate a long string for display in search history.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength = 50) {
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
}

/**
 * Copy plain text to the clipboard.
 * @param {string} str 
 */
export function copyToClipboard(str) {
  navigator.clipboard.writeText(str).catch(err => {
    console.error('Failed to copy text:', err);
    alert('Failed to copy text to clipboard!');
  });
}

/**
 * Typewriter effect: displays text one character at a time.
 * Supports a stop function via element.stopTypewriter().
 * @param {HTMLElement} element 
 * @param {string} text 
 * @param {number} speed 
 */
export function typeText(element, text, speed = 30) {
  let index = 0;
  element.textContent = ''; // Clear content

  // Flag to signal stopping the effect.
  let stopRequested = false;

  // Attach a stop method to the element.
  element.stopTypewriter = () => { stopRequested = true; };

  function typeNextChar() {
    if (stopRequested) {
      // If stop is requested, display full text immediately.
      element.textContent = text;
      return;
    }
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeNextChar, speed);
    }
  }
  typeNextChar();
}

/**
 * Format the AI response by checking for HTML or Markdown.
 * @param {string} response 
 * @returns {string}
 */
export function formatAIResponse(response) {
  const containsHTML = /<\/?[a-z][\s\S]*>/i.test(response);
  return containsHTML ? formatHTMLResponse(response) : formatMarkdownResponse(response);
}

/**
 * Format HTML response to plain text.
 * @param {string} html 
 * @returns {string}
 */
function formatHTMLResponse(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  let formattedText = '';

  function traverse(node, listCounters = { ol: 0, ul: 0 }) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        formattedText += child.textContent;
      } else if (child.nodeName === 'BR') {
        formattedText += '\n';
      } else if (child.nodeName === 'P') {
        traverse(child, listCounters);
        formattedText += '\n\n';
      } else if (child.nodeName === 'UL' || child.nodeName === 'OL') {
        listCounters[child.nodeName.toLowerCase()] = 0;
        traverse(child, listCounters);
        formattedText += '\n';
      } else if (child.nodeName === 'LI') {
        if (child.parentNode.nodeName === 'OL') {
          listCounters.ol += 1;
          formattedText += `${listCounters.ol}. `;
        } else {
          listCounters.ul += 1;
          formattedText += `${listCounters.ul}. `;
        }
        traverse(child, listCounters);
        formattedText += '\n';
      } else {
        traverse(child, listCounters);
      }
    });
  }

  traverse(doc.body);
  return formattedText.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Format Markdown response to plain text.
 * @param {string} markdown 
 * @returns {string}
 */
function formatMarkdownResponse(markdown) {
  let formattedText = '';
  let listCounter = 0;
  const lines = markdown.split('\n');

  lines.forEach(line => {
    const unorderedListMatch = line.match(/^\*\s+(.*)/);
    const orderedListMatch = line.match(/^(\d+)\.\s+(.*)/);

    if (unorderedListMatch) {
      listCounter += 1;
      formattedText += `${listCounter}. ${unorderedListMatch[1]}\n`;
    } else if (orderedListMatch) {
      formattedText += `${orderedListMatch[1]}. ${orderedListMatch[2]}\n`;
    } else {
      formattedText += line + '\n';
      listCounter = 0;
    }
  });

  return formattedText.replace(/\n{3,}/g, '\n\n').trim();
}
