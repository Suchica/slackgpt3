// Slack bot that can talk to Open AI's GPT-3 by mentions to @openai using Open AI's Node.js library, TypeScript and React
require("dotenv").config();
const { App } = require("@slack/bolt");
const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI's Node.js library
// See https://beta.openai.com/docs/api-reference/authentication
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});
const openai = new OpenAIApi(configuration);

// Initialize Slack app with bot token and signing secret
// See https://slack.dev/bolt-js/tutorial/getting-started#setting-up-your-project
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

// Subscribe to 'app_mention' event in your App config
// Need app_mentions:read and chat:write scopes
// See https://api.slack.com/tutorials/tracks/responding-to-app-mentions
app.event("app_mention", async ({ event, say }) => {
  try {
    // Retrieve all the messages in the thread where the event was triggered
    const threadTs = event.thread_ts || event.ts;
    const channel = event.channel;
    const thread = await app.client.conversations
      .replies({
        token: process.env.SLACK_BOT_TOKEN,
        channel: channel,
        ts: threadTs,
      })
      .then((res) => res.messages);
    // Convert to a string so that it is in the form user: message
    const messages = thread.map((message) => {
      return `${message.user}: ${message.text}`;
    });

    // Creates a completion for the provided prompt and parameters
    // See https://beta.openai.com/docs/api-reference/completions/create?lang=node.js
    const prompt = `
      Act as an AI assistant. Consider the following conversation flow and answer the last question. The language in which you answer does not necessarily have to be English, identify the language used in the conversation and use it.

      ${messages.join("\n")}
      ${event.user}: ${event.text.replace(/<@.*>/, "")}
      AI: 
    `;
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

    // Response to the message in the thread where the event was triggered with @${message.user} using openai's node.js library
    // See https://slack.dev/bolt-js/concepts#message-sending
    await say({
      text: `<@${event.user}> ${response.data.choices[0].text}`,
      thread_ts: event.ts,
    });
  } catch (error) {
    await say({
      text: `<@${event.user}> ${error.message}. ${error.response.statusText}.`, // @userName Request failed with status code 429. Too Many Requests.
      thread_ts: event.ts,
    });
  }
});

(async () => {
  // Start this app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
