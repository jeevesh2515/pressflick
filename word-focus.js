const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

export function focusWords(block) {
  if (!finePointer.matches) return;
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (/\S/.test(node.data) && !node.parentElement.closest('a, button, mark, .focus-word, [role="status"]')) nodes.push(node);
  }
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s/.test(part)) {
        fragment.append(part);
      } else {
        const word = document.createElement('span');
        word.className = 'focus-word';
        word.textContent = part;
        fragment.append(word);
      }
    }
    node.replaceWith(fragment);
  }
}

document.querySelectorAll('p, .info li, .practical-details dd, header > span, .demo figcaption > span').forEach(focusWords);
