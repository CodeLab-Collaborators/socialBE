import amqp from "amqplib/callback_api";

export const exchanger = (path: string, data: {}) => {
  amqp.connect(
    process.env.EXCHANGER_URL,
    (err: Error, connection: amqp.Connection) => {
      if (err) {
        throw err;
      } else {
        connection.createChannel((err: Error, channel: amqp.Channel) => {
          if (err) {
            throw err;
          } else {
            channel.assertQueue(path, { durable: false });
            channel.sendToQueue(path, Buffer.from(JSON.stringify(data)));
          }
        });
      }
    },
  );
};
