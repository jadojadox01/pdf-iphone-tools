export function blobToObjectUrl(blob) {
  return URL.createObjectURL(blob);
}

export function revokeUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

export function downloadBlob(blob, filename) {
  const url = blobToObjectUrl(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => revokeUrl(url), 4000);
}

export function bytesToBlob(bytes, mime) {
  return new Blob([bytes], { type: mime });
}
