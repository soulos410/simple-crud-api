require("dotenv").config();
const http = require('http');
const {v4: uuidV4} = require("uuid");

console.log("running on port", process.env.PORT);

const database = [];

class Person {
  constructor(name, age, hobbies) {
    this.id = uuidV4();
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }
}

const requestListener = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const host = req.headers.host;
  const method = req.method;

  const requestFullUrl = new URL(`${host}${req.url}`);

  const reqUrlWithoutArgs = req.url.replace(requestFullUrl.search, "");

  switch (reqUrlWithoutArgs) {
    case "person/":
    case "/person/": {
      switch (method) {
        case "GET": {
          console.log("req", req);
          res.end(JSON.stringify(database));
          break;
        }
        case "POST": {
          console.log("req", req);
          validateInputParams(requestFullUrl.searchParams, res);

          const { name, age, hobbies } = extractInputParams(requestFullUrl.searchParams);

          database.push(new Person(name, age, hobbies));

          console.log("DATABASE?", database);

          res.writeHead(200);
          res.end("Successfully add new person");
          break;
        }
        default: {
          res.writeHead(404);
          res.end("Invalid request received");
          break;
        }
      }
      break;
    }
    case "/person": {
      console.log("person without id");
      res.writeHead(200);
      res.end();
      break;
    }
    default: {
      res.writeHead(404);
      res.end(JSON.stringify({error: "Resource not found"}));
    }

  }
};

http.createServer(requestListener).listen(process.env.PORT, (err) => {
  if (err) {
    process.stderr.write("Something went wrong", "utf8");

    process.exit(1);
  }
});

const validateInputParams = (searchParams, response) => {
  const name = searchParams.get("name");
  const age = searchParams.get("age");
  const hobbies = searchParams.get("hobbies");

  if (!name || !age || !hobbies) {
    response.writeHead(404);

    response.end("Error: some of parameters are invalid");
  }
}

const extractInputParams = (searchParams) => {
  const name = searchParams.get("name");
  const age = searchParams.get("age");
  const hobbies = searchParams.get("hobbies");

  console.log(hobbies);
  console.log(typeof hobbies);
  console.log(JSON.parse(searchParams));

  return { name, age, hobbies };
}
