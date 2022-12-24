const kana2morse = {
  'ア': '－－・－－',
  'イ': '・－',
  'ウ': '・・－',
  'エ': '－・－－－',
  'オ': '・－・・・',
  'カ': '・－・・',
  'キ': '－・－・・',
  'ク': '・・・－',
  'ケ': '－・－－',
  'コ': '－－－－',
  'サ': '－・－・－',
  'シ': '－－・－・',
  'ス': '－－－・－',
  'セ': '・－－－・',
  'ソ': '－－－・',
  'タ': '－・',
  'チ': '・・－・',
  'ツ': '・－－・',
  'テ': '・－・－－',
  'ト': '・・－・・',
  'ナ': '・－・',
  'ニ': '－・－・',
  'ヌ': '・・・・',
  'ネ': '－－・－',
  'ノ': '・・－－',
  'ハ': '－・・・',
  'ヒ': '－－・・－',
  'フ': '－－・・',
  'ヘ': '・',
  'ホ': '－・・',
  'マ': '－・・－',
  'ミ': '・・－・－',
  'ム': '－',
  'メ': '－・・・－',
  'モ': '－・・－・',
  'ヤ': '・－－',
  'ユ': '－・・－－',
  'ヨ': '－－',
  'ラ': '・・・',
  'リ': '－－・',
  'ル': '－・－－・',
  'レ': '－－－',
  'ロ': '・－・－',
  'ワ': '－・－',
  'ヰ': '・－・・－',
  'ヱ': '・－－・・',
  'ヲ': '・－－－',
  'ン': '・－・－・',
  'ー': '・－－・－',
  '゛': '・・',
  '゜': '・・－－・',
  '、': '・－・－・－',
  '。': '・－・－・・',
  '（': '－・－－・－',
  '）': '・－・・－・',
};

const fullKana2morse = {
  ...kana2morse,
  'ァ': '－－・－－',
  'ィ': '・－',
  'ゥ': '・・－',
  'ェ': '－・－－－',
  'ォ': '・－・・・',
  'ッ': '・－－・',
  'ャ': '・－－',
  'ュ': '－・・－－',
  'ョ': '－－',
  'ヮ': '－・－',
  'ヵ': '・－・・',
  'ヶ': '－・－－',
  'ガ': '・－・・ ・・',
  'ギ': '－・－・・ ・・',
  'グ': '・・・－ ・・',
  'ゲ': '－・－－ ・・',
  'ゴ': '－・－－ ・・',
  'ザ': '－・－・－ ・・',
  'ジ': '－－・－・ ・・',
  'ズ': '－－－・－ ・・',
  'ゼ': '・－－－・ ・・',
  'ゾ': '－－－・ ・・',
  'ダ': '－・ ・・',
  'ヂ': '・・－・ ・・',
  'ヅ': '・－－・ ・・',
  'デ': '・－・－－ ・・',
  'ド': '・・－・・ ・・',
  'バ': '－・・・ ・・',
  'ビ': '－－・・－ ・・',
  'ブ': '－－・・ ・・',
  'ベ': '・ ・・',
  'ボ': '－・・ ・・',
  'パ': '－・・・ ・・－－・',
  'ピ': '－－・・－ ・・－－・',
  'プ': '－－・・ ・・－－・',
  'ペ': '・ ・・－－・',
  'ポ': '－・・ ・・－－・',
  'ヴ': '・・－ ・・',
  'ヷ': '－・－ ・・',
  'ヸ': '・－・・－ ・・',
  'ヹ': '・－－・・ ・・',
  'ヺ': '・－－－ ・・',
};

const morse2kana = Object.keys(kana2morse).reduce((obj, kana) => {
  obj[kana2morse[kana]] = kana;
  return obj;
}, {});

export const decodeMorse = (node) => {
  if (node.nodeType === node.TEXT_NODE) {
    const codes = node.nodeValue.split(' ');
    const kana = codes.map((code) => morse2kana[code] || code).join('');
    node.nodeValue = `≪${kana}≫`;
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      decodeMorse(node.childNodes[i]);
    }
  }
};

export const encodeMorse = (text) => {
  const normalized = text.replace(/[ぁ-ん]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0x60);
  });
  let shouldPrependSpace = false;
  return [...normalized].map((char) => {
    let code;
    if (fullKana2morse[char]) {
      if (shouldPrependSpace) {
        code = ` ${fullKana2morse[char]} `;
      } else {
        code = `${fullKana2morse[char]} `;
      }
      shouldPrependSpace = false;
      return code;
    }
    shouldPrependSpace = true;
    return char;
  }).join('');
};
