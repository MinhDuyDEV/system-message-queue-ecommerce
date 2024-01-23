"use strict";

const mongoose = require("mongoose");

const connectionString = "mongodb://localhost:27017/shopDEV";

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", TestSchema);

describe("MongoDB connection", () => {
  let connection;
  // Connect to MongoDB before running tests
  beforeAll(async () => {
    connection = await mongoose.connect(connectionString);
  });

  // Close connection after all tests
  afterAll(async () => {
    await connection.disconnect();
  });

  it("should connect to MongoDB", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a document to the database", async () => {
    const user = new Test({ name: "Duy" });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it("should find a document to the database", async () => {
    const user = await Test.findOne({ name: "Duy" });
    expect(user).toBeDefined();
    expect(user.name).toBe("Duy");
  });
});
