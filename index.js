/*
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

let resources = [
  { id: 1, title: "Clean Code" },
  { id: 2, title: "Node.js Guide" },
];

let nextId = 3;

// ==============================
// ERROR HANDLER GLOBAL
// ==============================
function errorHandler(err, req, res) {
  console.error(err);

  // Erreur personnalisée
  if (err.statusCode) {
    res.writeHead(err.statusCode, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }

  // Erreur serveur par défaut
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Erreur interne serveur" }));
}

// ==============================
// Helpers
// ==============================
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// ==============================
// SERVER
// ==============================
const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    // =========================
    // GET /api/resources
    // =========================
    if (req.url === "/api/resources" && req.method === "GET") {
      return res.end(JSON.stringify(resources));
    }

    // =========================
    // GET /api/resources/:id
    // =========================
    if (req.url.startsWith("/api/resources/") && req.method === "GET") {
      const id = parseInt(req.url.split("/")[3]);

      const resource = resources.find((r) => r.id === id);

      if (!resource) {
        throw createError("Ressource non trouvée", 404);
      }

      return res.end(JSON.stringify(resource));
    }

    // =========================
    // POST /api/resources
    // =========================
    if (req.url === "/api/resources" && req.method === "POST") {
      const body = await getRequestBody(req);

      if (!body.title) {
        throw createError("Le champ title est obligatoire", 400);
      }

      const newResource = {
        id: nextId++,
        title: body.title,
      };

      resources.push(newResource);

      res.writeHead(201);
      return res.end(JSON.stringify(newResource));
    }

    // =========================
    // ROUTE INCONNUE
    // =========================
    throw createError("Route non trouvée", 404);
  } catch (err) {
    errorHandler(err, req, res);
  }
});

// ==============================
// Lire Body POST (Async)
// ==============================
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(createError("JSON invalide", 400));
      }
    });
  });
}

// ==============================
// START SERVER
// ==============================
server.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
