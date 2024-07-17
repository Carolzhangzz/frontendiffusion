let iterationCounter = 0;

document.getElementById('generate-btn').addEventListener('click', generateNewFrame);

function generateNewFrame() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const content = `
        <html>
            <body style="background-color: ${randomColor}; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                <h1>Iteration ${iterationCounter + 1}</h1>
            </body>
        </html>
    `;

    const iterationFrameIndex = (iterationCounter % 4);
    const iterationFrame = document.getElementById(`output-iframe-${iterationFrameIndex}`);
    
    if (iterationFrame) {
        iterationFrame.srcdoc = content;
    }

    iterationCounter++;
}

document.querySelectorAll('.iteration-frame-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function() {
        const iframe = this.querySelector('iframe');
        showFullSizePopup(iframe.srcdoc);
    });
});

function showFullSizePopup(content) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    popup.style.zIndex = '1000';

    const iframe = document.createElement('iframe');
    iframe.srcdoc = content;
    iframe.style.width = '90vw';
    iframe.style.height = '90vh';
    iframe.style.border = 'none';
    popup.appendChild(iframe);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => document.body.removeChild(popup);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}

// 初始生成四个框架
for (let i = 0; i < 4; i++) {
    generateNewFrame();
}