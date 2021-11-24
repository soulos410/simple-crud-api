require("dotenv").config();
const http = require('http');
const {v4: uuidV4, validate: validateUuid} = require("uuid");

console.log("running on port", process.env.PORT);

const database = [];

class Person {
  constructor(name, age, hobbies) {
    this.id = uuidV4();
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }

  updateData(name, age, hobbies) {
    this.name = name ? name : this.name;
    this.age = age ? age : this.age;
    this.hobbies = hobbies ? hobbies : this.hobbies;
  }
}

const requestHandler = (req, requestMethod, res, requestBody) => {
  const requestFullUrl = new URL(`${req.headers.host}${req.url}`);
  const reqUrlWithoutArgs = req.url.replace(requestFullUrl.search, "");

  switch (reqUrlWithoutArgs) {
    case "/person": {
      switch (requestMethod) {
        case "GET": {
          res.writeHead(200);
          res.end(JSON.stringify(database));
          break;
        }
        case "POST": {
          const isValidInputParams = validateInputParams(requestBody);

          if (!isValidInputParams) {
            res.writeHead(400);

            res.end("Error: some of parameters are invalid");
          } else {
            const { name, age, hobbies } = requestBody;

            const newPerson = new Person(name, age, hobbies);

            database.push(newPerson);

            res.writeHead(201);
            res.end(JSON.stringify(newPerson));
          }
          break;
        }
        default: {
          res.writeHead(404);
          res.end("Invalid request for route /person received");
          break;
        }
      }
      break;
    }
    case "/person/": {
      switch(requestMethod) {
        case "GET": {
          const { id } = requestBody;

          if (isInvalidId(id)) {
            res.writeHead(400);

            res.end("Error: invalid id received");
          } else {
            const databaseRecordById = database.find((person) => person.id === id);

            if (!databaseRecordById) {
              res.writeHead(404);

              res.end("Error: person with provided id was not found");
            } else {
              res.writeHead(200);

              res.end(JSON.stringify(databaseRecordById));
            }
          }
          break;
        }
        case "PUT": {
          const { id } = requestBody;

          if (isInvalidId(id)) {
            res.writeHead(400);

            res.end("Error: invalid id received");
          } else {
            const personWithProvidedId = database.find((person) => person.id === id);

            if (!personWithProvidedId) {
              res.writeHead(404);

              res.end("Error: person with provided id was not found");
            } else {
              const { name, age, hobbies } = requestBody;

              const areHobbiesValid = Array.isArray(hobbies);

              if (!areHobbiesValid) {
                res.writeHead(404);

                res.end("Error: hobbies list is not valid");
              } else {
                personWithProvidedId.updateData(name, age, hobbies);

                res.writeHead(200);

                res.end(JSON.stringify(personWithProvidedId));
              }
            }
          }
          break;
        }
        case "DELETE": {

          break;
        }
        default: {
          res.writeHead(404);
          res.end("Invalid request for route /person/ received");
          break;
        }
      }
      break;
    }
    default: {
      res.writeHead(404);
      res.end("Invalid request received");
      break;
    }
  }
}

const requestListener = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let requestBody = "";
  const method = req.method;

  req.on("data", (data) => {
    try {
      const stringData = data.toString();

      requestBody = JSON.parse(stringData);
    } catch(e) {
      res.writeHead(400);
      res.end(`Wrong data received with ${method} method`);
    }
  });

  req.on("end", () => {
    requestHandler(req, method, res, requestBody);
  })
};

http.createServer(requestListener).listen(process.env.PORT || 3000, (err) => {
  if (err) {
    process.stderr.write("Something went wrong", "utf8");

    process.exit(1);
  }
});

const validateInputParams = (searchParams) => {
  const name = searchParams.name;
  const age = searchParams.age;
  const hobbies = searchParams.hobbies;

  return !(!name || !age || !Array.isArray(hobbies));
}

const isInvalidId = (id) => !id || !validateUuid(id);
