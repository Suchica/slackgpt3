import routes from "../config/routes";
// import { Installation, InstallQuery } from "../types/slackTypes";
import unguessableRandomString from "./randomTextGenerator";
require("dotenv").config();
const { App, LogLevel } = require("@slack/bolt");
const { FileInstallationStore } = require('@slack/oauth');

// Initialize Slack app with OAuth 2.0
// See https://slack.dev/bolt-js/tutorial/getting-started#setting-up-your-project
// And see https://slack.dev/bolt-js/concepts#authenticating-oauth
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: unguessableRandomString(32),
  scopes: [
    "app_mentions:read",
    "channels:history",
    "chat:write",
    "groups:history",
    "im:history",
    "mpim:history",
  ],
  installationStore: new FileInstallationStore(),
  // installationStore: {
  //   // Bolt will pass your handler an installation object
  //   storeInstallation: async (installation: Installation) => {
  //     // handle storing org-wide app installation
  //     if (
  //       installation.isEnterpriseInstall &&
  //       installation.enterprise !== undefined
  //     ) {
  //       return
  //       // return await database.set(installation.enterprise.id, installation);
  //     }

  //     // single team app installation
  //     if (installation.team !== undefined) {
  //       return
  //       // return await database.set(installation.team.id, installation);
  //     }

  //     // Else, throw an error
  //     throw new Error("Failed saving installation data to installationStore");
  //   },
  //   // Bolt will pass your handler an installQuery object
  //   fetchInstallation: async (installQuery: InstallQuery) => {
  //     // handle org wide app installation lookup
  //     if (
  //       installQuery.isEnterpriseInstall &&
  //       installQuery.enterpriseId !== undefined
  //     ) {
  //       return
  //       // return await database.get(installQuery.enterpriseId);
  //     }

  //     // single team app installation lookup
  //     if (installQuery.teamId !== undefined) {
  //       return
  //       // return await database.get(installQuery.teamId);
  //     }

  //     // Else, throw an error
  //     throw new Error("Failed fetching installation");
  //   },
  //   // Bolt will pass your handler an installQuery object
  //   deleteInstallation: async (installQuery: InstallQuery) => {
  //     // org wide app installation deletion
  //     if (
  //       installQuery.isEnterpriseInstall &&
  //       installQuery.enterpriseId !== undefined
  //     ) {
  //       return
  //       // return await database.delete(installQuery.enterpriseId);
  //     }

  //     // single team app installation deletion
  //     if (installQuery.teamId !== undefined) {
  //       return
  //       // return await database.delete(installQuery.teamId);
  //     }

  //     // Else, throw an error
  //     throw new Error("Failed to delete installation");
  //   },
  // },
  logLevel: LogLevel.INFO, // Or LogLevel.DEBUG for debugging
  customRoutes: routes,
});

// Start bolt for JavaScript
(async () => {
  // Start your app
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

export default app;
