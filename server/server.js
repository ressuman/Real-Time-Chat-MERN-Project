const dotenv = require("dotenv");

//dotenv.config({ path: "./config.env" });
dotenv.config({ path: `${__dirname}/config.env` });

const dbconfig = require("./config/dbConfig");

const server = require("./app");

const PORT = process.env.PORT || 4292;
//const HOST = process.env.PORT_HOST || "localhost";

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server is running: Listening to requests at http://0.0.0.0:${PORT}`
  );
});
