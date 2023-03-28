# @vatis-tech/asr-client-js

![version](https://img.shields.io/badge/version-2.0.5-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues open](https://img.shields.io/github/issues/Vatis-Tech/asr-client-js.svg)
![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/Vatis-Tech/asr-client-js.svg)

<div align="center"><img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/logo.png?raw=true" alt="@vatis-tech/asr-client-js"/></div>

#### Client JavaScript implementation for Vatis Tech's live ASR service.

### Contents

- **[Installation 📀](#installation)**
- **[Constructor 🦺](#constructor)**
- **[Props 📦](#props)**
- **[Methods 🖇](#methods)**
- **[Browser Support 🔮](#browser-support)**
- **[Contributing 🏗](#contributing)**
- **[Getting Help ☎️](#getting-help)**
- **[Changelog 💾](#changelog)**
- **[Further Reading 📚](#further-reading)**

## Installation

### Via NPM

**Install the latest version**

```
npm i @vatis-tech/asr-client-js
```

This will install the latest version of `@vatis-tech/asr-client-js` with the caret (`^`) symbol to its version, inside the `package.json` file.

This means, that when you will do a later install into your project, it will take the latest minor version.

You can read more about this here: [npm caret and tilde](https://stackoverflow.com/a/22345808).

**Install the exact latest version.**

```
npm i -E @vatis-tech/asr-client-js
```

This will install the latest version of `@vatis-tech/asr-client-js` without the caret (`^`).

This means that on each new install, you will still have the initial installed version.

You can read more about this here: [npm install --save-exact](https://docs.npmjs.com/cli/v8/commands/npm-install#save-exact).

### Via CDN

You can also use this plugin via CDN, and use it inside an HTML & JavaScript project, that will run in browsers.
Just copy and paste the following script into your project:

```
<script src="unpkg.com/@vatis-tech/asr-client-js@1.2.1/umd/vatis-tech-asr-client.umd.js" charset="utf-8"></script>
```

### Via Download

You can also choose to download it, and use it locally, instead of a CDN.
You can download it by pressing the following link: [download here](https://github.com/Vatis-Tech/asr-client-js/archive/refs/heads/main.zip).
Or, download it from Github [here](https://github.com/Vatis-Tech/asr-client-js).
After that copy and paste the following script into your app:

```
<script src="%path%/asr-client-js/dist/umd/vatis-tech-asr-client.umd.js" charset="utf-8"></script>
```

And replace `%path%` with the path where you've downloaded and unzipped the plugin.

## Constructor

### Via NPM

First you need to import the plugin:

```
import VTC from "@vatis-tech/asr-client-js";
```

After that, you can initialize it like so:

```
const vtc = new VTC({
  service: "LIVE_ASR",
  language: "ro_RO",
  apiKey: "YOUR_API_KEY",
  onData: (data) => { console.log(data); },
  log: true,
});
```

### Via CDN or Download

If you opted out to use it as a downloadable or CDN (i.e. via a `script` tag inside a **static** HTML & JavaScript project), you will be able to use the constructor as follows:

```
const vtc = new VatisTechClient.default({
  service: "LIVE_ASR",
  language: "ro_RO",
  apiKey: "YOUR_API_KEY",
  onData: (data) => { console.log(data); },
  log: true,
});
```

## Props

### `config`

This is an **Object** with the following structure:

```json
{
  "spokenCommandsList": [
    {
      "command": "COMMAND_NAME",
      "regex": [ "regex1", "regex2", "regex3", ... ]
    },
    ...
  ],
  "findReplaceList": [
    {
      "replacement": "REPLACEMENT",
      "regex": [ "regex1", "regex2", "regex3", ... ]
    }
  ]
}
```

#### `spokenCommandsList`

Where the value of `spokenCommandsList` is an array of objects that have two properties, `command` and `regex`.

The value of the `command`, i.e. `COMMAND_NAME`, is a **String**.

The value of the `regex`, i.e. `[ "regex1", "regex2", "regex3", ... ]`, is an **Array of Strings**, i.e. `regex1`, `regex2`, `regex3` are **Strings**.

The ideea with this `spokenCommandsList`, is that each time one of the values from the `regex` array is matched in the transcript, it will fire the [onCommandData callback](#oncommanddata), with a special `header` on the data, named `SpokenCommand`.
The value of the `SpokenCommand` header will be exactly the value of the `command`, i.e. `COMMAND_NAME`.

For example, you can use this `spokenCommandsList` to define rules of when you want a new paragraph:

```json
{
  "spokenCommandsList": [
    {
      "command": "NEW_LINE",
      "regex": ["new line", "new paragraph", "from the start", "start new line"]
    }
  ]
}
```

So each time the back-end algorithm will find in the transcript one of `"new line"`, `"new paragraph"`, `"from the start"`, `"start new line"` phrases, the VTC client will fire the [onCommandData callback](#oncommanddata). This way, in your application, you will be able to know, when to start a new paragraph.

#### `findReplaceList`

And the value of `findReplaceList` is an array of objects that have two properties, `replacement` and `regex`.

The value of the `replacement`, i.e. `REPLACEMENT`, is a **String**.

The value of the `regex`, i.e. `[ "regex1", "regex2", "regex3", ... ]`, is an **Array of Strings**, i.e. `regex1`, `regex2`, `regex3` are **Strings**.

The ideea with this `findReplaceList`, is that each time one of the values from the `regex` array is matched in the transcript, it will change it to the `replacement`.

For example, you can use this `findReplaceList` to define rules for wrong named entities

```json
{
  "findReplaceList": [
    {
      "replacement": "SpongeBob",
      "regex": ["Spange Bwab", "SpanBob", "Spwange Bob", "Sponge Boob"]
    }
  ]
}
```

So each time the back-end algorithm will find in the transcript one of `"Spange Bwab"`, `"SpanBob"`, `"Spwange Bob"`, `"Sponge Boob"` phrases, it will change it to `"SpongeBob"`.

You can also have replacements as symbols and punctuation marks:

```json
{
  "findReplaceList": [
    {
      "replacement": "(",
      "regex": ["open parentheses", "new parentheses"]
    },
    {
      "replacement": ")",
      "regex": ["close parentheses", "stop parentheses"]
    },
    {
      "replacement": "[",
      "regex": ["open square brackets", "new square brackets"]
    },
    {
      "replacement": "]",
      "regex": ["close square brackets", "stop square brackets"]
    }
  ]
}
```

#### Notes

When sending a `config` to the client, the first callback to be fired, will be the [onConfig callback](#oncommanddata).

### `service`

This is a **String** that refers to the service that you would like to use.

Vatis Tech offers two speech-to-text services, `LIVE_ASR`, you will receive the transcript while recording your microphone.

And `STATIC_ASR`, you upload a file, and receive the transcript on a given link (at the moment, this plugin does not support this feature).

**Only `LIVE_ASR` can be used at the moment.**

### `model`

This is a **String** that represents the **ID** of the model you want to use.

If not specified, the default model of the selected language will be used.

### `language`

This is a **String** for the language you want to transcribe from.

It must be in the following format: `language_region`.

At the moment, only `ro_RO` is available.

### `apiKey`

This is a **String** of your API key.

To get one, please follow these instructions:

1. If you do not have one, please create an account on [https://vatis.tech/](https://vatis.tech/).
2. Log in to your account on [https://vatis.tech/login](https://vatis.tech/login).
3. Got to the API key page on your account, [https://vatis.tech/account/api-key](https://vatis.tech/account/api-key).
4. Copy the API key from there and add it to the `@vatis-tech/asr-client-js` constructor.

### `connectionConfig`

This is an **Object** with the following structure:

```json
{
  "service_host": "service_host",
  "auth_token": "auth_token"
}
```

Where `service_host` is a string, and the value of it is the host where the **Vatis Tech Transcription Service** is located. And `auth_token` is a string, that is the **Authentication token** for connecting to the **Vatis Tech Transcription Service**.

#### NOTE

You will only use one of the `connectionConfig` or `apiKey` method to connect to the **Vatis Tech Transcription Service**.
You will use the `apiKey` when connecting to the **Vatis Tech Cloud API**, and you will use the `connectionConfig` method when using the **Vatis Tech On Premise Installation**, and you will be provided with the necessary `connectionConfig` object.

### `onData`

This is a **Function** on which you will receive from the back-end the transcript chunks. **It is a callback it is always fired.**.

It has the following signature:

```
const onData = (data) => {
	/* do something with data */
}
```

Or with function names:

```
function onData(data) {
	/* do something with data */
}
```

The `data` object that is received has the following structure:

#### General structure

```json
{
  "type": "<str>",
  "headers": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

#### Timestamped transcription packet

```json
{
  "type": "TIMESTAMPED_TRANSCRIPTION",
  "headers": {},
  "transcript": "hello world",
  "words": [
    {
      "word": "hello",
      "start_time": 1350.39,
      "end_time": 4600.5,
      "speaker": "Speaker 1",
      "confidence": 0.96,
      "entity": null,
      "entity_group_id": null
    },
    {
      "word": "world",
      "start_time": 6200.3,
      "end_time": 8020.0,
      "speaker": "Speaker 1",
      "confidence": 0.98,
      "entity": null,
      "entity_group_id": null
    }
  ]
}
```

#### Timestamped transcription packet

```json
{
  "type": "PROCESSED_TIMESTAMPED_TRANSCRIPTION",
  "headers": {},
  "transcript": "Hello, world!",
  "words": [
    {
      "word": "hello",
      "start_time": 1350.39,
      "end_time": 4600.5,
      "speaker": "Speaker 1",
      "confidence": 0.96,
      "entity": null,
      "entity_group_id": null
    },
    {
      "word": "world",
      "start_time": 6200.3,
      "end_time": 8020.0,
      "speaker": "Speaker 1",
      "confidence": 0.98,
      "entity": null,
      "entity_group_id": null
    }
  ],
  "processed_words": [
    {
      "word": "Hello,",
      "start_time": 1350.39,
      "end_time": 4600.5,
      "speaker": "Speaker 1",
      "confidence": 0.96,
      "entity": null,
      "entity_group_id": null
    },
    {
      "word": "world!",
      "start_time": 6200.3,
      "end_time": 8020.0,
      "speaker": "Speaker 1",
      "confidence": 0.98,
      "entity": null,
      "entity_group_id": null
    }
  ]
}
```

#### Headers

| Name                  | Type    | Description                                                                                                |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| PacketNumber          | int     | Incremental packet number                                                                                  |
| Sid                   | string  | Session id                                                                                                 |
| FrameStartTime        | double  | Frame start time in milliseconds                                                                           |
| FrameEndTime          | double  | Frame end time in milliseconds                                                                             |
| FinalFrame            | boolean | Flag for marking that a segment of speech has ended and it won't be updated                                |
| SilenceDetected       | boolean | Flag to indicate silence was detected on the audio frame                                                   |
| ProcessingTimeSeconds | double  | Time of inferencing                                                                                        |
| SplitPacket           | boolean | Flag that indicates the response packet was split and this is one of the pieces                            |
| FinalSplitPacket      | boolean | Flag that indicates this is the final piece of the split response                                          |
| SplitId               | string  | Full packet id in format `<packet_number>.<split_id>.<sub-split-id>.<sub-sub-split-id>`                    |
| RequestBytes          | int     | Additional bytes requested to produce a frame. This is just an estimation, any number of bytes can be sent |
| SpokenCommand         | string  | Command detected in frame                                                                                  |

#### NOTE

So, the `data` can be final frame - i.e. the backend has fully finalized the transcript for those words and the time intervals (start and end time).
Or can be partial frame - i.e. the backend has not fully finalized the transcript for those words and the time intervals, and it will most likely change until it is overlapped by a final frame.

### `onPartialData`

This is a **Function** on which you will receive from the back-end the partial transcript chunks.

It is identical to what the [onData callback](#ondata) does, just that the `data` will always represent partial frames.

It has the following signature:

```
const onPartialData = (data) => {
	/* do something with data */
}
```

Or with function names:

```
function onPartialData(data) {
	/* do something with data */
}
```

#### NOTE

The `data` object that comes on the current `onPartialData` callback overrides the `data` object that came on the previous `onPartialData` callback.

### `onFinalData`

This is a **Function** on which you will receive from the back-end the final transcript chunks.

It is identical to what the [onData callback](#ondata) does, just that the `data` will always represent final frames.

It has the following signature:

```
const onFinalData = (data) => {
	/* do something with data */
}
```

Or with function names:

```
function onFinalData(data) {
	/* do something with data */
}
```

#### NOTE

The `data` object that comes from the `onFinalData` callback overrides the `data` object that came on the previous `onPartialData` callback.

### `onConfig`

This is a **Function** on which you will receive from the back-end a message saying if the config was succesfully added ore not.

It has the following signature:

```
const onConfig = (data) => {
	/* do something with data */
}
```

Where `data` object has the following structure:

#### Config applied packet

```json
{
  "type": "CONFIG_APPLIED",
  "headers": {},
  "config_packet": {
    "type": "CONFIG",
    "headers": {},
    "spokenCommandsList": [
      {
        "command": "NEW_PARAGRAPH",
        "regex": ["new line"]
      }
    ]
  }
}
```

### `onCommandData`

This is a **Function** on which you will receive from the back-end the transcript chunks for speciffic commands.

For example, if you initialize the plugin with a set of commands (e.g. `{spokenCommandsList: [ { "command": "NEW_PARAGRAPH", "regex": ["start new paragraph", "new phrase", "new sentence"] } ] }`), each time the back-end algorithm will find these sets of commands, it will send on this function the data.

It has the following signature:

```
const onCommandData = (data) => {
	/* do something with data */
}
```

Or with function names:

```
function onCommandData(data) {
	/* do something with data */
}
```

The `data` object from this callback, is the same as the one from [onData callback](#ondata), but it also has a new property, named `spokenCommand`, with the actual command that triggered the callback.

### `log`

This is a **Boolean** prop.

If set to true, it will call the `logger` function with an object that has the following structure:

```
{
	currentState: ...,
    description: ....
}
```

This tells you the current state of the plugin.

The last state will be the following:

```
{
  currentState: `@vatis-tech/asr-client-js: Initialized the "MicrophoneGenerator" plugin.`,
  description: `@vatis-tech/asr-client-js: The MicrophoneGenerator was successful into getting user's microphone, and will start sending data each 1 second.`,
}
```

### `logger`

This is a **Function** on which you will receive data about the plugin state.

It has the following signature:

```
const logger = (info) => {
	/* do something with info */
}
```

Or with function names:

```
function onData(info) {
	/* do something with info */
}
```

The `info` object that is received has the props from above.

If `log` prop is set to `true` and the `logger` prop is not set, or is not a function with the above signature, the plugin will default the `logger` to `console.log`.

### `onDestroyCallback`

This is a **Function** that will be called upon successful destruction;

### `errorHandler`

This is a **Function** that will be called upon errors;

### `host`

This is the host for generating a key. It defaults to "https://vatis.tech/".

### `microphoneTimeslice`

How fast you want data to be captured from the microphone. Default is `250 milliseconds`.

### `frameLength`

The frame length of what the microphone catches. Default is `0.3 seconds`. (For a `microphoneTimeslice` of `250`, the `frameLength` is `0.3`).

### `frameOverlap`

Default is `0.3 seconds`.

### `bufferOffset`

Default is `0.3 seconds`.

### `waitingAfterMessages`

This is a **number** that needs to be _> 0_. It represents the number of message to be sent to the ASR Service, before waiting for a response. Default is `5`.

### `EnableOnCommandFinalFrame`

This is a **boolean**, and if set to `true`, it means, that each time the transcription sees one command, it will trigger a final frame there.

## Methods

### `destroy`

This will destroy the instantiated `@vatis-tech/asr-client-js`.

Also, the destroy method will be invoked if any error will come through the `socket.io-client` as a response from Vatis Tech ASR SERVICE.

**NOTE! If the VTC plugin did not send all messages, or it did not receive all messages, the destruction will not happen instantly.**
**NOTE! The destruction of the VTC plugin will happen only when all messages have been sent and received.**
**NOTE! If you wish to destroy the VTC plugin without waiting for all messages to be sent and received, you can pass `{ hard: true}` as a parameter to the `.destroy` call.**

### `pause`

Call this method, if you want to pause for a while the recording.

### `resume`

After calling the `pause` method, you can call this one to resume recording.

## Browser Support

We officially support the latest versions of the following browsers:

|                                                              Chrome                                                              |                                                              Firefox                                                              |                                                              Safari                                                              |                                                                       Safari                                                                        |                                                              Edge                                                              |
| :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/chrome.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/firefox.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/safari.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/safari-technology-preview.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/main/github-assets/logos/edge.png?raw=true" width="48" height="48"> |

## Contributing

We love pull requests!

Our community is safe for all. Before submitting a pull request, please review and agree our [Code of Conduct](https://github.com/Vatis-Tech/asr-client-js/blob/main/CODE_OF_CONDUCT.md), after that, please check the [Contribution](https://github.com/Vatis-Tech/asr-client-js/blob/main/CONTRIBUTING.md) guidelines.

## Getting Help

If you have questions, you need some help, you've found a bug, or you have an improvement idea, do not hesitate to open an [issue here](https://github.com/Vatis-Tech/asr-client-js/issues).

There are three types of issues:

- [Bug report](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+)
- [Feature request](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=feature&template=feature_request.yml&title=%5BFeature%5D%3A+)
- [Help wanted](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=help+wanted&template=help_wanted.yml&title=%5BHelp+wanted%5D%3A+)

## Changelog

To keep the README a bit lighter, you can read the [Changelog here](https://github.com/Vatis-Tech/asr-client-js/blob/main/CHANGELOG.md).

## Further Reading

#### Developers

If you are a developer, the following links might interest you:

- API documentation: [https://vatis.tech/documentation/](https://vatis.tech/documentation/#introduction)
- API status: [https://vatistech.statuspage.io/](https://vatistech.statuspage.io/)
- Supported languages: [https://vatis.tech/languages](https://vatis.tech/languages)
- Accepted file formats: [https://vatis.tech/formats](https://vatis.tech/formats)
- Check the pricing: [https://vatis.tech/pricing](https://vatis.tech/pricing)
- Join the team: [https://vatis.tech/careers](https://vatis.tech/careers)

#### About Vatis Tech

If you are just curios to learn more about Vatis Tech, please refer to these links:

- Landing page for Vatis Tech: [https://vatis.tech/](https://vatis.tech/)
- About Vatis Tech: [https://vatis.tech/about](https://vatis.tech/about)
- Vatis Tech newsroom: [https://vatis.tech/press](https://vatis.tech/press)

#### Social Media

- Message us on Facebook: [https://www.facebook.com/VatisTech/](https://www.facebook.com/VatisTech/)
- Connect with us on LinkedIn: [https://www.linkedin.com/company/vatis-tech/](https://www.linkedin.com/company/vatis-tech/)
- Chat with out Facebook community: [https://www.facebook.com/groups/1630293847133624](https://www.facebook.com/groups/1630293847133624)
