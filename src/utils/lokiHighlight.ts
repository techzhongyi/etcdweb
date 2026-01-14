/**
 * 高亮关键词（防止 XSS）
 */
export function highlightKeyword(text: string | number, keyword: string): string {
  if (!keyword || !text) {
    return escapeHtml(String(text || ''));
  }

  const escapedText = escapeHtml(String(text));
  const escapedKeyword = escapeRegex(keyword);
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');

  // 使用黄色高亮，适配深色主题
  return escapedText.replace(
    regex,
    '<mark style="background-color: rgba(250, 195, 90, 0.3); color: #fac35a; padding: 0 2px; border-radius: 2px; font-weight: 600;">$1</mark>',
  );
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
