export let apiCallsEnabled = false;
export let iterationCounter = 0;
let storedGeneratedCode = "";
let iterationCodes = ["", "", "", ""]; // store the code for each iteration
let _storedPRD = null;

export function setStoredGeneratedCode(code) {
  storedGeneratedCode = code; 
}

export function getStoredGeneratedCode() {
  return storedGeneratedCode;
}

export function getStoredPRD() {
  return _storedPRD;
}

export function setStoredPRD(prd) {
  _storedPRD = prd;
}
export const output = document.getElementById("output");


//hide progress bar
function hideProgressBar() {
  document.getElementById("progress-container").style.display = "none";
}
export function showMultiplePanel(index) {
  const panel = document.getElementById("multiple-panel");
  panel.style.display = "flex";
  for (let i = 1; i <= 4; i++) {
    const frame = document.getElementById(`iteration-${i}`);
    if (frame) {
      if (i <= index) {
        frame.style.display = "block"; // show the frame 
      } else {
        frame.style.display = "none"; // hide the frame
      }
    }
  }
}

// function for the multiple panel progress bar
export function updateIterationLoading(index, progress, isComplete = false) {
  const frame = document.getElementById(`iteration-${index}`);
  if (frame) {
    const loadingOverlay = frame.querySelector(".loading-overlay");
    const loadingBar = frame.querySelector(".loading-bar");
    if (loadingBar) {
      loadingBar.style.width = `${progress}%`;
    }
    if (isComplete) {
      if (loadingOverlay) {
        loadingOverlay.classList.add("hidden");
      }
    }
  }
}

//CAll the API to Generate PRD from the SVG content
const callApiButton = document.getElementById("call-api");
const buttonText = callApiButton.querySelector("span");
const buttonIcon = callApiButton.querySelector("img");
const outputIframe = document.getElementById("output-iframe");
export async function callGeneratePRD(svgContent, userPrompt) {
  updateProgress("Loading...", 0);
  callApiButton.style.width = "11rem";
  callApiButton.style.backgroundColor = "white";
  buttonIcon.src = "/ICONS/load.gif";
  buttonText.textContent = "Generating Prd...";
  buttonText.style.color = "black";

  try {
    console.log("Attempting to call generate-prd API...");
    const response = await fetch("http://localhost:3000/api/generate-prd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        svg: svgContent,
        userPrompt: userPrompt,
      }),
    });

    console.log("Response received:", response);

    if (response.ok) {
      animateProgress(0, 12.5, 2000, "Loading..."); // 2 seconds animation
      const result = await response.json();
      setStoredPRD(result.prd);
      output.textContent = result.prd;
   
      // deal with the imageUrls but not alert the error
      if (result.imageUrls) {
        result.imageUrls.forEach(img => {
          if (img.error) {
            console.warn(`Failed to fetch image for ${img.term}: ${img.error}`);
            // can set a default image URL here 
          } else {
            console.log(`Image URL for ${img.term}: ${img.imageUrl}`);
            // can use the image URL here
          }
        });
      }   
    } else {
      console.error("API call failed, status:", response.status);
      const errorText = await response.text();
      console.error("Error details:", errorText);
    }
  } catch (error) {
    console.error("Error in fetch operation:", error);
    console.error("Error stack:", error.stack);
  } finally {
    callApiButton.style.width = "8rem";
    callApiButton.style.backgroundColor = "#3c6ce4";
    buttonIcon.src = "/ICONS/call-api.svg";
    buttonText.textContent = "Generate";
    buttonText.style.color = "white";
  }
}

// call the API to generate ideas
export async function generateIdeas(previousCode) {
  //after the first code generated
  if (iterationCounter == 1) {
    animateProgress(12.5, 25, 2000, "Loading..."); // 2 seconds animation
  }
  
  if (iterationCounter == 2) {
    animateProgress(50, 65, 2000, "Loading..."); // 2 seconds animation
  }

  if (iterationCounter == 3) {
    animateProgress(75, 85, 2000, "Loading..."); // 2 seconds animation
  }

  callApiButton.style.width = "11rem"; 
  callApiButton.style.backgroundColor = "white";
  buttonIcon.src = "/ICONS/load.gif"; 
  buttonText.textContent = "Generating Ideas...";
  buttonText.style.color = "black";
  if (!previousCode) {
    console.error("Missing required parameters for generating ideas");
    return "";
  }
  try {
    const requestBody = {
      previousCode: previousCode,
    };

    console.log(
      "Request Body for generate-ideas:",
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch("http://localhost:3000/api/generate-ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Received ideas from server:", result.ideas); 
      return result.ideas;
    } else {
      console.error(
        "Failed to generate ideas:",
        response.status,
        response.statusText
      );
      return "";
    }
  } catch (error) {
    console.error("Error in generating ideas:", error);
    throw error; 
  }
}

// Call the Anthropic API once to generate code
export async function callAPIOnce(_storedPRD, userPrompt = null) {
  // if (!apiCallsEnabled) {
  //   console.log("API calls are disabled due to previous errors.");
  //   return;
  // }
  console.log("callAPIOnce called with storedPRD:", _storedPRD); 

  // show the lazy load overlay 
  // const lazyLoadOverlay = document.querySelector(".lazy-load-overlay");
  // if (lazyLoadOverlay) {
  //   lazyLoadOverlay.style.display = "flex";
  // }

  callApiButton.style.width = "11rem"; 
  callApiButton.style.backgroundColor = "white";
  buttonIcon.src = "/ICONS/load.gif"; 
  buttonText.textContent = "Generating Code...";
  buttonText.style.color = "black";

  try {
    const requestBody = {
      iteration: iterationCounter,
      userPrompt: userPrompt, // use the user prompt  
    };

    console.log("Request Body:", JSON.stringify(requestBody, null, 2)); // Log the request body

    const response = await fetch("http://localhost:3000/api/generate-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      let cleanCode = result.generatedCode;

      // Remove any non-HTML content before the <!DOCTYPE html>
      cleanCode = cleanCode.replace(/^[\s\S]*?(<!DOCTYPE html>)/, "$1");

      // Remove any non-HTML content after </html>
      cleanCode = cleanCode.replace(/(<\/html>)[\s\S]*$/, "$1");

      // check if the code is generated successfully 
      if (cleanCode.trim()) {
        if (iterationCounter === 0) {
          updateIterationLoading(iterationCounter + 1, 100, true);
          animateProgress(
            12.5,
            25,
            2000,
            `Iteration No.${iterationCounter + 1}`
          );
        }
        if (iterationCounter === 1) {
          updateIterationLoading(iterationCounter + 1, 100, true);
          animateProgress(25, 50, 2000, `Iteration No.${iterationCounter + 1}`);
        }
        if (iterationCounter === 2) {
          updateIterationLoading(iterationCounter + 1, 100, true);
          animateProgress(65, 75, 2000, `Iteration No.${iterationCounter + 1}`);
        }
        if (iterationCounter === 3) {
          updateIterationLoading(iterationCounter + 1, 100, true);
          animateProgress(
            85,
            100,
            2000,
            `Iteration No.${iterationCounter + 1}`
          );
        }
        setStoredGeneratedCode(cleanCode); //  save the generated code 

        //change the button style 
        callApiButton.style.width = "11rem";
        buttonIcon.src = "/ICONS/code-done.svg";
        callApiButton.style.backgroundColor = "rgb(242, 255, 218)";
        buttonText.textContent = "Code generated";
        buttonText.style.color = "rgb(138, 192, 58)";

        // auto switch to the preview view after the code is generated 
        // const previewView = document.querySelector('.preview-view');
        // const toggleSizeButton = document.getElementById('toggle-size');
        // if (!previewView.classList.contains('expanded')) {
        //   previewView.classList.add('expanded');
        //   toggleSizeButton.querySelector('img').src = './ICONS/shrink.svg';
        // }

        // make sure the lazy load overlay is hidden after the code is generated
        const lazyLoadOverlay = document.querySelector(".lazy-load-overlay");
        if (lazyLoadOverlay) {
          lazyLoadOverlay.style.display = "none";
        }

        // create the celebration effect 
        createCelebrationEffect();

        // prevent the default behavior of the iframe
        preventIframeDefaultBehavior(outputIframe);
      } else {
        buttonText.textContent = "Generate failed";
      }

      // Update the output section
      output.textContent = cleanCode;

      // Update the iframe to show the generated code
      const iframe = document.getElementById("output-iframe");
      iframe.srcdoc = cleanCode;

      // 更新存储的代码，0，1，2，3
      iterationCodes[iterationCounter % 4] = cleanCode;

      // Calculate the iteration frame index based on the iteration counter
      const iterationFrameIndex = (iterationCounter % 4) + 1;
      const iterationFrame = document.getElementById(
        `output-iframe-${iterationFrameIndex}`
      );

      //Update the Counter
      iterationCounter++;
      console.log("Iteration Counter:", iterationCounter); // Print the iteration counter
      //make the button click again to call the API
      callApiButton.click();

      // Switch to the specific panel 
      simulateClickOnPanel(iterationCounter);

      if (iterationFrame) {
        iterationFrame.srcdoc = cleanCode;
      }
      // Print the current API call count
      console.log(`This is the ${iterationCounter} time to call the API`); // Print iteration count

      // Print the content of the current used prompt in the console
      console.log("The content of the prompt:", result.prompt);
    } else {
      console.log("Response Status:", response.status);
      const errorBody = await response.text();
      console.log("Response Body:", errorBody);
      console.error("Failed to call Anthropic API:", response.statusText);
    }
  } catch (error) {
    console.error("Error in fetch operation:", error);
  }
}

// auto switch to the panel that was clicked 
function simulateClickOnPanel(index) {
  const panel = document.getElementById(`iteration-${index}`);
  if (panel) {
    panel.click();
  }
}
// Update the progress bar
function animateProgress(start, end, duration, stage) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentProgress = Math.floor(progress * (end - start) + start);
    updateProgress(stage, currentProgress);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
// progress control functions
function updateProgress(stage, progress) {
  const fill = document.getElementById("fill");
  const progressLabel = document.getElementById("progress");

  fill.style.width = `${progress}%`;
  progressLabel.textContent = `${progress}%`;

  // update the stage label 
  const stageLabel = document.getElementById("stage-label");
  stageLabel.textContent = stage;
}

// multiple panel toggle function 
document.addEventListener("DOMContentLoaded", () => {
  const multiplePanel = document.getElementById("multiple-panel");
  let selectedFrame = null;

  multiplePanel.addEventListener("click", (event) => {
    const iterationFrame = event.target.closest(".iteration-frame");
    if (iterationFrame) {
      const index = iterationFrame.dataset.index;

      // remove the selected effect from the previous frame 
      if (selectedFrame) {
        selectedFrame.classList.remove("selected");
      }

      // add new selected effect 
      iterationFrame.classList.add("selected");
      selectedFrame = iterationFrame;

      updatePreviewView(index);
    }
  });

});

//lazy overlay functions
export function showLazyLoadOverlay() {
  const lazyLoadOverlay = document.querySelector(".lazy-load-overlay");
  if (lazyLoadOverlay) {
    lazyLoadOverlay.style.display = "flex";
  }
}

export function hideLazyLoadOverlay() {
  const lazyLoadOverlay = document.querySelector(".lazy-load-overlay");
  if (lazyLoadOverlay) {
    lazyLoadOverlay.style.display = "none";
  }
}

// update the preview view function 
function updatePreviewView(index) {
  const outputIframe = document.getElementById("output-iframe");
  const output = document.getElementById("output");
  const code = iterationCodes[index - 1];

  // show the lazy load overlay 
  showLazyLoadOverlay();
  //hide the lazy load overlay 
  //if the iterationCounter is greater than or equal to the index of the panel that was clicked
  if (iterationCounter >= parseInt(index)) {
    hideLazyLoadOverlay();
  }

  // update the iframe to show the generated result 
  outputIframe.srcdoc = code;

  // update the output section to show the generated Code 
  output.textContent = code;

  // switch to the preview view 
  document.querySelector(".toggle-option.preview").click();

  // add this to prevent the default behavior of the iframe 
  outputIframe.onload = function () {
    outputIframe.contentDocument.body.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );
  };
}
// zoom in and out the iframe
document.addEventListener("DOMContentLoaded", function () {
  const toggleSizeButton = document.getElementById("toggle-size");
  const previewView = document.querySelector(".preview-view");
  const iframeContainer = document.getElementById("iframe-container");
  const output = document.getElementById("output");

  toggleSizeButton.addEventListener("click", function () {
    previewView.classList.toggle("expanded");
    if (previewView.classList.contains("expanded")) {
      toggleSizeButton.querySelector("img").src = "./ICONS/shrink.svg";
    } else {
      toggleSizeButton.querySelector("img").src = "./ICONS/expand.svg";
    }

    if (iframeContainer.classList.contains("active")) {
      const iframe = iframeContainer.querySelector("iframe");

      //save the current srcdoc content 
      const currentContent = iframe.srcdoc;

      //clear the iframe content 
      iframe.srcdoc = "";
      
      // use the setTimeout to ensure the content is reloaded in the next event loop 
      setTimeout(() => {
        // set the content back to the iframe 
        iframe.srcdoc = currentContent;

        iframe.onload = function () {
          iframe.contentDocument.body.addEventListener(
            "click",
            function (e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("Clicked inside iframe");
            },
            true
          );

          //prevent the form submission in the iframe 
          iframe.contentDocument.body.addEventListener(
            "submit",
            function (e) {
              e.preventDefault();
              console.log("Form submission prevented in iframe");
            },
            true
          );
        };
      }, 0);
    }
  });
});


// celebration-effect
function createCelebrationEffect() {
  const container = document.body;
  const particlesCount = 1000; 

  for (let i = 0; i < particlesCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("celebration-particle");

    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;

    
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;

    container.appendChild(particle);

    anime({
      targets: particle,
      top: `${Math.random() * 200 - 50}vh`, 
      left: `${Math.random() * 200 - 50}vw`, 
      rotate: Math.random() * 520,
      duration: Math.random() * 2000 + 3000,
      easing: "easeOutCirc",
      complete: () => {
        container.removeChild(particle);
      },
    });
  }
}


// prevent iframe default behavior
function preventIframeDefaultBehavior(iframe) {
  iframe.onload = function () {
    if (iframe.contentDocument) {
      iframe.contentDocument.body.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clicked inside iframe (expanded view)");
        },
        true
      );

      iframe.contentDocument.body.addEventListener(
        "submit",
        function (e) {
          e.preventDefault();
          console.log("Form submission prevented in iframe (expanded view)");
        },
        true
      );

      // prevent the default behavior of the links in the iframe 
      const links = iframe.contentDocument.getElementsByTagName("a");
      for (let link of links) {
        link.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            console.log("Link click prevented in iframe (expanded view)");
          },
          true
        );
      }
    }
  };
}
