const routes = [
  {
    path: "/health",
    method: ["GET"],
    // @ts-ignore
    handler: (req, res) => {
      res.writeHead(200);
      res.end("Server running " + new Date().toISOString() );
    },
  },
  {
    path: "/slack/events",
    method: ["POST"],
    // @ts-ignore
    handler: (req, res) => {
      res.writeHead(200);
    },
  },
];

export default routes;
