export const extractLexicalText = (content: unknown): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;

  if (typeof content !== 'object' || content === null) {
    return '';
  }

  const lexicalContent = content as Record<string, unknown>;
  const rootContent = lexicalContent.root as Record<string, unknown> | undefined;

  if (!rootContent || !Array.isArray(rootContent.children)) return '';
  let text = '';

  const traverse = (node: unknown) => {
    if (typeof node !== 'object' || node === null) return;

    const lexicalNode = node as Record<string, unknown>;

    if (lexicalNode.type === 'text' && typeof lexicalNode.text === 'string') {
      text += lexicalNode.text;
    }
    if (Array.isArray(lexicalNode.children)) {
      lexicalNode.children.forEach(traverse);
    }
  };

  traverse(rootContent);
  return text.trim();
};
