"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../database/init.rabbit");

const log = console.log;

console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

const messageService = {
  consumerQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error consuming queue", error);
    }
  },

  // case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationQueue = "notification-queue-process"; // assert notification queue

      // * 1. TTL (Time To Live)
      // const timeout = 15000; // 15s
      // const timeout = 5000; // 5s
      // setTimeout(() => {
      //   channel.consume(notificationQueue, (msg) => {
      //     console.log(
      //       `SEND notification successfully processed: ${msg.content.toString()}`
      //     );
      //     channel.ack(msg);
      //   });
      // }, timeout);

      // * 2. Logic
      channel.consume(notificationQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });
          if (numberTest < 0.8) {
            throw new Error("Send notification failed 1, pls hot fix");
          }
          console.log(
            `SEND notification successfully processed: ${msg.content.toString()}`
          );
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  // case failed processing
  consumerToQueueDLX: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = "notification-exchange-DLX"; //notification direct exchange DLX
      const notificationRoutingKeyDLX = "notification-routing-key-DLX"; // assert notification queue DLX
      const notificationQueueHotFix = "notification-queue-hotfix"; // assert notification queue hotfix
      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });
      const queueResult = await channel.assertQueue(notificationQueueHotFix, {
        exclusive: false,
      });
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msg) => {
          console.log(
            `SEND notification failed 2, pls hot fix: ${msg.content.toString()}`
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = messageService;
