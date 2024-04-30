import WebSocket from "ws";
import { nanoid } from "nanoid";

function runClient() {
  const clientID = nanoid();
  const clientGroupID = nanoid();
  const roomID = "r1";
  const userID = "u1";
  const url = `ws://127.0.0.1:8080/api/sync/v1/connect?clientGroupID=${clientGroupID}&clientID=${clientID}&roomID=${roomID}&userID=${userID}&baseCookie=0&lmid=0&ts=${Date.now()}`;
  console.log(`Connecting to ${url}`);
  const ws = new WebSocket(url);
  ws.on("open", () => {
    console.log("Connected");
  });
  ws.on("error", (e) => {
    console.log("Web socket error", e);
  });
  ws.on("message", (data) => {
    const str = data.toString();
    const msg = JSON.parse(str);
    const [type, ...body] = msg;
    switch (type) {
      case "error":
        console.log("Server sent error", body);
        break;
    }
  });
}

runClient();
