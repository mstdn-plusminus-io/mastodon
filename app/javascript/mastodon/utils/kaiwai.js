export const decodeAme = (node) => {
  if (node.nodeType === node.TEXT_NODE) {
    const text = node.nodeValue;
    let replaced = 0;
    const kana = text.replace(/[ᕁ-ᖟ]/g, function(s) {
      replaced++;
      const originalCodePoint = s.codePointAt(0);
      const hiraganaCodePoint = parseInt(`30${originalCodePoint.toString(16).slice(2)}`, 16);
      return String.fromCodePoint(hiraganaCodePoint);
    });
    if (replaced > 2) {
      node.nodeValue = `〔${kana}〕`;
    }
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      decodeAme(node.childNodes[i]);
    }
  }
};

export const encodeAme = (text) => {
  return text.replace(/[ぁ-ゖ]/g, function(s) {
    const originalCodePoint = s.codePointAt(0);
    const canadianSyllabicsCodePoint = parseInt(`15${originalCodePoint.toString(16).slice(2)}`, 16);
    return String.fromCodePoint(canadianSyllabicsCodePoint);
  });
};
