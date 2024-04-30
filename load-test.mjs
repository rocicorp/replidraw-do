import WebSocket from "ws";
import { nanoid } from "nanoid";

function randomEmoji() {
  const range = [0x1f600, 0x1f64f];
  const codePoint =
    Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  return String.fromCodePoint(codePoint);
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function runClient() {
  const clientID = nanoid();
  const clientGroupID = nanoid();
  const roomID = "r1";
  const userID = "u1";
  const wsid = nanoid();
  const url = `ws://127.0.0.1:8080/api/sync/v1/connect?clientGroupID=${clientGroupID}&clientID=${clientID}&roomID=${roomID}&userID=${userID}&baseCookie=0&lmid=0&ts=${Date.now()}&wsid=${wsid}`;
  console.log(`Connecting to ${url}`);
  const ws = new WebSocket(url);
  ws.on("error", (e) => {
    console.log("Web socket error", e);
  });
  ws.on("message", (data) => {
    const str = data.toString();
    const msg = JSON.parse(str);
    const [type, ...body] = msg;
    switch (type) {
      case "connected":
        console.log("Connected", body);
        initClient(ws, clientGroupID, clientID);
        break;
      case "error":
        console.log("Server sent error", body);
        break;
    }
  });
}

function initClient(ws, clientGroupID, clientID) {
  const mutation = {
    name: "initClientState",
    id: 1,
    timestamp: performance.now(),
    clientID,
    args: {
      cursor: null,
      overID: "",
      selectedID: "",
      userInfo: {
        avatar: randomEmoji(),
        color: randomColor(),
        name: `user 0`,
      },
    },
  };

  const msg = [
    "push",
    {
      clientGroupID,
      pushVersion: 1,
      requestID: nanoid(),
      schemaVersion: "",
      timestamp: performance.now(),
      mutations: [mutation],
    },
  ];

  console.log("Sending", JSON.stringify(msg));
  ws.send(JSON.stringify(msg));
}

runClient();
