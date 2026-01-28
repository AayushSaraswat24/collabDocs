import { createServer } from "http";
import { app } from "./app";
import { setupSocket } from "./socket/index";

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);

setupSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
