# @vatis-tech/asr-client-js

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub issues open](https://img.shields.io/github/issues/Vatis-Tech/asr-client-js.svg)
![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/Vatis-Tech/asr-client-js.svg)

<div align="center"><img src="https://github.com/Vatis-Tech/asr-client-js/blob/feature/VAT-243/github-assets/logos/logo.png?raw=true" alt="@vatis-tech/asr-client-js"/></div>

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

## Constructor

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

## Props

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

In order to use this plugin, you will need to use a valid API key.

To get one, please follow these instructions:

1. If you do not have one, please create an account on [https://vatis.tech/](https://vatis.tech/).
2. Log in to your account on [https://vatis.tech/login](https://vatis.tech/login).
3. Got to the API key page on your account, [https://vatis.tech/account/api-key](https://vatis.tech/account/api-key).
4. Copy the API key from there and add it to the `@vatis-tech/asr-client-js` constructor.

### `onData`

This is a **Function** on which you will receive from the back-end the transcript chunks.

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

The `data` object that is received has the following props:

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

## Methods

### `destroy`

This will destroy the instantiated `@vatis-tech/asr-client-js`.

Also, the destroy method will be invoked if any error will come through the `socket.io-client` as a response from Vatis Tech ASR SERVICE.

### `pause`

Call this method, if you want to pause for a while the recording.

### `resume`

After calling the `pause` method, you can call this one to resume recording.

## Browser Support

We officially support the latest versions of the following browsers:

|                                                                   Chrome                                                                    |                                                                   Firefox                                                                    |                                                                 Safari                                                                  |                                                                             Safari                                                                             |                                                                   Edge                                                                    |
| :-----------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/Vatis-Tech/asr-client-js/blob/feature/VAT-243/github-assets/logos/chrome.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/feature/VAT-243/github-assets/logos/firefox.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/feature/VAT-243/github-assets/logos/safari?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/feature/VAT-243/github-assets/logos/safari-technology-preview.png?raw=true" width="48" height="48"> | <img src="https://github.com/Vatis-Tech/asr-client-js/blob/feature/VAT-243/github-assets/logos/edge.png?raw=true" width="48" height="48"> |

## Contributing

We love pull requests!

Our community is safe for all. Before submitting a pull request, please review and agree our [Code of Conduct](https://github.com/Vatis-Tech/asr-client-js/CODE_OF_CONDUCT.md), after that, please check the [Contribution](https://github.com/Vatis-Tech/asr-client-js/CONTRIBUTING.md) guidelines.

## Getting Help

If you have questions, you need some help, you've found a bug, or you have an improvement idea, do not hesitate to open an [issue here](https://github.com/Vatis-Tech/asr-client-js/issues).

There are three types of issues:

- [Bug report](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=bug&template=bug_report.yml&title=%5BBug%5D%3A+)
- [Feature request](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=feature&template=feature_request.yml&title=%5BFeature%5D%3A+)
- [Help wanted](https://github.com/Vatis-Tech/asr-client-js/issues/new?assignees=einazare&labels=help+wanted&template=help_wanted.yml&title=%5BHelp+wanted%5D%3A+)

## Changelog

To keep the README a bit lighter, you can read the [Changelog here](https://github.com/Vatis-Tech/asr-client-js/CHANGELOG.md).

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
