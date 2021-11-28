require("dotenv").config();
const request = require("supertest");
const {server} = require("../src/server/simple-crud-api");
const {personFixture, secondPersonFixture} = require("./fixtures/personFixture");

let httpServer = server();

const serverPort = `http://localhost:${process.env.PORT || 3000}`;

describe("simple crud api third scenario test", () => {
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

  it("should create 2 persons, then get all persons list," +
    "then update 2 created persons, get updated persons list, then delete all persons by received ids", async () => {
    const firstCreatedPersonResponse = await request(serverPort)
      .post("/person")
      .send(personFixture)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
          const {id, ...personWithoutId} = response.body;

          return JSON.stringify(personWithoutId) === JSON.stringify(personFixture);
        }
      );

    const secondCreatedPersonResponse = await request(serverPort)
      .post("/person")
      .send(secondPersonFixture)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
          const {id, ...personWithoutId} = response.body;

          return JSON.stringify(personWithoutId) === JSON.stringify(secondPersonFixture);
        }
      );

    const firstCreatedPersonBody = firstCreatedPersonResponse.body;
    const secondCreatedPersonBody = secondCreatedPersonResponse.body;

    const updateFirstPersonResponse = await request(serverPort)
      .put(`/person/?id=${firstCreatedPersonBody.id}`)
      .send({...firstCreatedPersonBody, ...{name: "Matt", age: 53}})
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const updatedRecordResponse = response.body;

        return JSON.stringify(updatedRecordResponse) === JSON.stringify(firstCreatedPersonBody) &&
          updatedRecordResponse.id === firstCreatedPersonBody.id;
      });

    const updateSecondPersonResponse = await request(serverPort)
      .put(`/person/?id=${secondCreatedPersonBody.id}`)
      .send({...secondCreatedPersonBody, ...{name: "John", age: 22}})
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const updatedRecordResponse = response.body;

        return JSON.stringify(updatedRecordResponse) === JSON.stringify(secondCreatedPersonBody) &&
          updatedRecordResponse.id === secondCreatedPersonBody.id;
      });

    const firstPersonUpdatedBody = updateFirstPersonResponse.body;
    const secondPersonUpdateBody = updateSecondPersonResponse.body;

    await request(serverPort)
      .get("/person")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const responseBody = response.body;

        return responseBody.length === 2;
      });

    await request(serverPort)
      .delete(`/person/${firstPersonUpdatedBody.id}`)
      .send()
      .expect(204);

    await request(serverPort)
      .delete(`/person/${secondPersonUpdateBody.id}`)
      .send()
      .expect(204);

    await request(serverPort)
      .get("/person")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const responseBody = response.body;

        return responseBody.length === 0;
      });

  });
});
