let pendingFiles = [];
let pendingTool = "";

export function setPendingFiles(files, toolSlug = "") {
  pendingFiles = Array.from(files || []);
  pendingTool = toolSlug || "";
}

export function takePendingFiles(toolSlug = "") {
  if (toolSlug && pendingTool && pendingTool !== toolSlug) {
    return [];
  }
  const files = pendingFiles;
  pendingFiles = [];
  pendingTool = "";
  return files;
}
