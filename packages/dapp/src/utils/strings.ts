// Makes shorter text with ellipsis in the center
export const centerEllipsis = (text: string, width = 4, prefix = 2): string =>
  text
    ? text.length > ((width * 2) + prefix)
      ? `${text.substring(0, width + prefix)}...${text.substring(text.length - width - prefix)}`
      : text
    : '';

// Copies text to clipboard
export const copyToClipboard = (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator
      .clipboard
      .writeText(text)
      .then(resolve => resolve);
  } else {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}
