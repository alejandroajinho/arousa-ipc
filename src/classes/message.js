class Message {
  constructor(payload, channel) {
    if (!payload) throw new Error("Paylaod was not provided.");
    if (typeof payload !== "object" || Array.isArray(payload)) throw new Error("Payload must be an object.");
    if (!channel) throw new Error("You must provide the channel to send the message (process or child process).");
    delete payload.reply;
    delete payload.eventName;
    Object.assign(this, payload);
    if (payload.messageId) Object.defineProperty(this, "messageId", {configurable: false, writable: false, value: payload.messageId});
    Object.defineProperty(this, "channel", {configurable: false, writable: false, value: channel});
  }

  // Replies to the message
  reply(payload) {
    this.channel.send(payload, null, this.messageId);
  }
}

module.exports = Message;