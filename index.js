/*
console.log(__dirname);
console.log(__dirname);
console.log(process.env);
*/

/*
const math = require("./utils/math");

console.log(math.add(2, 3));
*/

/*
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit("greet", "Alice");
*/

const http = require("http");

const server = http.createServer((req, res) => {
  // Header JSON par défaut
  res.setHeader("Content-Type", "application/json");

  switch (req.url) {
    // =====================
    // Route HOME
    // =====================
    case "/":
      if (req.method === "GET") {
        const data = { message: "Bienvenue sur l API Node.js" };
        res.writeHead(200);
        res.end(JSON.stringify(data));
      }
      break;

    // =====================
    // Route USERS
    // =====================
    case "/users":
      // ----- GET USERS -----
      if (req.method === "GET") {
        const users = [
          { id: 1, name: "Ahmed" },
          { id: 2, name: "Ali" },
        ];

        res.writeHead(200);
        res.end(JSON.stringify(users));
      }
      break;

    // =====================
    // ROUTE INCONNUE → 404
    // =====================
    default:
      res.writeHead(404);
      res.end(
        JSON.stringify({
          error: "Route non trouvée",
        }),
      );
  }
});

server.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
