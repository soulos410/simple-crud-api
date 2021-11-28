require("dotenv").config();
const request = require("supertest");
const {server} = require("../src/server/simple-crud-api");
const {personFixture, secondPersonFixture} = require("./fixtures/personFixture");

let httpServer = server();

const serverPort = `http://localhost:${process.env.PORT || 3000}`;

describe("simple crud api second scenario test", () => {
  beforeEach(() => {
    httpServer.listen(process.env.PORT || 3000, (err) => {
      if (err) {
        process.stderr.write("Something went wrong", "utf8");

        process.exit(1);
      } else {
        console.log("running on port", process.env.PORT);
      }
    });
  });
  afterEach(() => {
    httpServer.close();
  });

  it("should create new person, then get all persons list," +
    "then try to update created person, add new person, and delete previous person", async () => {
    const createdPersonResponse = await request(serverPort)
      .post("/person")
      .send(personFixture)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
          const {id, ...personWithoutId} = response.body;

          return JSON.stringify(personWithoutId) === JSON.stringify(personFixture);
        }
      );

    const createdPersonResponseBody = createdPersonResponse.body;

    const fieldsToUpdate = {
        name: "Alex",
        age: 50,
    };

    const updatedPersonResponse = await request(serverPort)
      .put(`/person/?id=${createdPersonResponseBody.id}`)
      .send({...createdPersonResponseBody, ...fieldsToUpdate})
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const updatedRecordResponse = response.body;

        return JSON.stringify(updatedRecordResponse) === JSON.stringify(createdPersonResponseBody) &&
          updatedRecordResponse.id === createdPersonResponseBody.id;
      });

    await request(serverPort)
      .post("/person")
      .send(secondPersonFixture)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
          const {id, ...personWithoutId} = response.body;

          return JSON.stringify(personWithoutId) === JSON.stringify(secondPersonFixture);
        }
      );

    await request(serverPort)
      .delete(`/person/${updatedPersonResponse.body.id}`)
      .send()
      .expect(204);

    await request(serverPort)
      .get("/person")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const responseBody = response.body;

        return responseBody.length === 1;
      });
  });
});
