# Mermaid

![alt text](https://raw.githubusercontent.com/sage-bots/mermaid/master/app/public/img/mermaid.jpg?token=AB7b-drfe7mrizF6rqNa2hnsqibQlMD8ks5XskdUwA%3D%3D "Mermaid")

Mermaid is a cross-platform Data Description Language for rapid development & consistent user experiences for conversational UI applications.

## Features

- Route-based Stateful Workflow Engine

  - Using a http-route based system to make it easy to manage state.

- REST API (see below)

- Universal Commands

  - e.g: "start", "restart", "goto", "back", "quit", "help"

- Validators

  - Quickly add custom validation for incoming messages
  - Error message handling
  - The best place to define new validators is in the root of the project; in a ${PROJECT_HOME}/validators directory.

- Templates (Aspect-Oriented Programming)

  - Each template has 4 functions that it needs to define:

    1. **getMessages**

      - This function is a message preprocessor

    2. **getPatternCatcher**

      - This function is a handler for the response coming in from the end-user interacting with the bot.

    3. **getURIForResponse**

      - This function determines what endpoint to goto next.

    4. **getEnd**

      - This function is a message post-processor

  - These four functions make up the behavior of every particular stage in the workflow.

- Hooks

  - Quickly add functionality before or after a message

- Cross-platform Messenger

- REST Integration
- Facebook setup
- E-mail alerts for Admins

## Data Description Language

Each stage in the workflow is defined using one .json document.

These are defined in the project root's 'meta' folder.

All files in the 'meta' directory are read at runtime and put into a javascript object mapping between uri -> object.

Best to use an example to illustrate how the language works:

```
{
    "uri": "/intro/end-working",
    "prompt" : "Impressive! When do you usually finish working?",
    "next-uri" : "/intro/end",
    "type": "store-information",
    "storage-property": "session.end-working",
    "validators": [{
        "type": "time",
        "options": {
            "error": {
                "message" : "Sorry, i don't understand your entry, please tell me the time you start working in the format AM/PM format, for example 09:30am"
            }
        }
    }]
}
```

Each property is used to collectively define the behavior of the stage.

Here's an explanation of the 6 properties shown above:

**uri** - This is the ID (String) for the stage.

**info** - This is an array of string or objects that is the leading texts leading up to the prompt.

**prompt** - The prompt is a special text and should ultimately be the message that the user is going to be responding to. It's special functionality is it will repeat itself if the user's input is invalid.

**next-uri** - The next-uri parameter defines the next stage in the workflow.

**type** - This is possibly the most important property. This defines the template that this stage will use.

**storage-property** - This is a template-specific property, specifically for the 'store-information' template chosen. This defines where to store the information received in the response.

**validators** - This is an array of objects defining what type of validation this stage needs to run the responses through to maintain high data integrity. The validator objects also have an optional error.message property that defines the error response.
