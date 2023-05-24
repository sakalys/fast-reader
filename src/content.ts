let isBold = false;

function boldify(text: string): string {
  if (text.trim() === '') {
    return text;
  }

  const parts = text.split(' ').map(part => {
    if (part.trim() === '') {
      return part;
    }

    let mid = Math.floor(part.length / 2);
    if (mid === 0) {
      return part;
    }

    const len = Math.min(Math.max(mid + 1, 3), part.length);

    return `<span class="frb-pref">${part.slice(0, len)}</span>${part.slice(len)}`;
  });

  return parts.join(' ');
}

function traverse(node: ChildNode, parent: HTMLElement, callback: (node: HTMLElement, parent: HTMLElement) => void) {
  const children = Array.from(node.childNodes);
  for (let i = 0; i < children.length; i++) {
    traverse(children[i], node as HTMLElement, callback);
  }
  callback(node as HTMLElement, parent);
}

function setupText() {
  traverse(document.body, document.body.parentElement, (node, parent) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '') {
      const textContent = node.textContent || '';
      const modifiedTextContent = boldify(textContent);
      // node.innerHTML = modifiedTextContent;
      const nodeClone = document.createElement('span');
      (nodeClone as HTMLElement).innerHTML = modifiedTextContent;
      parent.replaceChild(nodeClone, node)
      // node.textContent = textContent;;
    }
  });
}

// Listen for a message from the background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'toggle') {
    if (!isBold) {
      setupText()

      const style = document.createElement('style');
      style.innerHTML = `
      * {
        font-family: "Verdana" !important;
      }
      .frb-pref {
        font-weight: bold;
      }`
      document.head.appendChild(style);
      isBold = true;
    }
  }
});
