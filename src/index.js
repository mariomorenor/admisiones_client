const { app, BrowserWindow } = require("electron");
const path = require("path");
const os = require("os");
const ip = require("ip");
const Store = require("electron-store");
const { io } = require("socket.io-client");

const store = new Store();

// Generate Config File For first time
if (!store.get("first_time")) {
  store.set("first_time", true);
  store.set("server", {
    host: "localhost",
    port: 6969,
  });
  store.set("client", {
    name: os.hostname(),
    ip_address: ip.address(),
    lab: 1,
  });
}

const server = store.get("server");
const client = store.get("client");

client.ip_address = ip.address();

const socket = io(`http://${server.host}:${server.port}`);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadURL("https://admision.pucesd.edu.ec/login/index.php");
}

app.whenReady().then(() => {
  console.log(client);
  socket.emit("new-client", client);
});
