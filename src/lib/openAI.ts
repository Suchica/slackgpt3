require("dotenv").config();
import openai from "./openAIAuth";

const chatWithGPT3 = async (
  prevMessages: string,
  user: string,
  text: string
) => {
  // Prompt is the conversation flow that is provided to the model to generate a response
  // See https://beta.openai.com/examples/default-chat
  const prompt = `
    Act as an AI assistant. Consider the following conversation flow and answer the last question. The language in which you answer does not necessarily have to be English, identify the language used in the conversation and use it.

    ${prevMessages}
    ${user}: ${text}
    AI: 
  `;

  // Creates a completion for the provided prompt and parameters
  // See https://beta.openai.com/docs/api-reference/completions/create?lang=node.js
  const response = await openai.createCompletion({
    model: process.env.OPENAI_MODEL, // https://beta.openai.com/docs/models/gpt-3
    prompt: prompt, // String | Array of strings
    max_tokens: 400, // Roughly 100 tokens ~= 75 words. 1-2048 for the latest models. 1-4096 for text-davinci-003. Defaults to 16
    temperature: 0.9, // Higher values means the model will take more risks and be more creative, 0.0-1.0. Defaults to 1
    // n: 1, // How many completions to generate for each prompt. 1-100. Defaults to 1. Set more than 1 if we enable user to retry
    // stop: ["Human:", "AI:"], // String | Array of strings. Defaults to null
    presence_penalty: 0.6, // Positive values enforce the model to talk about new topics.Between -2.0 and 2.0. Defaults to 0
    // frequency_penalty: 0, // Negative values enforce the model to repeat the same line verbatim. Between -2.0 and 2.0. Defaults to 0
  });
  const responseString: string = response.data.choices[0].text;
  return responseString;
};

export { chatWithGPT3 };
