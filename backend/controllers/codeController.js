const Anthropic = require('@anthropic-ai/sdk');
const { getStoredPRD, getStoredImageUrl, getStoredImageUrls } = require("../utils/state");

const MAX_ITERATIONS = 10;

const generateCode = async (req, res) => {
  const { iteration, userPrompt } = req.body;

  // Retrieve the stored values
  const storedPRD = getStoredPRD();
  const storedImageUrl = getStoredImageUrl();
  const storedImageUrls = getStoredImageUrls();

  // Log the values of storedPRD and storedImageUrls to check if they are passed properly
  console.log("Stored PRD:", storedPRD);
  console.log("Stored Image URL:", storedImageUrl);
  console.log("Stored Image URLs:", storedImageUrls);

  if (iteration >= MAX_ITERATIONS) {
    return res.status(400).json({ error: "Maximum iteration limit reached." });
  }

  if (!storedPRD || !storedImageUrls) {
    return res.status(400).json({ error: "PRD or image URLs not found. Please start from iteration 0." });
  }

  try {
    const imageInsertionInstructions = storedImageUrls.map(({ term, size, imageUrl }) => 
      `Use the image for "${term}" at the following URL: ${imageUrl}. Size: ${size}.`).join('\n');

    const prompt = `
    You are a design engineer tasked with creating the personal website for a junior researcher based on a user's wireframe sketch.
    Prioritize the user's considerations as design preferences while ensuring the design adheres to these principles:
    1. Apply shadows judiciously—enough to create depth but not overly done.
    2. Use the Gestalt principles (proximity, similarity, continuity, closure, and connectedness) to enhance visual perception and organization.
    3. Ensure accessibility, particularly in color choices; use contrasting colors for text, such as white text on suitable background colors, to ensure readability. Feel free to use gradients if they enhance the design's aesthetics and functionality.
    4. Maintain consistency across the design.
    5. Establish a clear hierarchy to guide the user's eye through the interface.
  
    Additional considerations:
    1. Utilize a CSS icon library Font Awesome in your <head> tag to include vector glyph icons.
    2. Ensure all elements that can be rounded, such as buttons and containers, have consistent rounded corners to maintain a cohesive and modern visual style.
  
    Based on the following Product Requirements Document (PRD) and User Prompt:
    Product Requirements Document (PRD): ${storedPRD}
    User's prompt: ${userPrompt}
  
    **Image insertion instructions**:
    - Each image should complement the content it is near. For example:
      - If a section introduces the researcher, use an appropriate profile image.
      - For projects or portfolio sections, associate images with the described projects.
      - Use decorative images (e.g., patterns, icons) sparingly and only to enhance the visual appeal of whitespace or dividers.
    - Avoid placing images in isolated areas without supporting content.
    - Ensure the layout looks balanced, and no section appears cluttered or empty due to image placement.
  
    Please provide your output in HTML, CSS, and JavaScript without any explanations and natural languages (only code), with an emphasis on JavaScript for dynamic user interactions such as clicks and hovers.
  `;
  
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: storedImageUrl.split(',')[1], 
              },
            },
            {
              type: "text",
              text: prompt
            }
          ],
        }
      ],
    });

    const generatedCode = message.content[0].text;
    console.log("Generated Code:", generatedCode); 
    res.json({ generatedCode, prompt });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { generateCode };