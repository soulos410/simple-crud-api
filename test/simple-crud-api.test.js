require("dotenv").config();
const {server} = require("../src/server/simple-crud-api");
const request = require("supertest");

const personObject = {
  name: "Bobby",
  age: 25,
  hobbies: ["sport", "traveling"],
};

describe("simple crud api tests", () => {
  it("should return empty array on get request", () => {
    const httpServer = server();
    request(`http://localhost:${process.env.PORT || 3000}`)
      .get("/person")
      .expect("Content-Type", /json/)
      .expect(200);

    httpServer.close();
  });

  it("should create new person, and then receive this object", () => {
    const httpServer = server();
    const personObject = {
      name: "Sarah",
      age: 22,
      hobbies: ["sport", "programming", "traveling"],
    };

    request(`http://localhost:${process.env.PORT || 3000}`)
      .post("/person")
      .send(personObject)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
          const {id, ...personWithoutId} = JSON.parse(response.text);

          return JSON.stringify(personWithoutId) === JSON.stringify(personObject);
        }
      );

    httpServer.close();
  });

  it("should create new person and get this object by id", async () => {
    const httpServer = server();

    const postRequestResponse = await request(`http://localhost:${process.env.PORT || 3000}`)
      .post("/person")
      .send(personObject);

    const postRequestBody = JSON.parse(postRequestResponse.text);

    const getPersonByIdBody = {id: postRequestBody.id};

    await request(`http://localhost:${process.env.PORT || 3000}`)
      .get("/person/")
      .send(getPersonByIdBody)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
          const {id, ...recordWithoutId} = JSON.parse(response.text);

          return JSON.stringify(recordWithoutId) === JSON.stringify(personObject);
        }
      );

    httpServer.close();
  });

  it("should create valid person, get new person by id," +
    "then update fields and receive same object with new values", async () => {
    const httpServer = server();

    const fieldsToUpdate = {
      name: "Siarhei",
      hobbies: [],
      age: 27,
    };

    const postRequestResponse = await request(`http://localhost:${process.env.PORT || 3000}`)
      .post("/person")
      .send(personObject);

    const postRequestBody = JSON.parse(postRequestResponse.text);

    const getPersonByIdBody = {id: postRequestBody.id};

    const createdPerson = await request(`http://localhost:${process.env.PORT || 3000}`)
      .get("/person/")
      .send(getPersonByIdBody);

    const createdPersonRequestBody = JSON.parse(createdPerson.text);

    await request(`http://localhost:${process.env.PORT || 3000}`)
      .put(`/person/?id=${createdPersonRequestBody.id}`)
      .send({...createdPersonRequestBody, ...fieldsToUpdate })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((response) => {
        const {id, ...updatedPersonRecord} = JSON.parse(response.text);

        return JSON.stringify(updatedPersonRecord) === JSON.stringify(personObject) &&
          personObject.id === id;
      });

    httpServer.close();
  });
});
