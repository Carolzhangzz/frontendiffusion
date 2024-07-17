const Anthropic = require("@anthropic-ai/sdk");
const { convert } = require("convert-svg-to-jpeg");
const { extractKeywords, fetchImageFromAPI } = require("../utils/utils");
const {
  setStoredPRD,
  setStoredImageUrl,
  setStoredImageUrls,
} = require("../utils/state");

const generatePRD = async (req, res) => {
  const { svg, userPrompt } = req.body;

  try {
    const jpgContent = await convert(svg);
    const base64Image = jpgContent.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    setStoredImageUrl(imageUrl);

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `
      Please generate a Product Requirements Document (PRD) which 
      targets creating a modern and user-friendly front-end interface based on the following user's sketch (the picture I sent you) and prompt.
      User's prompt: ${userPrompt}
      In the PRD, specify what images are needed and where they should be placed (e.g., hero image, product image, etc.) using the format:
      [term(size)], please concrete keywords like [(bread)medium] instead of something vague like [product1(small)]. 
      There are 3 keywords for the size (small, medium, large, landscape, or portrait). Remember this only applies to images, if it's icons you can
      just define it without the expected format.
      Example: [school(large)]`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const prd = message.content[0].text;
    setStoredPRD(prd);
    const keywords = extractKeywords(prd);

    const imageUrls = await Promise.all(
      keywords.map(async (keyword) => {
        const imageUrl = await fetchImageFromAPI(keyword.term, keyword.size);
        return { term: keyword.term, size: keyword.size, imageUrl };
      })
    );

    setStoredImageUrls(imageUrls);
    res.json({ prd, keywords, imageUrls, storedImageUrl: imageUrl });
  } catch (error) {
    console.error("Error in generatePRD:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { generatePRD };
