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

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
};
