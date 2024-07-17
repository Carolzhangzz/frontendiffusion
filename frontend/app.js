import * as api from "./api.js";
import {
  callAPIOnce,
  getStoredPRD,
  generateIdeas,
  getStoredGeneratedCode,
  iterationCounter,
  updateIterationLoading,
  showMultiplePanel,
  showLazyLoadOverlay,
  hideLazyLoadOverlay,
} from "./api.js";
const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
let isDrawing = false;
let currentMode = "";
let startX, startY;
let shapes = [];
let erasedAreas = [];
let selectedShape = null;
let customPrompt = null; // User custom prompt
let undoStack = []; // Stack to store undo states
let redoStack = []; // Stack to store redo states

const callApiButton = document.getElementById("call-api");
const buttonText = callApiButton.querySelector("span");
const buttonIcon = callApiButton.querySelector("img");

//show progress bar when the API is called
function showProgressBar() {
  document.getElementById("progress-container").style.display = "block";
}
//hide progress bar
function hideProgressBar() {
  document.getElementById("progress-container").style.display = "none";
}

//initialize the progress bar for each panel and show the panel for the iteration
function initializeIterationLoading(index) {
  showMultiplePanel(index);
  const frame = document.getElementById(`iteration-${index}`);
  if (frame) {
    updateIterationLoading(index, 0, false);
  }
}

//Call the API for generating Code Once the PRD is generated
document.getElementById("call-api").addEventListener("click", async () => {
  // 显示进度条
  showProgressBar();

  const input = document.getElementById("custom-prompt-input").value;

  if (input) {
    // alert("Custom Prompt Set: " + input);
    customPrompt = input;
    console.log("Custom Prompt Set:", customPrompt);
    // once submit the  custom prompt, switch to the right tab
    rightTab.click();
    // switch to the preview status
    document.querySelector(".toggle-option.preview").click();
  } else {
    alert("Please enter a custom prompt.");
  }

  console.log("Call API button clicked");

  // first call the API to generate PRD
  const svgContent = canvasToSvg();

  let prompt = customPrompt || ""; //make sure prompt is not empty
  try {
    // first time call the API, wait for the PRD and then call the api to generate code based on the PRD
    if (iterationCounter === 0) {
      // multi panel show the lazy load overlay
      showLazyLoadOverlay();
      // call it once the callAPIOnce function starts
      initializeIterationLoading(iterationCounter + 1);
      // update the progress bar for the multi panel
      updateIterationLoading(iterationCounter + 1, 50, false);
      // the first time call the API
      await api.callGeneratePRD(svgContent, prompt); // wait for the PRD to be generated
      const currentStoredPRD = getStoredPRD(); // using the getter method
      if (currentStoredPRD) {
        await callAPIOnce(currentStoredPRD, prompt);
      }
    } else if (iterationCounter > 0 && iterationCounter <= 3) {
      // show the lazy load overlay
      showLazyLoadOverlay();
      const currentStoredPRD = getStoredPRD(); // using the getter method
      const previousCode = getStoredGeneratedCode();
      if (!previousCode) {
        alert("No code generated yet. Please generate code first.");
        return;
      }
      if (!currentStoredPRD) {
        alert("No PRD generated yet. Please generate a PRD first.");
        return;
      }
      // call it once the callAPIOnce function starts
      initializeIterationLoading(iterationCounter + 1);
      updateIterationLoading(iterationCounter + 1, 50, false);
      if (previousCode) {
        // generate ideas based on the previous code
        const ideas = await generateIdeas(previousCode);

        if (!ideas) {
          alert("No ideas generated. Please try again.");
          console.error("No ideas generated. Please try again.");
          return;
        }
        // turn the response ideas into text
        const ideasText = ideas
          .map((idea) => `${idea.title}:\n${idea.description}`)
          .join("\n\n");

        // add the new ideas to the prompt and call the API again
        prompt = `${prompt}\n\nBased on the previous design, here are some new ideas to improve the website:\n${ideasText}\n\nPlease incorporate these ideas into the new design.`;
        console.log("New Prompt with Ideas:", prompt);
        await callAPIOnce(currentStoredPRD, prompt);
      }
    } else {
      console.log("Maximum iterations reached:", iterationCounter);
    }
  } catch (error) {
    console.error("Error in API calls:", error);
  }
});

// Copy code to clipboard
const copyCodeButton = document.getElementById("copy-code");
const originalSvg = copyCodeButton.innerHTML;
const newSvg = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 20.75H6C5.27065 20.75 4.57118 20.4603 4.05546 19.9445C3.53973 19.4288 3.25 18.7293 3.25 18V6C3.25 5.27065 3.53973 4.57118 4.05546 4.05546C4.57118 3.53973 5.27065 3.25 6 3.25H14.86C15.0589 3.25 15.2497 3.32902 15.3903 3.46967C15.531 3.61032 15.61 3.80109 15.61 4C15.61 4.19891 15.531 4.38968 15.3903 4.53033C15.2497 4.67098 15.0589 4.75 14.86 4.75H6C5.66848 4.75 5.35054 4.8817 5.11612 5.11612C4.8817 5.35054 4.75 5.66848 4.75 6V18C4.75 18.3315 4.8817 18.6495 5.11612 18.8839C5.35054 19.1183 5.66848 19.25 6 19.25H18C18.3315 19.25 18.6495 19.1183 18.8839 18.8839C19.1183 18.6495 19.25 18.3315 19.25 18V10.29C19.25 10.0911 19.329 9.90032 19.4697 9.75967C19.6103 9.61902 19.8011 9.54 20 9.54C20.1989 9.54 20.3897 9.61902 20.5303 9.75967C20.671 9.90032 20.75 10.0911 20.75 10.29V18C20.75 18.7293 20.4603 19.4288 19.9445 19.9445C19.4288 20.4603 18.7293 20.75 18 20.75Z" fill="#000000"/>
<path d="M10.5 15.25C10.3071 15.2352 10.1276 15.1455 10 15L7.00001 12C6.93317 11.86 6.91136 11.7028 6.93759 11.5499C6.96382 11.3971 7.03679 11.2561 7.14646 11.1464C7.25613 11.0368 7.3971 10.9638 7.54996 10.9376C7.70282 10.9113 7.86006 10.9331 8.00001 11L10.47 13.47L19 4.99998C19.14 4.93314 19.2972 4.91133 19.4501 4.93756C19.6029 4.96379 19.7439 5.03676 19.8536 5.14643C19.9632 5.2561 20.0362 5.39707 20.0624 5.54993C20.0887 5.70279 20.0669 5.86003 20 5.99998L11 15C10.8724 15.1455 10.693 15.2352 10.5 15.25Z" fill="#000000"/>
</svg>
`;

copyCodeButton.addEventListener("click", () => {
  // Modify to copy code directly from the iframe's srcdoc
  const iframe = document.getElementById("output-iframe");
  const code = iframe.srcdoc;
  navigator.clipboard
    .writeText(code)
    .then(() => {
      copyCodeButton.innerHTML = newSvg;
      // after 2 seconds, revert back to the original SVG icon
      setTimeout(() => {
        copyCodeButton.innerHTML = originalSvg;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
});
// Get corrected coordinates
function getCorrectedCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

const leftTab = document.getElementById("left-tab");
const rightTab = document.getElementById("right-tab");
const promptArea = document.getElementById("prompt-area");
const codeArea = document.getElementById("code-area");
const previewToggle = document.querySelector(".toggle-option.preview");
const codeToggle = document.querySelector(".toggle-option.active");
const iframeContainer = document.getElementById("iframe-container");
const outputPre = document.getElementById("output");
const outputContainer = document.getElementById("output-container");
const outputArea = document.querySelector(".output-area");

// toggle the tab content and toggle the narrow and wide width
document.addEventListener("DOMContentLoaded", function () {
  function setNarrowWidth() {
    outputContainer.classList.add("narrow");
    outputContainer.classList.remove("wide");
    outputArea.classList.add("narrow");
    outputArea.classList.remove("wide");
  }
  function setWideWidth() {
    outputContainer.classList.add("wide");
    outputContainer.classList.remove("narrow");
    outputArea.classList.add("wide");
    outputArea.classList.remove("narrow");
  }

  leftTab.addEventListener("click", function () {
    setNarrowWidth();
  });

  rightTab.addEventListener("click", function () {
    setWideWidth();
  });

  // set the initial width based on the active tab 
  if (leftTab.classList.contains("active")) {
    setNarrowWidth();
  } else {
    setWideWidth();
  }

  function switchTab(activeTab, activeContent, inactiveTab, inactiveContent) {
    activeTab.classList.add("active");
    activeContent.classList.add("active");
    inactiveTab.classList.remove("active");
    inactiveContent.classList.remove("active");
  }

  function switchCodeView(activeView, inactiveView) {
    activeView.style.display = "block";
    inactiveView.style.display = "none";
  }

  leftTab.addEventListener("click", function () {
    switchTab(leftTab, promptArea, rightTab, codeArea);
  });

  rightTab.addEventListener("click", function () {
    switchTab(rightTab, codeArea, leftTab, promptArea);
  });

  previewToggle.addEventListener("click", function () {
    previewToggle.classList.add("active");
    codeToggle.classList.remove("active");
    switchCodeView(iframeContainer, outputPre);
  });

  codeToggle.addEventListener("click", function () {
    codeToggle.classList.add("active");
    previewToggle.classList.remove("active");
    switchCodeView(outputPre, iframeContainer);
  });
});

// Convert Canvas content to SVG
function canvasToSvg() {
  let svgElements = shapes
    .map((shape) => {
      switch (shape.type) {
        case "rect":
          return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" stroke="black" fill="none" />`;
        case "circle":
          return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" stroke="black" fill="none" />`;
        case "line":
          return `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="black" />`;
        case "freehand":
          return `<path d="${shape.path}" stroke="black" fill="none" />`;
        case "text":
          return `<text x="${shape.x}" y="${shape.y}" font-family="Arial" font-size="20" fill="black">${shape.text}</text>`;
      }
    })
    .join("\n");
  let eraseElements = erasedAreas
    .map((area) => {
      return `<rect x="${area.x}" y="${area.y}" width="${area.size}" height="${area.size}" fill="white" />`;
    })
    .join("\n");
  return `
        <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
            ${svgElements}
            ${eraseElements}
        </svg>
    `;
}

// Start moving
// Start moving
function startMoving(event) {
  const { x, y } = getCorrectedCoordinates(event);
  selectedShape = shapes.find((shape) => isPointInShape(x, y, shape));
  if (selectedShape) {
    isDrawing = true;
    startX = x;
    startY = y;
    offsetX = x - (selectedShape.x || selectedShape.cx || selectedShape.x1); // 定义 offsetX
    offsetY = y - (selectedShape.y || selectedShape.cy || selectedShape.y1); // 定义 offsetY
  }
}

// Moving process
function moving(event) {
  if (!isDrawing || !selectedShape) return;
  const { x, y } = getCorrectedCoordinates(event);
  const newX = x - offsetX;
  const newY = y - offsetY;

  switch (selectedShape.type) {
    case "rect":
      selectedShape.x = newX;
      selectedShape.y = newY;
      break;
    case "circle":
      selectedShape.cx = newX;
      selectedShape.cy = newY;
      break;
    case "line":
      const dx = newX - startX;
      const dy = newY - startY;
      selectedShape.x1 += dx;
      selectedShape.y1 += dy;
      selectedShape.x2 += dx;
      selectedShape.y2 += dy;
      startX = newX;
      startY = newY;
      break;
    case "text":
      selectedShape.x = newX;
      selectedShape.y = newY;
      break;
  }

  redrawShapes();
}

// Stop moving
function stopMoving() {
  if (isDrawing) {
    isDrawing = false;
    selectedShape = null;
  }
}

// Check if point is within shape
function isPointInShape(x, y, shape) {
  switch (shape.type) {
    case "rect":
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    case "circle":
      const distX = x - shape.cx;
      const distY = y - shape.cy;
      return Math.sqrt(distX * distX + distY * distY) <= shape.r;
    case "line":
      const dist1 = Math.sqrt((x - shape.x1) ** 2 + (y - shape.y1) ** 2);
      const dist2 = Math.sqrt((x - shape.x2) ** 2 + (y - shape.y2) ** 2);
      const lineDist = Math.sqrt(
        (shape.x2 - shape.x1) ** 2 + (shape.y2 - shape.y1) ** 2
      );
      return dist1 + dist2 <= lineDist + 1;
    case "text":
      const textWidth = ctx.measureText(shape.text).width;
      const textHeight = 20; // Assuming 20px font size
      return (
        x >= shape.x &&
        x <= shape.x + textWidth &&
        y >= shape.y - textHeight &&
        y <= shape.y
      );
  }
}

// Clear existing event listeners
function clearEventListeners() {
  canvas.onmousedown = null;
  canvas.onmousemove = null;
  canvas.onmouseup = null;
}

// Function to set the drawing mode
function setMode(mode) {
  console.log("Setting mode to:", mode);
  currentMode = mode;
  clearEventListeners();

  if (mode === "") {
    console.log("Clearing all modes");
    return;
  }

  if (mode === "erase") {
    canvas.onmousedown = startErasing;
    canvas.onmousemove = erasing;
    canvas.onmouseup = stopErasing;
  } else if (mode === "freehand") {
    canvas.onmousedown = startFreehand;
    canvas.onmousemove = freehand;
    canvas.onmouseup = stopFreehand;
  } else if (mode === "text") {
    canvas.onmousedown = addText;
  } else if (mode === "move") {
    canvas.onmousedown = startMoving;
    canvas.onmousemove = moving;
    canvas.onmouseup = stopMoving;
  } else {
    canvas.onmousedown = startDrawing;
    canvas.onmousemove = drawing;
    canvas.onmouseup = stopDrawing;
  }
}

//function to start drawing
function startDrawing(event) {
  isDrawing = true;
  const { x, y } = getCorrectedCoordinates(event);
  startX = x;
  startY = y;
  ctx.beginPath();

  // clear the redo stack 
  redoStack = [];

  // use the imageData to store the current state of the canvas 
  ctx.putImageData(imageData, 0, 0);
}

// Drawing process
function drawing(event) {
  if (!isDrawing) return;
  const { x, y } = getCorrectedCoordinates(event);
  const currentX = x;
  const currentY = y;
  ctx.putImageData(imageData, 0, 0);

  ctx.beginPath();
  switch (currentMode) {
    case "rect":
      ctx.rect(startX, startY, currentX - startX, currentY - startY);
      break;
    case "circle":
      const radius = Math.sqrt(
        Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
      );
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      break;
    case "line":
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      break;
  }
  ctx.stroke();
}

// Stop drawing
function stopDrawing(event) {
  if (isDrawing) {
    isDrawing = false;
    const { x, y } = getCorrectedCoordinates(event);
    const currentX = x;
    const currentY = y;

    switch (currentMode) {
      case "rect":
        shapes.push({
          type: "rect",
          x: startX,
          y: startY,
          width: currentX - startX,
          height: currentY - startY,
        });
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
        );
        shapes.push({ type: "circle", cx: startX, cy: startY, r: radius });
        break;
      case "line":
        shapes.push({
          type: "line",
          x1: startX,
          y1: startY,
          x2: currentX,
          y2: currentY,
        });
        break;
    }

    saveState();
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}

// Start freehand drawing
function startFreehand(event) {
  redoStack = [];
  isDrawing = true;
  const { x, y } = getCorrectedCoordinates(event);
  startX = x;
  startY = y;
  ctx.beginPath();
  ctx.moveTo(x, y);
  shapes.push({ type: "freehand", path: `M ${x} ${y}` });
}

// Freehand drawing process
function freehand(event) {
  if (!isDrawing) return;
  const { x, y } = getCorrectedCoordinates(event);
  ctx.lineTo(x, y);
  ctx.stroke();
  shapes[shapes.length - 1].path += ` L ${x} ${y}`;
}

// Stop freehand drawing
function stopFreehand(event) {
  if (isDrawing) {
    isDrawing = false;
    saveState();
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redrawShapes();
  }
}

// Add text
function addText(event) {
  const { x, y } = getCorrectedCoordinates(event);
  const text = prompt("Enter text:");
  if (text) {
    ctx.font = "20px Arial";
    ctx.fillText(text, x, y);
    shapes.push({ type: "text", x: x, y: y, text: text });
    saveState();
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}

// Select text
function selectText(event) {
  const { x, y } = getCorrectedCoordinates(event);
  selectedShape = shapes.find(
    (shape) => shape.type === "text" && isPointInText(x, y, shape)
  );
  if (selectedShape) {
    const newText = prompt("Edit text:", selectedShape.text);
    if (newText !== null) {
      selectedShape.text = newText;
      saveState();
      redrawShapes();
    }
  }
}

// Check if a point is within the text
function isPointInText(x, y, shape) {
  const textWidth = ctx.measureText(shape.text).width;
  const textHeight = 20; // Assuming 20px font size
  return (
    x >= shape.x &&
    x <= shape.x + textWidth &&
    y >= shape.y - textHeight &&
    y <= shape.y
  );
}

// Move text
function moveText(event) {
  if (!isDrawing || !selectedShape) return;
  const { x, y } = getCorrectedCoordinates(event);
  const dx = x - startX;
  const dy = y - startY;
  selectedShape.x += dx;
  selectedShape.y += dy;
  startX = x;
  startY = y;

  redrawShapes();
}

// Deselect text
function deselectText(event) {
  if (isDrawing) {
    isDrawing = false;
    selectedShape = null;
    saveState();
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}

// Save the current state
function saveState() {
  undoStack.push({
    shapes: JSON.parse(JSON.stringify(shapes)),
    erasedAreas: JSON.parse(JSON.stringify(erasedAreas)),
    imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
  });
}

document.getElementById("undo").addEventListener("click", () => {
  if (undoStack.length > 1) {
    // 保留初始状态
    redoStack.push(undoStack.pop());
    const state = undoStack[undoStack.length - 1];
    shapes = state.shapes;
    erasedAreas = state.erasedAreas;
    ctx.putImageData(state.imageData, 0, 0);
    imageData = state.imageData; // 更新 imageData
  }
});

document.getElementById("redo").addEventListener("click", () => {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    undoStack.push(state);
    shapes = state.shapes;
    erasedAreas = state.erasedAreas;
    ctx.putImageData(state.imageData, 0, 0);
    imageData = state.imageData; // 更新 imageData
  }
});

// Redraw all shapes
function redrawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach((shape) => {
    switch (shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
        break;
      case "freehand":
        ctx.beginPath();
        const path = new Path2D(shape.path);
        ctx.stroke(path);
        break;
      case "text":
        ctx.font = "20px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
        break;
    }
  });
  // 应用擦除区域
  erasedAreas.forEach((area) => {
    ctx.clearRect(area.x, area.y, area.size, area.size);
  });
}

const buttons = document.querySelectorAll("#controls button");

// Function to remove the 'selected' class from all buttons
function clearSelection() {
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });
}

// Add click event listener to each button
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const wasSelected = button.classList.contains("selected");

    clearSelection(); // Clear previous selection if any
    if (wasSelected) {
      setMode(""); // Clear current mode and disable canvas
    } else {
      button.classList.add("selected"); // Add 'selected' class to clicked button
      const mode = button.id
        .replace("draw-", "")
        .replace("add-", "")
        .replace("hand-", "")
        .replace("call-", "")
        .replace("custom-", "");
      setMode(mode); // Set mode based on button id
    }

    // prevent the default behavior
    event.stopPropagation();
    event.preventDefault();
  });
});

// Select drawing type buttons
document.getElementById("hand-move").addEventListener("click", () => {
  console.log("Hand Move button clicked");
});

// Select drawing type buttons
document.getElementById("draw-rect").addEventListener("click", () => {
  console.log("Draw Rectangle button clicked");
});

document.getElementById("draw-circle").addEventListener("click", () => {
  console.log("Draw Circle button clicked");
});

document.getElementById("draw-line").addEventListener("click", () => {
  console.log("Draw Line button clicked");
});

document.getElementById("draw-freehand").addEventListener("click", () => {
  console.log("Draw Freehand button clicked");
});
document.getElementById("add-text").addEventListener("click", () => {
  console.log("Add Text button clicked");
});

// Initial call to fill code output
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
