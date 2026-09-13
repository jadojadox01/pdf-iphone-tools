export function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
}

export function report(onStatus, percent, message) {
  const clamped = clampPercent(percent);
  onStatus?.(message, clamped == null ? {} : { percent: clamped });
}

export function span(start, end, index, total) {
  if (!total) return end;
  return start + ((index + 1) / total) * (end - start);
}

export function yieldUi() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }
    setTimeout(resolve, 0);
  });
}
