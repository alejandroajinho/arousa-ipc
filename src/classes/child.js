const EventEmitter = require("events");

const Message = require("./message");

class Child extends EventEmitter {
  constructor(child, maxMessageAge=60000*30) {
    super();
    this.messages = new Map();
    this.child = child;
    this.maxMessageAge = maxMessageAge;
  }

  // Sends a message to child process
  send(content, eventName, reply) {
    return new Promise((resolve, reject) => {
      if (!content) return reject(new Error("You must provide some data to send."));
      const payload = {content, messageId: Math.floor(Math.random() * 1000000001), eventName};
      if (!reply) {
        const message = JSON.stringify(payload);
        this.child.send(message);
        this.messages.set(payload.messageId, {
          resolve,
          timeout: setTimeout(() => this.messages.delete(payload.id), this.maxMessageAge) 
        });
      } else {
        payload.reply = reply;
        const message = JSON.stringify(payload);
        this.child.send(message);
        this.messages.set(payload.messageId, {
          resolve,
          timeout: setTimeout(() => this.messages.delete(payload.messageId), this.maxMessageAge)
        })
      }
    });
  }

  // Makes parent listen to child
  listen() {
    this.child.on("message", (msg) => {
      this.emit("raw", msg);
      try {
        const payload = JSON.parse(msg);
        if (!payload.messageId) return this.emit("message", new Message(payload, this));
        if (payload.reply) {
          if (!this.messages.has(payload.reply)) return this.emit("unhandledReply", new Message(payload, this));
          this.messages.get(payload.reply).resolve(new Message(payload, this))
          clearTimeout(this.messages.get(payload.reply));
          this.messages.delete(payload.reply);
        } else {
          this.emit(payload.eventName ?? "message", new Message(payload, this)) 
        }
      } catch {
        this.emit("message", new Message({content: msg}, this));
      }
    });
  }
}

module.exports = Child;