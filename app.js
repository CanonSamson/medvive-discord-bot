const { Client, IntentsBitField } = require("discord.js");
// Import express and socket.io

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

// Initialize the bot
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Send a message to a specific channel
  const channelId = "1316805882117492747"; // Replace with your channel ID
  const channel = client.channels.cache.get(channelId); // Fetch the channel using its ID
  if (channel) {
    // channel.send("Hello, world!"); // Message to send
  } else {
    console.error("Channel not found!");
  }
});

client.login(process.env.TOKEN);

// Create an express application
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Set up a basic route
app.get("/", (req, res) => {
  res.send("Hello World! This is the Express server.");
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log("Express server is running on", process.env.PORT);
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new-user", (data) => {
    const channel = client.channels.cache.get("1316805882117492747");
    if (channel) {
      channel.send(`${data.name} just joined Medvive! 🥳`).catch(err => console.error("Failed to send message:", err));
    } else {
      console.error("Channel not found for new user message.");
    }
  });

  socket.on("new-consultation", (data) => {
    const channel = client.channels.cache.get("1316810844050292870");
    if (channel) {
      channel.send(
        `${data.name} just scheduled a consultation with Dr. ${data.doctor.name} on ${data.date}. 🥳`
      ).catch(err => console.error("Failed to send message:", err));
    } else {
      console.error("Channel not found for new consultation message.");
    }
  });

  // Handle socket events here
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
