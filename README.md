# Mermaid

![alt text](https://raw.githubusercontent.com/sage-bots/mermaid/master/lib/app/public/img/mermaid.jpg?token=AB7b-ah0layvLJZT8wqIbF3Bp95Ypc4_ks5Xt6fwwA%3D%3D "Mermaid")

Mermaid is a web application server with a cross-platform Data Description Language for rapid development & consistent user experiences for chatbot / conversational UI applications.

```

var mermaid = require('@sagebots/mermaid');

mermaid();

```

## Installation

```
$ npm install @sage-bots/mermaid


```

## Features

- Data Description Language

  - The Data Description Language is a declarative JSON Psuedo-Language.

  - Each stage in the workflow is defined using one `.json` document.

  - These are defined in the project root's `meta` folder.

  - All files in the `meta` directory are traversed and read at runtime and put into a JavaScript object hash between uri -> object.

  - Best to use an example to illustrate how the language works:

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

  - Each property is used to collectively define the behavior of the stage.

  - Here's an explanation of the 7 properties shown above:

    - **uri** - This is the ID (String) for the stage.

    - **info** - This is an array of string or objects that is the leading texts leading up to the prompt.

    - **prompt** - The prompt is a special text and should ultimately be the message that the user is going to be responding to. It's special functionality is it will repeat itself if the user's input is invalid.

    - **next-uri** - The next-uri parameter defines the next stage in the workflow.

    - **type** - This is possibly the most important property. This defines the template that this stage will use.

    - **storage-property** - This is a template-specific property, specifically for the 'store-information' template chosen. This defines where to store the information received in the response.

    - **validators** - This is an array of objects defining what type of validation this stage needs to run the responses through to maintain high data integrity. The validator objects also have an optional error.message property that defines the error response.

- Route-based Stateful Workflow Engine

  - Using a http-based routing system to make it easy to manage state and traverse the `graph`.


- Full-Featured REST API

  - The foundation of the mermaid framework is an [Express](https://github.com/expressjs/express) server wrapped by a [Feathers](https://github.com/feathersjs/feathers) wrapper.

  - That auto-magically exposes a full-featured REST API for entities like users and messages.

  - The REST API can be found at [PROTOCOL]:[HOSTNAME]:[PORT]/api/v1/{{resource}}

  - For example for a local install on port 3000:

    - You can view user data here: <http://localhost:3000/v1/users>
    - You can view messages data here: <http://localhost:3000/v1/messages>

Additionally, you can also use all the HTTP verbs:

- **GET**
- **POST**
- **PUT**
- **DELETE**

- Proprietary Type System

  - Each type has 4 functions that it needs to define:

    1. **getMessages**

      - This function is a message data pre-processor

    2. **getPatternCatcher**

      - This function is an array of response handlers with REGEX matching.

    3. **getURIForResponse**

      - This function determines what endpoint to go to next.

    4. **getEnd**

      - This function is a response post-processor

  - These four functions make up the behavior for every particular stage in the workflow.

- Validators

  - Quickly add custom validation for incoming messages
  - Error message handling
  - The best place to define new validators is in the root of the project; in a ${PROJECT_HOME}/validators directory.

- Hooks

  - Quickly add code / functionality before or after a stage.

- Cross-platform Messenger

  - Seamless message handling support for downstream platforms.

- Universal Commands

  - e.g: "start", "restart", "goto", "back", "quit", "help"

- Done-for-you Facebook configuration via API calls

- E-mail alerts for application admins
