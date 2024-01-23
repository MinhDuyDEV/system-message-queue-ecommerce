"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../database/init.rabbit");

const messageService = {
  consumerQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error consuming queue", error);
    }
  },
};

module.exports = messageService;
