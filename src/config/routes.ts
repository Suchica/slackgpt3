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
  {
    path: "/slack/events", // The default path for listening to Slack events
    method: ["POST"], // Must be POST
    // @ts-ignore
    handler: (_req, res) => {
      res.writeHead(200);
    },
  },
];

export default routes;
