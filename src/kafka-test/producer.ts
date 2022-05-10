import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
  // Producing
  await producer.connect();

  setInterval(async () => {
    await producer.send({
      topic: "test",
      messages: [{ value: new Date().toISOString() }],
    });
  }, 1000);
};
run().catch(console.error);

export default producer;
