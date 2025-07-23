# VL/HCC'25: Frontend Diffusion: Empowering Self-Representation of Junior Researchers and Designers Through Agentic Workflows

<p align="center">
  <a href="https://github.com/Carolzhangzz/frontendiffusion/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="https://github.com/Carolzhangzz/FD/stargazers"><img src="https://img.shields.io/github/stars/Carolzhangzz/frontendiffusion" alt="GitHub Stars"></a>
  <a href="https://github.com/Carolzhangzz/FD/fork"><img src="https://img.shields.io/github/forks/Carolzhangzz/frontendiffusion" alt="GitHub Forks"></a>
</p>

<p align="center">
  <img src="https://img.icons8.com/?size=100&id=qGwgMt9xZDy5&format=png&color=000000" alt="Paper" width="17" height="17" style="vertical-align: middle;"/> <a href="https://arxiv.org/abs/2408.00778](https://arxiv.org/pdf/2502.03788">Paper</a> • 
   <img src="https://img.icons8.com/color/48/000000/internet.png" alt="Platform" width="15" height="15" style="vertical-align: middle;"/> <a href="https://carolzhangzz.github.io/frontendiffusion/">Website</a> • 
   <img src="https://img.icons8.com/?size=100&id=114331&format=png&color=000000" alt="Video" width="18" height="18" style="vertical-align: middle; "/> <a href="https://twitter.com/jasonzding/status/1814046922874724767">Demo Video</a> •  
  <img src="https://img.icons8.com/?size=100&id=13963&format=png&color=000000" alt="Twitter" width="18" height="18" style="vertical-align: middle;"/> <a href="https://twitter.com/Carol_Zhang1027">Twitter/X</a> 
</p>

![alt text](./Images/Interface.png)

Frontend Diffusion is an end-to-end LLM-powered tool that generates high-quality websites from user sketches. Users can input a rough sketch on the canvas, which the system then transforms into a high-quality website page. You could use it to generate websites from sketch.

The generated websites, as illustrated below, exhibit generally satisfactory visual appearances. These include contextually appropriate textual content, imagery, color schemes, layouts, and functionalities.

<img src="./Images/newgif1.gif" width="400" /> <img src="./Images/newgif2.gif" width="400" />

## Screenshots of generated websites spanning commercial and academic domains:

![alt text](./Images/Examples2.png)

## Other Generation Samples 
![alt text](./Images/frontend_generation.png)

This tool is used by other open source projects such as <a href="https://github.com/lwaekfjlk/gpu-bartender">GPU Bartender</a>.

# How to Use 
1. Draw your sketch in the canvas panel using the toolbar on the left.
2. Provide a brief website description in the input area at the top right corner.
3. Click "Generate" to process your input.
4. View the generated UI in the preview pane on the right.
5. Access and copy the HTML code by toggling to the "Code Panel" and using the "Copy" button.
# Requirements
* Install Node.js (through Homebrew or download from [http://nodejs.org/](http://nodejs.org/)). If you want to install through Homebrew, you need to download Homebrew first.
* Install npm (through [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)).

Open the terminal on your computer or use the terminal provided by your integrated development environment (e.g., Visual Studio Code). 
Ensure that the terminal is opened in the project folder directory.

## API Key Requirements

#### Local Deployment Instructions

1. Navigate to the `.env` file in your project directory. 
2. Insert your API key information using the following format (you could get ANTHROPIC API Key from : [anthropic.com](https://console.anthropic.com/settings/keys)):

ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY

3. Save the `.env` file after adding your API keys.

**Note:** Keep your API keys confidential and never share them publicly.

<!-- Get OpenAI API from : [openai.com](https://platform.openai.com/api-keys) -->

<!--Get PEXELS API from : [pexels.com](https://help.pexels.com/hc/en-us/articles/900004904026-How-do-I-get-an-API-key)-->

## Module Requirements

## Installation

Before running the program, follow these steps: 

1. Install dependencies:

 `npm install`

2. If you encounter errors like "Cannot find module '@module_name'", install the specific module:

For example :  

```
npm install @anthropic-ai/sdk
npm install dotenv
```

(Add any other specific modules as needed)

## Running the Application

Navigate to the `/backend` directory (cd backend), then use the command: 

### `node server.js`

Navigate to the `/frontend` directory (cd frontend), then use the command: 

### `npx live-server`

You should now see the application in your browser.

## Customization 

To edit the page, modify the `frontend/index.html` file.

## Citation

If you use this project in your research, please cite our paper:

```
@article{zhang2024frontend,
  title={Frontend Diffusion: Exploring Intent-Based User Interfaces through Abstract-to-Detailed Task Transitions},
  author={Zhang, Qinshi and Hendra, Latisha Besariani and Chi, Mohan and Ding, Zijian},
  journal={arXiv preprint arXiv:2408.00778},
  year={2024}
}
```

## Related Paper

[Ding, Zijian. "Towards Intent-based User Interfaces: Charting the Design Space of Intent-AI Interactions Across Task Types", arXiv preprint arXiv:2404.18196 (2024).](https://arxiv.org/pdf/2404.18196)
