// /slack/events is the default endpoint for the Slack Events API
// You can add other endpoints other that /slack/events
const routes = [
  {
    path: "/health", // To check if the app is running
    method: ["GET"],
    // @ts-ignore
    handler: (_req, res) => {
      res.writeHead(200);
      res.end("Server running " + new Date().toISOString() );
    },
  },
];

export default routes;
