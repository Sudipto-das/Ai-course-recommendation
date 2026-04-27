const axios = require('axios');

exports.getRecommendations = async (req, res) => {
    try {
        const { topic, level } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        // Prompt engineering 
        const prompt = `
You are an expert course recommendation system.

Suggest 5 courses based on:
Topic: ${topic}
Level: ${level || "any"}

Return response in JSON format like:
[
  {
    "title": "Course Name",
    "description": "Short description",
    "reason": "Why recommended"
  }
]
`;

        // Gemini API call
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            }
        );

        //  Extract AI text
        const text = response.data.candidates[0].content.parts[0].text;

        //  Try parsing JSON safely
        let recommendations;

        try {
            recommendations = JSON.parse(text);
        } catch (err) {
            // fallback if Gemini returns text instead of pure JSON
            recommendations = {
                raw: text
            };
        }

        res.json(recommendations);

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Gemini API failed" });
    }
};