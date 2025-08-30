import { getReadingSpeed } from './useAccessibility';

export function useReadTime() {
  function countImages(node: any): number {
    if (!node) return 0;
    let count = 0;
    const type = node.type || node.tag || '';
    if (type === 'image') count += 1;
    // mdast to hast conversion may represent images as elements with tag 'img'
    if (type === 'element' && node.tag === 'img') count += 1;
    const children = node.children || node.body || node.content || [];
    if (Array.isArray(children)) {
      for (const c of children) count += countImages(c);
    }
    return count;
  }
  
  function extractTextFromNode(node: any): string {
    if (!node) return '';
    // If it's already text
    if (typeof node === 'string') return node;
    // mdast-like nodes
    if (Array.isArray(node)) return node.map(extractTextFromNode).join(' ');

    const type = node.type || node.tag || '';
    // Skip code blocks and code-like content for read time
    if (type === 'code' || type === 'inlineCode' || type === 'pre') return '';

    // Text node patterns
    if (node.value && typeof node.value === 'string') return node.value;
    if (node.text && typeof node.text === 'string') return node.text;

    // Children traversal
    const children = node.children || node.body || node.content || [];
    if (Array.isArray(children)) {
      return children.map(extractTextFromNode).join(' ');
    }

    return '';
  }

  function extractPlainText(doc: any): string {
    // Handle Nuxt Content body structure
    if (doc?.body) {
      // Nuxt Content v3 body structure with type/value
      if (doc.body.value && Array.isArray(doc.body.value)) {
        return extractTextFromNode(doc.body.value);
      }
      // Fallback to extracting from full body object
      return extractTextFromNode(doc.body);
    }
    
    // Fallback to content or description
    if (typeof doc?.content === 'string') return doc.content;
    if (typeof doc?.description === 'string') return doc.description;
    return '';
  }

  function countWords(text: string): number {
    if (!text) return 0;
    // Normalize whitespace
    const words = text.replace(/\s+/g, ' ').trim().split(' ');
    return words.filter(Boolean).length;
  }

  function estimateReadTime(doc: any, options?: { wpm?: number; minMinutes?: number }) {
    const wpm = options?.wpm ?? getReadingSpeed();
    const minMinutes = options?.minMinutes ?? 1;
    const text = extractPlainText(doc);
    const words = countWords(text);
    let seconds = words > 0 ? (words / wpm) * 60 : 0;

    // Image adjustment similar to Medium's heuristic
    const body = doc?.body;
    const imageCount = body ? countImages(body) : 0;
    if (imageCount > 0) {
      for (let i = 1; i <= imageCount; i++) {
        const add = i <= 10 ? 12 - (i - 1) : 3; // 12, 11, ... down to 3
        seconds += Math.max(add, 3);
      }
    }

    const minutes = Math.max(Math.ceil(seconds / 60), words > 0 ? minMinutes : 0);
    return { minutes, words, images: imageCount };
  }

  function formatReadTime(minutes: number): string {
    if (minutes <= 0) return '';
    return `${minutes} min read`;
  }

  return { estimateReadTime, formatReadTime };
}