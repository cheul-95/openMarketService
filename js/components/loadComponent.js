export async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
  }
  if (elementId == "header") {
    const { initHeader } = await import("../components/header/header.js");
    initHeader();
  }
}
