import routes from "../config/routes";
import { Installation, InstallQuery } from "../types/slackTypes";
import storeOrgInstall from "../db/storeOrgInstall";
import storeWorkspaceInstall from "../db/storeWorkspaceInstall";
import getInstall from "../db/getInstall";
import deleteInstall from "../db/deleteInstall";
import { createCustomerAndSubscription } from "./stripe";
require("dotenv").config();
const { App, LogLevel } = require("@slack/bolt");

// Initialize Slack app with OAuth 2.0
// See https://slack.dev/bolt-js/tutorial/getting-started#setting-up-your-project
// And see https://slack.dev/bolt-js/concepts#authenticating-oauth
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET, // Verify that incoming requests are really from Slack
  clientId: process.env.SLACK_CLIENT_ID, // For OAuth 2.0
  clientSecret: process.env.SLACK_CLIENT_SECRET, // For OAuth 2.0
  scopes: [
    "app_mentions:read",
    "channels:history",
    "chat:write",
    "groups:history",
    "im:history",
    "mpim:history",
  ],
  installationStore: {
    // Bolt will pass your handler an installation object
    storeInstallation: async (installation: Installation) => {
      // handle storing org-wide app installation
      if (
        installation.isEnterpriseInstall &&
        installation.enterprise !== undefined
      ) {
        // Verify customer and subscription presence, then create if necessary
        await createCustomerAndSubscription(
          installation.enterprise.id,
          installation.enterprise.name,
          "enterpriseId"
        );

        // Store the installation in Supabase
        return await storeOrgInstall(installation);
      }

      // single team app installation
      if (installation.team !== undefined) {
        // Verify customer and subscription presence, then create if necessary
        await createCustomerAndSubscription(
          installation.team.id,
          installation.team.name,
          "teamId"
        );

        // Store the installation in Supabase
        return await storeWorkspaceInstall(installation);
      }

      // Else, throw an error
      throw new Error("Failed saving installation data to installationStore");
    },
    // Bolt will pass your handler an installQuery object
    fetchInstallation: async (installQuery: InstallQuery) => {
      // handle org wide app installation lookup
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        return await getInstall(installQuery.enterpriseId);
      }

      // single team app installation lookup
      if (installQuery.teamId !== undefined) {
        return await getInstall(installQuery.teamId);
      }

      // Else, throw an error
      throw new Error("Failed fetching installation");
    },
    // Bolt will pass your handler an installQuery object
    deleteInstallation: async (installQuery: InstallQuery) => {
      // org wide app installation deletion
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        return await deleteInstall(installQuery.enterpriseId);
      }

      // single team app installation deletion
      if (installQuery.teamId !== undefined) {
        return await deleteInstall(installQuery.teamId);
      }

      // Else, throw an error
      throw new Error("Failed to delete installation");
    },
  },
  installerOptions: {
    stateVerification: false, // default: true. See https://slack.dev/bolt-js/concepts#org-wide-installation
    directInstall: true, // default: false. See https://slack.dev/bolt-js/concepts#installing-your-app
  },
  logLevel: LogLevel.INFO, // LogLevel.INFO Or LogLevel.DEBUG
  customRoutes: routes,
  port: Number(process.env.PORT) || 3000,
});

// Start bolt for JavaScript
(async () => {
  // Start your app
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();

export default app;
