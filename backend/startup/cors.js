const cors = require("cors");
module.exports = (app) => {
  app.use(cors({ origin: "https://simple-chat-6uvv.onrender.com" }));
};
