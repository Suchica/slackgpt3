/* eslint-disable no-console */
/* eslint-disable import/no-internal-modules */
import './utils/env';
// @ts-ignore
import { App, LogLevel } from '@slack/bolt';
import routes from './routes';
import { chatWithGPT3 } from './lib/openAI';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.INFO, // Or LogLevel.DEBUG for debugging
  customRoutes: routes
});

// @ts-ignore
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
      .then((res: any) => res.messages);

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
    console.log('response', response);

    // Response to the message in the thread where the event was triggered with @${message.user} using openai's node.js library
    // See https://slack.dev/bolt-js/concepts#message-sending
    await say({
      text: `<@${event.user}> ${response}`,
      thread_ts: event.ts,
    });
  } catch (error: any) {
    await say({
      text: `<@${event.user}> ${error.message}. ${error.response.statusText}.`, // @userName Request failed with status code 429. Too Many Requests.
      thread_ts: event.ts,
    });
  }
});

(async () => {
  // Start your app
  await app.start(Number(process.env.PORT) || 3000);
  console.log('⚡️ Bolt app is running!');
})();
