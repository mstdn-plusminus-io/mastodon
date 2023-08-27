const regex = /(https:\/\/){0,1}?(komiflo\.com\/){0,1}?(comics\/\d+)\/{0,1}(read\/page\/\d+){0,1}/g;

export const komifloLinkify = (node) => {
  if (node.nodeType === node.TEXT_NODE) {
    const text = node.nodeValue;
    const replaced = text.replace(regex, function(s, p1, p2, p3, p4) {
      if (p4) {
        return ` <a href="https://komiflo.com/${p3}/${p4}" alt="${p3}">https://komiflo.com/${p3}/${p4}</a> `;
      }
      return ` <a href="https://komiflo.com/${p3}" alt="komiflo:${p3}">https://komiflo.com/${p3}</a> `;
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
