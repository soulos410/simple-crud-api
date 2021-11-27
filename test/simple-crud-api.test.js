require("dotenv").config();
const {server} = require("../src/server/simple-crud-api");
const request = require("supertest");

const personObject = {
  name: "Bobby",
  age: 25,
  hobbies: ["sport", "traveling"],
};

let httpServer = server();

const serverPort = `http://localhost:${process.env.PORT || 3000}`;

describe("simple crud api tests", () => {
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

  it("should return empty array on get request", () => {
    request(serverPort)
      .get("/person")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("should create new person, and then receive this object", () => {
    const personObject = {
      name: "Sarah",
      age: 22,
      hobbies: ["sport", "programming", "traveling"],
    };

    request(serverPort)
      .post("/person")
      .send(personObject)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
          const {id, ...personWithoutId} = response.body;

          return JSON.stringify(personWithoutId) === JSON.stringify(personObject);
        }
      );
  });

  it("should create new person and get this object by id", async () => {
    const postRequestResponse = await request(serverPort)
      .post("/person")
      .send(personObject);

    const postRequestBody = postRequestResponse.body;

    await request(serverPort)
      .get(`/person/${postRequestBody.id}`)
      .send()
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
          const {id, ...recordWithoutId} = response.body;

          return JSON.stringify(recordWithoutId) === JSON.stringify(personObject);
        }
      );
  });

  it("should create valid person, get new person by id," +
    "then update fields and receive same object with new values", async () => {
    const fieldsToUpdate = {
      name: "Siarhei",
      hobbies: [],
      age: 27,
    };

    const postRequestResponse = await request(serverPort)
      .post("/person")
      .send(personObject);

    const postRequestBody = postRequestResponse.body;

    const createdPerson = await request(serverPort)
      .get(`/person/${postRequestBody.id}`)
      .send();

    const createdPersonRequestBody = createdPerson.body;

    await request(serverPort)
      .put(`/person/?id=${createdPersonRequestBody.id}`)
      .send({...createdPersonRequestBody, ...fieldsToUpdate })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const {id, ...updatedPersonRecord} = response.body;

        return JSON.stringify(updatedPersonRecord) === JSON.stringify(personObject) &&
          personObject.id === id;
      });
  });

  it("should create new person, then try to delete with successful result", async () => {
    const postRequestResponse = await request(serverPort)
        .post("/person")
        .send(personObject);

    const { id } = postRequestResponse.body;

    await request(serverPort)
        .delete(`/person/${id}`)
        .send()
        .expect(204);
  });

  it("should create new person, then delete created person by id, then trying to receive deleted person", async () => {
    const postRequestResponse = await request(serverPort)
        .post("/person")
        .send(personObject);

    const {id} = postRequestResponse.body;

    await request(serverPort)
        .delete(`/person/${id}`)
        .send();

    await request(serverPort)
        .get(`/person/${id}`)
        .send()
        .expect("Content-Type", /json/)
        .expect(404)
  });
});
