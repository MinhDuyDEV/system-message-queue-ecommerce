"use strict";

const {
  consumerQueue,
  consumerToQueueDLX,
  consumerToQueueNormal,
} = require("./src/services/consumer.service");

const queueName = "test-queue";

// consumerQueue(queueName)
//   .then(() => {
//     console.log(`Waiting for messages in ${queueName}`);
//   })
//   .catch((error) => {
//     console.error("Error consuming queue", error);
//   });

consumerToQueueNormal(queueName)
  .then(() => {
    console.log(`Waiting for messages in ${queueName} normal`);
  })
  .catch((error) => {
    console.error("Error consuming queue", error);
  });

consumerToQueueDLX(queueName)
  .then(() => {
    console.log(`Waiting for messages in ${queueName} DLX`);
  })
  .catch((error) => {
    console.error("Error consuming queue", error);
  });
