import routes from '../config/routes';
require("dotenv").config();
const { App, LogLevel } = require("@slack/bolt");

// Initialize Slack app with bot token and signing secret
// See https://slack.dev/bolt-js/tutorial/getting-started#setting-up-your-project
const app = new App({
  token: process.env.SLACK_BOT_TOKEN, // For both Socket Mode and HTTP
  signingSecret: process.env.SLACK_SIGNING_SECRET, // For both Socket Mode and HTTP
  // clientId: process.env.SLACK_CLIENT_ID, // For OAuth 2.0 only
  // clientSecret: process.env.SLACK_CLIENT_SECRET, // For OAuth 2.0 only
  // scopes: [
  //   "app_mentions:read",
  //   "channels:history",
  //   "chat:write",
  //   "groups:history",
  //   "im:history",
  //   "mpim:history",
  // ], // For OAuth 2.0 only
  // socketMode: true, // For Socket Mode only
  // appToken: process.env.SLACK_APP_TOKEN, // For Socket Mode only
  port: Number(process.env.PORT) || 3000, // For both HTTP and OAuth 2.0
  logLevel: LogLevel.INFO, // Or LogLevel.DEBUG for debugging
  customRoutes: routes
});

// Start bolt for JavaScript
(async () => {
  // Start your app
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();

export default app;
