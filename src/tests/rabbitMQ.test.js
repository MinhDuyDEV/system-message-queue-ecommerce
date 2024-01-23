"use strict";

const { connectToRabbitMQForTest } = require("../database/init.rabbit");

describe("RabbitMQ connection", () => {
  it("should connect to RabbitMQ", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
