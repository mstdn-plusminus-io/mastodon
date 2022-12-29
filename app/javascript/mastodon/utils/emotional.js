const codePoints = {
  base: {
    A: 0x41,
    a: 0x61,
  },
  boldSerif: {
    A: 0x1D400,
    a: 0x1D41A,
    mapping: {},
  },
  italicSerif: {
    A: 0x1D434,
    a: 0x1D44E,
    mapping: {
      h: 'ℎ',
    },
  },
  boldItalicSerif: {
    A: 0x1D468,
    a: 0x1D482,
    mapping: {},
  },
  boldSansSerif: {
    A: 0x1D5D4,
    a: 0x1D5EE,
    mapping: {},
  },
  italicSansSerif: {
    A: 0x1D608,
    a: 0x1D622,
    mapping: {},
  },
  boldItalicSansSerif: {
    A: 0x1D63C,
    a: 0x1D656,
    mapping: {},
  },
  boldScript: {
    A: 0x1D4D0,
    a: 0x1D4EA,
    mapping: {},
  },
  fraktur: {
    A: 0x1D504,
    a: 0x1D51E,
    mapping: {
      C: 'ℭ',
      H: 'ℌ',
      I: 'ℑ',
      R: 'ℜ',
      Z: 'ℨ',
    },
  },
  frakturBold: {
    A: 0x1D56C,
    a: 0x1D586,
    mapping: {},
  },
  monoSpace: {
    A: 0x1D670,
    a: 0x1D68A,
    mapping: {},
  },
};

export const text2emotional = (text, type) => {
  const base = codePoints.base;
  const target = codePoints[type];
  return text.replace(/[A-Z]/g, function(c) {
    if (target.mapping[c]) {
      return target.mapping[c];
    }
    return String.fromCodePoint(c.charCodeAt(0) + target.A - base.A);
  }).replace(/[a-z]/g, function(c) {
    if (target.mapping[c]) {
      return target.mapping[c];
    }
    return String.fromCodePoint(c.charCodeAt(0) + target.a - base.a);
  });
};
