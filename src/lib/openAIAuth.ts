require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI's Node.js library
// See https://beta.openai.com/docs/api-reference/authentication
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});
const openai = new OpenAIApi(configuration);

export default openai;