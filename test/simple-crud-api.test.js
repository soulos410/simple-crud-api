require("dotenv").config();
const { server } = require("../src/server/simple-crud-api");
const request = require('supertest');

// const request = (url) =>
//   new Promise((resolve, reject) => {
//     http.get({path: url}, (response) => {
//       let result = "";
//       response.on("data", (data) =>
//         result = data,
//       );
//
//       response.on("end", () =>
//         resolve(result),
//       );
//
//       response.on("error", () =>
//         reject("Error on response?")
//       );
//     });
//   });

describe("simple crud api tests", () => {
  it("should return empty array on get request", async () => {
    const httpServer = server();
    await request(`http://localhost:${process.env.PORT || 3000}`)
      .get("/person")
      .expect("Content-Type", /json/)
      .expect(200);

    httpServer.close();
  });

  it("should create new person, and then receive this object", async () => {
    const httpServer = server();
    const personObject = {
      name: "Sarah",
      age: 22,
      hobbies: ["sport", "programming", "traveling"],
    };

    await request(`http://localhost:${process.env.PORT || 3000}`)
      .post("/person")
      .send(personObject)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((response) => {
        console.log(response.text, JSON.stringify(personObject));
        return JSON.stringify(response.text) === JSON.stringify(personObject)
        }
      );

    httpServer.close();
  });
});
