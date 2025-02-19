exports.handler = async (event) => {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
  
      if (!apiKey) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Missing API key" }),
        };
      }
  
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
      const body = JSON.parse(event.body);
      const userMessage = body.message;
  
      const chatSession = model.startChat({
        history: [
          { role: "user", parts: [{ text: "You are a helpful tutor for KTU students." }] },
        ],
      });
  
      const result = await chatSession.sendMessage(userMessage);
      const aiMessage = result.response.text();
  
      return {
        statusCode: 200,
        body: JSON.stringify({ response: aiMessage }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  