"use strict";

const { consumerQueue } = require("./src/services/consumer.service");

const queueName = "test-queue";

consumerQueue(queueName)
  .then(() => {
    console.log(`Waiting for messages in ${queueName}`);
  })
  .catch((error) => {
    console.error("Error consuming queue", error);
  });
