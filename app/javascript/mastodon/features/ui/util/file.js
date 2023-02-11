export const download = (fileName, body) => {
  const blob = new Blob([body], { type: 'text/plain' });

  const a = document.createElement('a');
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
};

export const open = (accept) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.type = 'file';
  input.accept = accept;

  return new Promise((resolve) => {
    input.onchange = async (ev) => {
      const { files } = ev.target;
      if (!files || files.length === 0) {
        resolve(null);
      }
      const file = files[0];
      resolve(await file.text());
      document.body.removeChild(input);
    };
    input.onabort = () => {
      document.body.removeChild(input);
    };
    input.click();
  });
};
