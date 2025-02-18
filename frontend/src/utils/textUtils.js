/**
 * Strips HTML tags and converts common entities to plain text
 * @param {string} html The HTML string to clean
 * @returns {string} Plain text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  // First replace common entities
  const text = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Create a temporary element
  const temp = document.createElement('div');
  temp.innerHTML = text;
  
  // Get text content (strips all HTML)
  return temp.textContent || temp.innerText || '';
};

/**
 * Truncates text to a specified length and adds ellipsis
 * @param {string} text The text to truncate
 * @param {number} length Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 150) => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.substring(0, length).trim() + '...';
}; 