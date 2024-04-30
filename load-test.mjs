import WebSocket from "ws";
import { nanoid } from "nanoid";

const roomID = "r1";
const baseURL = "ws://127.0.0.1:8080";
const numClients = 10;

for (let i = 0; i < numClients; i++) {
  runClient();
}

function runClient() {
  const clientID = nanoid();
  const clientGroupID = nanoid();
  const userID = nanoid();
  const wsid = nanoid();
  const ts = performance.now();
  const url = `${baseURL}/api/sync/v1/connect?clientGroupID=${clientGroupID}&clientID=${clientID}&roomID=${roomID}&userID=${userID}&baseCookie=0&lmid=0&ts=${ts}&wsid=${wsid}`;
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

async function initClient(ws, clientGroupID, clientID) {
  sendMutation(ws, clientGroupID, clientID, "initClientState", 1, {
    cursor: null,
    overID: "",
    selectedID: "",
    userInfo: {
      avatar: randomEmoji(),
      color: randomColor(),
      name: `user`,
    },
  });

  const max = 800;
  const y = Math.round(Math.random() * max);
  let x = Math.round(Math.random() * max);

  for (let i = 2; ; i++) {
    sendMutation(ws, clientGroupID, clientID, "setCursor", i, {
      x,
      y,
    });
    x = (x + 1) % max;
    await sleep(16);
  }
}

function sendMutation(ws, clientGroupID, clientID, name, id, args) {
  const timestamp = performance.now();
  const mutation = {
    name,
    id,
    timestamp,
    clientID,
    args,
  };

  const msg = [
    "push",
    {
      clientGroupID,
      pushVersion: 1,
      requestID: nanoid(),
      schemaVersion: "",
      timestamp,
      mutations: [mutation],
    },
  ];

  console.log("Sending", JSON.stringify(msg));
  ws.send(JSON.stringify(msg));
}

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
