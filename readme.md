# WELCOME TO AROUSA-IPC DOCUMENTATION!!!

- Social Networks
  - [Discord](https://discord.com/invite/ZnXVBUuYHv)
  - [GitHub](https://github.com/alejandroajinho)
  - [Email](https://mail.google.com/mail/u/?authuser=alejandroajinho@gmail.com)
- [Documentation](https://github.com/alejandroajinho/arousa-ipc)

If you have any question don't forget to visit our [Discord](https://discord.com/invite/ZnXVBUuYHv)!!

- [What's **arousa-ipc**](#whats-arousa-ipc)
- [How to use it?](#how-to-use-it)
  - [Examplea](#example)
    - [Parent](#parent)
    - [Child](#child)
- [Parent and Child objects](#parent-and-child-objects)
  - [\<Parent | Child>.send([content], [eventName?], [reply?])](#parent--childsendcontent-eventname-reply)
    - [Parameters](#parameters)
    - [Returns](#returns)
  - [\<Parent | Child>.listen()](#parent--childlisten)
- [Message](#message)
  - [Properties](#properties)
  - [\<Message>.reply([content])](#messagereplycontent)
    - [Parameters](#parameters-1)
    - [Returns](#returns-1)

## What's **arousa-ipc**

Arousa-ipc is an interprocess comunicators that allows you to send messages between parent and child using promises and wait for a response.

## How to use it?

### Example

#### Parent

```js
const {Child} = require("arousa-ipc");
const {fork} = require("child_process");

const childProcess = fork("path/to/child");

const child = new Child(childProcess);

child.send("Hello!!!").then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
```

#### Child
```js
const {Parent} = require("arousa-ipc");

const parent = new Parent();

parent.on("message", (message) => {
  console.log(message);
  if (message.content === "Hello!!!") message.reply("Hello, I'm a child!!!");
});
```

#### Output


```js
Parent output => {content: "Hello, I'm child!!!", messageId: 4837192851, reply: 9375186497}
Child output  => {content: "Hello!!!", messageId: 9375186497}
```

## Parent and Child objects

Parent and Child object are practically the same object. The difference is that parent object uses the process objet to send the data and the child uses the a child_process object.

## \<Parent | Child>.send([content], [eventName?], [reply?])

Sends a message to the parent or the child

### Parameters

|     -     |      TYPE      | OPTIONAL |   DEFAULT   |                DESCRIPTION               |
|:--------: |:--------------:|:--------:|:-----------:|:----------------------------------------:|
|  content  |      any       |    ✗    |             |              The data to send            |
| eventName |     string     |    ✓    |  "message"  | The event where message will be launched |
|   reply   |     number     |    ✓    |     null    |      The id of the message to reply      |

### Returns

|  -  |              TYPE              |         DESCRIPTION        |
|:---:|:------------------------------:|:--------------------------:|
| msg | Promise\<[Message](#message)>  | The promise with the reply |

## \<Parent | Child>.listen()

Makes parent or child listen to events

## Message

The message object. Is given when an event is launched (**raw** events will return strings).

### Properties

|    -      |        TYPE        | OPTIONAL |         DESCRIPTION         |
|:---------:|:------------------:|:--------:|:---------------------------:|
| messageId |  number            |    ✓    |     The ID of the message    |
|  content  |   any              |    ✗    | The data sent in the message |
|  channel  | <Parent \|  Child> |    ✗    |    Parent or Child object    |

### Methods

## \<Message>.reply([content])

### Parameters

|    -    |  TYPE | OPTIONAL |    DESCRIPTION   |
|:-------:|:-----:|:--------:|:----------------:|
| content |  any  |    ✗    | The data to send | 

### Returns

|  -  |              TYPE              |         DESCRIPTION        |
|:---:|:------------------------------:|:--------------------------:|
| msg | Promise\<[Message](#message)>  | The promise with the reply |