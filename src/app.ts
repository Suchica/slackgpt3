import app from "./lib/slackAuth";
import { chatWithGPT3 } from "./lib/openAI";
require("dotenv").config();

// @ts-ignore
app.event("app_mention", async ({ event, client, say }) => {
  try {
    // Retrieve all the messages in the thread where the event was triggered
    const threadTs = event.thread_ts || event.ts;
    const channel = event.channel;
    // Call WEB API method using client and the token is provided by Bolt internally
    // See https://slack.dev/bolt-js/concepts#web-api
    const thread = await client.conversations
      .replies({
        channel: channel,
        ts: threadTs,
      })
      .then((res: any) => res.messages)
      .catch((error: any) => {
        throw new Error(error);
      });

    // Convert to a string so that it is in the form user: message
    const messages = thread.map((message: any) => {
      return `${message.user}: ${message.text.replace(/<@.*>/, "")}`;
    });
    const messagesString = messages.join("\n");
    // @ts-ignore
    const user: string = event?.user;
    const text: string = event?.text.replace(/<@.*>/, "");

    // Send the messages to Open AI's GPT-3
    const response = await chatWithGPT3(messagesString, user, text);

    // Response to the message in the thread where the event was triggered with @${message.user} using openai's node.js library
    // See https://slack.dev/bolt-js/concepts#message-sending
    await say({
      text: `<@${event.user}> ${response}`,
      thread_ts: threadTs,
    });
  } catch (error: any) {
    await say({
      text: `<@${event.user}> ${error.message}. ${error.response?.statusText}.`, // @userName Request failed with status code 429. Too Many Requests.
      thread_ts: event.ts,
    });
  }
});
