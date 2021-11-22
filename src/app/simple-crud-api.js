const http = require('http')
const {initializeProcessEnv} = require("../utils");
const url = require("url");
const querystring = require("querystring");

const database = {};

const simpleCrudApi = () => {
  initializeProcessEnv();

  const requestListener = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    // todo get host name
    const host;
    const reqParams = req.url.split("?");
    const personWithIdRouteParam = reqParams[1];

    const test = new URL(req.url);

    const id = test.searchParams.get("id");

    console.log("ID?", id);

    if(!personWithIdRouteParam) {
      res.writeHead(404);
      res.end("Resource not found");
    }

    switch(req.url) {
      case "/person": {
        console.log("person without id");
        res.writeHead(200);
        res.end();
        break;
      }
      case `/person/?${personWithIdRouteParam}`: {
        console.log("person with id");
        res.writeHead(200);
        res.end();
        break;
      }
      default: {
        res.writeHead(404);
        res.end(JSON.stringify({error:"Resource not found"}));
      }

    }
  };

  const server = http.createServer(requestListener).listen(process.env.PORT, (err) => {
    if(err) {
      process.stderr.write("Something went wrong", "utf8");

      process.exit(1);
    }
  });
};

module.exports = { simpleCrudApi };
