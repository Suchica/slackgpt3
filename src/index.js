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
    // Creates a completion for the provided prompt and parameters
    // See https://beta.openai.com/docs/api-reference/completions/create?lang=node.js
    const response = await openai.createCompletion({
      model: "text-davinci-003", // https://beta.openai.com/docs/models/gpt-3
      prompt: event.text, // String | Array of strings
      // suffix: null, // String | null
      max_tokens: 140, // Number, 1-4096 for text-davinci-003. Defaults to 16
      temperature: 0.9, // Number, 0.0-1.0. Defaults to 1
      // n: 1, // Number, 1-100. Defaults to 1
      // stream: false, // Boolean. Defaults to false
      // logprobs: null, // Number, 0-5. Defaults to null
      // echo: false, // Boolean. Defaults to false
      // stop: "\n", // String | Array of strings. Defaults to null
      // presence_penalty: 0, // Number between -2.0 and 2.0. Defaults to 0
      // frequency_penalty: 0, // Number between -2.0 and 2.0. Defaults to 0
      // best_of: 1, // Number. Defaults to 1
      // logit_bias: null, // Object. Defaults to null
      // user: null, // String
    });

    // Response to the message in the thread where the event was triggered with @${message.user} using openai's node.js library
    // See https://slack.dev/bolt-js/concepts#message-sending
    console.log("event.text", event.text);
    console.log("response.choices[0].text", response.choices[0].text);

    await say({
      // text: `<@${event.user}>! ${response.choices[0].text}`,
      text: `<@${event.user}>!`,
      thread_ts: event.ts,
    });
  } catch (error) {
    await say({
      text: `<@${event.user}> ${error.message}. ${error.response.statusText}.`,
      thread_ts: event.ts,
    });
  }
});

(async () => {
  // Start this app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
