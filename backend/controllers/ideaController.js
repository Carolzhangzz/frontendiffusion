const Anthropic = require("@anthropic-ai/sdk");
const generateIdeas = async (req, res) => {
  const { previousCode } = req.body;
  console.log("Received request body for generating ideas:", req.body);


  try {
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
              type: "text",
              text: `Based on the previously generated code, generate 3-5 ideas to improve the website design:
                     Previously Generated Code:
                     ${previousCode}
                     Based on the previous design, please provide optimizations and enhancements focusing on:

                      1. Visual Consistency: Ensure a cohesive look and feel across the entire interface.

                      2. Unique Imagery: Suggest diverse and non-repetitive images that align with the theme of each section.

                      3. Component Refinement: Enhance the details of each UI component, considering:
                      - Button designs (hover states, shadows, etc.)
                      - Input field styles and interactions
                      - Card layouts and information hierarchy

                      4. Layout Improvements: Propose better ways to organize content for improved readability and user flow.

                      5. Color Scheme: Refine the color palette to improve contrast and visual appeal.

                      6. Typography: Suggest improvements in font choices, sizes, and text formatting for better readability.

                      7. Responsive Design: Ensure the layout adapts well to different screen sizes.

                      8. Interaction Design: Add subtle animations or transitions to improve user experience.

                      9. Accessibility: Suggest improvements to make the design more inclusive and easier to use for all users.

                      10. Performance Optimization: If applicable, propose ways to optimize the code for faster loading and rendering.
                     Please provide concise, innovative ideas that could enhance the user experience, visual appeal, or functionality of the website. Consider the existing code and suggest improvements or new features.`,
            },
          ],
        },
      ],
    });

    const generatedIdeas = message.content[0].text;
    if (!generatedIdeas) {
      throw new Error("No ideas generated by Anthropic API");
    }

    // analyze the generated ideas and split them into separate ideas
     const ideas = generatedIdeas.split("\n\n").map((idea) => {
        const [title, ...descriptionParts] = idea.split("\n");
        return {
          title: title.replace(/^\d+\.\s*/, "").trim(),
          description: descriptionParts.join("\n").trim(),
        };
      });
   
    console.log("Generated ideas:", generatedIdeas);

    // setStoredIdeas(ideas);
    res.json({ ideas });
  } catch (error) {
    console.error("Error in generateIdeas:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { generateIdeas };
