"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    if (!connection) throw new Error("No connection to RabbitMQ");
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    // Publish message to queue
    const queue = "test-queue";
    const msg = "Hello world";
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(msg));
    // Connection close
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName}`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received message: ${queueName} - ${msg.content.toString()}`
        );
        // 1. find User following SHOP
        // 2. Send message to User
        // 3. yes, ok => success
        // 4. error, setup DLX
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Error consuming queue", error);
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
};
