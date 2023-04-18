export const komifloLinkify = (node) => {
  if (node.nodeType === node.TEXT_NODE) {
    const text = node.nodeValue;
    const replaced = text.replace(/(comics\/\d+)/g, function(s) {
      return ` <a href="https://komiflo.com/${s}" alt="${s}">https://komiflo.com/${s}</a> `;
    });
    const span = document.createElement('span');
    span.innerHTML = replaced;
    node.replaceWith(span);
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      komifloLinkify(node.childNodes[i]);
    }
  }
};
