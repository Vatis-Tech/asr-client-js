import ApiKeyGenerator from "./components/ApiKeyGenerator.js";
import SocketIOClientGenerator from "./components/SocketIOClientGenerator.js";
import MicrophoneGenerator from "./components/MicrophoneGenerator.js";

import functions from "./helpers/functions/index.js";

const { generateApiUrl } = functions;

class VatisTechClient {
  microphoneGenerator;
  apiKeyGenerator;
  socketIOClientGenerator;
  constructor({ service, model, language, apiKey, onDataCallback }) {
    // instantiante ApiKeyGenerator - this will return on the responseCallback the serviceHost and the authToken for the SocketIOClientGenerator to connect based on the apiUrl and apiKey
    this.apiKeyGenerator = new ApiKeyGenerator({
      apiUrl: generateApiUrl({ service, model, language }),
      responseCallback: this.initSocketIOClient.bind(this),
      apiKey: apiKey,
    });

    // instantiante SocketIOClientGenerator - this will return on the onAsrResultCallback the results that it gets back from the ASR SERVICE and when it connects to the ASR SERVICE it will initilize the MicrophoneGenerator through the onConnectCallback
    this.socketIOClientGenerator = new SocketIOClientGenerator({
      onConnectCallback: this.initMicrophone.bind(this),
      onAsrResultCallback: onDataCallback,
    });

    // instantiante MicrophoneGenerator - this will return on the onDataCallback the data that it captures from the user's microphone
    this.microphoneGenerator = new MicrophoneGenerator({
      onDataCallback: this.onDataCallback.bind(this),
    });

    // initilize ApiKeyGenerator (if successful it will initilize SocketIOClientGenerator (if successful it will initilize the MicrophoneGenerator))
    this.initApiKey();
  }

  // initilize ApiKeyGenerator
  // this is called after the instantiantion of all Generators
  initApiKey() {
    this.apiKeyGenerator.init();
  }

  // initilize SocketIOClientGenerator
  // connect to the ASR SERVICE based on the serviceHost and authToken of ApiKeyGenerator
  // this is called as a callback after the successful initialization of the ApiKeyGenerator
  initSocketIOClient({ serviceHost, authToken }) {
    this.socketIOClientGenerator.init({
      serviceHost,
      authToken,
    });
  }

  // initilize MicrophoneGenerator
  // it will ask for user's microphone, and when the user gives permission for the microphone usage, it will start sending the data that it records using the this.onDataCallback
  // this is called as a callback after the successful initialization of the SocketIOClientGenerator
  initMicrophone() {
    this.microphoneGenerator
      .init()
      .then(() => {})
      .catch((err) => {
        const errorMessage =
          "Could not initilize the microphone stream with error: " + err;
        console.error(errorMessage);
        throw errorMessage;
      });
  }

  // send data from MicrophoneGenerator through SocketIOClientGenerator to the ASR SERVICE
  // this is called each time the stream of the microphone records another frame / ArrayBuffer
  onDataCallback(data) {
    this.socketIOClientGenerator.emitData(data);
  }
}

export default VatisTechClient;
