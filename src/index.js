import ApiKeyGenerator from "./components/ApiKeyGenerator.js";
import SocketIOClientGenerator from "./components/SocketIOClientGenerator.js";
import MicrophoneGenerator from "./components/MicrophoneGenerator.js";
import MicrophoneQueue from "./components/MicrophoneQueue.js";

// import constants from "../helpers/constants/index.js";
import functions from "./helpers/functions/index.js";

// const {
//
// } = constants;

const { generateApiUrl, checkIfFinalPacket } = functions;

class VatisTechClient {
  microphoneGenerator;
  apiKeyGenerator;
  socketIOClientGenerator;
  microphoneQueue;
  onData;
  waitingForFinalPacket;
  logger;
  log;
  constructor({ service, model, language, apiKey, onData, log, logger }) {
    this.log = log;

    if (this.log === true && typeof logger === "function") {
      this.logger = logger;
    } else if (this.log === true) {
      this.logger = console.log;
    } else {
      this.logger = () => {};
    }

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initilizing plugin.`,
      description: `@vatis-tech/asr-client-js: This is the base constructor which initilizez everything for the LIVE ASR service of Vatis Tech.`,
    });

    // this is a flag that says if the whole response for the previous packet was received or not
    this.waitingForFinalPacket = false;

    // callback for sending to the user the data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    this.onData = onData;

    // instantiante MicrophoneQueue - this will keep all the microphone buffers until they can be sent to the ASR SERVICE through the SocketIOClientGenerator
    this.microphoneQueue = new MicrophoneQueue({
      logger: this.logger.bind(this),
    });

    // instantiante ApiKeyGenerator - this will return on the responseCallback the serviceHost and the authToken for the SocketIOClientGenerator to connect based on the apiUrl and apiKey
    this.apiKeyGenerator = new ApiKeyGenerator({
      apiUrl: generateApiUrl({ service, model, language }),
      responseCallback: this.initSocketIOClient.bind(this),
      apiKey: apiKey,
      logger: this.logger.bind(this),
    });

    // instantiante SocketIOClientGenerator - this will return on the onAsrResultCallback the results that it gets back from the ASR SERVICE and when it connects to the ASR SERVICE it will initilize the MicrophoneGenerator through the onConnectCallback
    this.socketIOClientGenerator = new SocketIOClientGenerator({
      onConnectCallback: this.initMicrophone.bind(this),
      onAsrResultCallback:
        this.onSocketIOClientGeneratorOnAsrResultCallback.bind(this),
      logger: this.logger.bind(this),
    });

    // instantiante MicrophoneGenerator - this will return on the this.onMicrophoneGeneratorDataCallback the data that it captures from the user's microphone
    this.microphoneGenerator = new MicrophoneGenerator({
      onDataCallback: this.onMicrophoneGeneratorDataCallback.bind(this),
      logger: this.logger.bind(this),
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
  // it will ask for user's microphone, and when the user gives permission for the microphone usage, it will start sending the data that it records using the this.onMicrophoneGeneratorDataCallback
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

  // get data from MicrophoneGenerator and add it to the queue
  // if the SocketIOClientGenerator is not waiting for a packet response then it should emit a new pachet with the data that is waiting in the queue
  onMicrophoneGeneratorDataCallback(data) {
    this.microphoneQueue.enqueue(data);

    if (this.waitingForFinalPacket === false && this.microphoneQueue.peek()) {
      this.waitingForFinalPacket = true;
      this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
    }
  }

  // get data from SocketIOClientGenerator from the SOCKET_IO_CLIENT_RESULT_PATH and send it to user's callback function
  // if the data was final, and the MicrophoneQueue was not empty, send a new data to the ASR SERVICE through the SocketIOClientGenerator
  // if the data was final, and the MicrophoneQueue was empty, let the MicrophoneGenerator know that, when it gets new data, it can send it to the ASR SERVICE through the SocketIOClientGenerator
  onSocketIOClientGeneratorOnAsrResultCallback(data) {
    this.onData(data);

    if (checkIfFinalPacket(data)) {
      if (this.microphoneQueue.peek()) {
        this.waitingForFinalPacket = true;
        this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
      } else {
        this.waitingForFinalPacket = false;
      }
    }
  }
}

export default VatisTechClient;
