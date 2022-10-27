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
var client;
store.set("client.status", false);

const socket = io(`http://${server.host}:${server.port}`);

let window;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    closable: false,
  });
  window.loadURL("https://admision.pucesd.edu.ec/login/index.php");

  window.on("close", (e) => {
    e.preventDefault();
    window.hide();
  });
}

app.whenReady().then(() => {
  socket.on("connect", () => {
    client = store.get("client");
    client.ip_address = ip.address();
    socket.emit("new-client", client);
  });

  socket.on("open-window", () => {
    if (window) {
      window.show();
    } else {
      createWindow();
    }
    store.set("client.status", true);
  });

  socket.on("close-window", () => {
    if (window) {
      window.hide();
    }
    store.set("client.status", false);
  });

  socket.on("power-off",()=>{
    // TODO funcion para apagar la PC
  })
});
