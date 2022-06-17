import { Kafka } from "kafkajs";
import { myConsoleDebug } from "../utils/console/myConsoleDebug";
import { myConsoleError } from "../utils/myConsoleError";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: "test", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      myConsoleDebug({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};
run().catch(myConsoleError);

export default consumer;
