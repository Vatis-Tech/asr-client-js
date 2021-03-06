import ApiKeyGenerator from "./components/ApiKeyGenerator.js";
import InstanceReservation from "./components/InstanceReservation.js";
import SocketIOClientGenerator from "./components/SocketIOClientGenerator.js";
import MicrophoneGenerator from "./components/MicrophoneGenerator.js";
import MicrophoneQueue from "./components/MicrophoneQueue.js";

import constants from "./helpers/constants/index.js";
import functions from "./helpers/functions/index.js";

const { WAIT_AFTER_MESSAGES } = constants;

const { generateApiUrl, checkIfFinalPacket } = functions;

class VatisTechClient {
  microphoneGenerator;
  instanceReservation;
  apiKeyGenerator;
  socketIOClientGenerator;
  microphoneQueue;
  onData;
  waitingForFinalPacket;
  waitingAfterMessages;
  logger;
  log;
  shouldDestroy;
  onDestroyCallback;
  errorHandler;
  constructor({
    service,
    model,
    language,
    apiKey,
    onData,
    log,
    logger,
    onDestroyCallback,
    host,
    microphoneTimeslice,
    frameLength,
    frameOverlap,
    bufferOffset,
    errorHandler,
    waitingAfterMessages,
  }) {
    if (errorHandler) {
      this.errorHandler = errorHandler;
    } else {
      this.errorHandler = (e) => {};
    }

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

    if (waitingAfterMessages && waitingAfterMessages > 0) {
      this.waitingAfterMessages = waitingAfterMessages;
    } else {
      this.waitingAfterMessages = WAIT_AFTER_MESSAGES;
    }

    // this is a flag that says if the whole response for the previous packet was received or not
    this.waitingForFinalPacket = 0;

    // this is a flag that says if the user wants to destroy the VTC client
    // but since there might be data to be received by the socket, or to be sent by the socket
    // the VTC client will wait for that to finis
    this.shouldDestroy = false;

    // callback when successfully destroyed
    if (onDestroyCallback === undefined) {
      this.onDestroyCallback = () => {};
    } else {
      this.onDestroyCallback = onDestroyCallback;
    }

    // callback for sending to the user the data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onData === undefined) {
      this.onData = () => {};
    } else {
      this.onData = onData;
    }

    // instantiante MicrophoneQueue - this will keep all the microphone buffers until they can be sent to the ASR SERVICE through the SocketIOClientGenerator
    this.microphoneQueue = new MicrophoneQueue({
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
    });

    // instantiante ApiKeyGenerator - this will return on the responseCallback the serviceHost and the authToken for the InstanceReservation to reserve a live asr instance based on the apiUrl and apiKey
    this.apiKeyGenerator = new ApiKeyGenerator({
      apiUrl: generateApiUrl({ service, model, language, host }),
      responseCallback: this.initInstanceReservation.bind(this),
      apiKey: apiKey,
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
    });

    // instantiante InstanceReservation - this will return on the responseCallback the streamUrl, reservationToken, and podName for the SocketIOClientGenerator to connect based on the serviceHost and authToken
    this.instanceReservation = new InstanceReservation({
      responseCallback: this.initSocketIOClient.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
    });

    // instantiante SocketIOClientGenerator - this will return on the onAsrResultCallback the results that it gets back from the ASR SERVICE and when it connects to the ASR SERVICE it will initilize the MicrophoneGenerator through the onConnectCallback
    this.socketIOClientGenerator = new SocketIOClientGenerator({
      onConnectCallback: this.initMicrophone.bind(this),
      onAsrResultCallback:
        this.onSocketIOClientGeneratorOnAsrResultCallback.bind(this),
      logger: this.logger.bind(this),
      destroyVTC: this.destroy.bind(this),
      errorHandler: this.errorHandler,
      frameLength,
      frameOverlap,
      bufferOffset,
    });

    // instantiante MicrophoneGenerator - this will return on the this.onMicrophoneGeneratorDataCallback the data that it captures from the user's microphone
    this.microphoneGenerator = new MicrophoneGenerator({
      onDataCallback: this.onMicrophoneGeneratorDataCallback.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
      microphoneTimeslice,
    });

    // initilize ApiKeyGenerator (if successful it will initilize SocketIOClientGenerator (if successful it will initilize the MicrophoneGenerator))
    this.initApiKey();
  }

  // this will make everything undefined on the this instance - i.e. this instance will not be of any use anymore
  destroy({ hard } = { hard: false }) {
    // check if there is still data to be received or to be sent
    if (
      (this.waitingForFinalPacket > 0 || !this.microphoneQueue.isEmpty) &&
      hard !== true
    ) {
      // let the messaging know that we want the client to be destroyed
      this.shouldDestroy = true;
      // pause the microphone so it won't record anymore
      this.microphoneGenerator.pause();
    } else {
      // notify destruction
      this.onDestroyCallback();

      // stop the microphone - i.e. stop data being recorded by the MediaRecorder
      this.microphoneGenerator.destroy();

      // destroy the socket
      this.socketIOClientGenerator.destroy();

      // delete data members
      this.microphoneGenerator = undefined;
      this.apiKeyGenerator = undefined;
      this.instanceReservation = undefined;
      this.socketIOClientGenerator = undefined;
      this.microphoneQueue = undefined;
      this.onData = undefined;
      this.waitingForFinalPacket = undefined;
      this.logger = undefined;
      this.log = undefined;
      this.shouldDestroy = undefined;

      // delete methods
      this.initApiKey = false;
      this.initSocketIOClient = false;
      this.initMicrophone = false;
      this.onMicrophoneGeneratorDataCallback = false;
      this.onSocketIOClientGeneratorOnAsrResultCallback = false;
      this.onDestroyCallback = false;
    }
  }

  // lets the user pause recording
  pause() {
    this.microphoneGenerator.pause();
  }

  // lets the user resume recording
  resume() {
    this.microphoneGenerator.resume();
  }

  // initilize ApiKeyGenerator
  // this is called after the instantiantion of all Generators
  initApiKey() {
    this.apiKeyGenerator.init();
  }

  // initilize InstanceReservation
  // get a reserved link for socket.io-client
  initInstanceReservation({ serviceHost, authToken }) {
    this.instanceReservation.init({ serviceHost, authToken });
  }

  // initilize SocketIOClientGenerator
  // connect to the ASR SERVICE based on the serviceHost and authToken of ApiKeyGenerator
  // this is called as a callback after the successful initialization of the ApiKeyGenerator
  initSocketIOClient({ streamHost, streamUrl, reservationToken, authToken }) {
    this.socketIOClientGenerator.init({
      streamHost,
      streamUrl,
      reservationToken,
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
        this.logger({
          currentState: `@vatis-tech/asr-client-js: Could not initilize the "MicrophoneGenerator" plugin.`,
          description: `@vatis-tech/asr-client-js: ` + err,
        });
        this.errorHandler(err);
      });
  }

  // get data from MicrophoneGenerator and add it to the queue
  // if the SocketIOClientGenerator is not waiting for a packet response then it should emit a new pachet with the data that is waiting in the queue
  onMicrophoneGeneratorDataCallback(data) {
    if (this.microphoneQueue === undefined) return;

    this.microphoneQueue.enqueue(data);

    if (
      this.waitingForFinalPacket < this.waitingAfterMessages &&
      this.microphoneQueue.peek()
    ) {
      this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
      this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
    }
  }

  // get data from SocketIOClientGenerator from the SOCKET_IO_CLIENT_RESULT_PATH and send it to user's callback function
  // if the data was final, and the MicrophoneQueue was not empty, send a new data to the ASR SERVICE through the SocketIOClientGenerator
  // if the data was final, and the MicrophoneQueue was empty, let the MicrophoneGenerator know that, when it gets new data, it can send it to the ASR SERVICE through the SocketIOClientGenerator
  onSocketIOClientGeneratorOnAsrResultCallback(data) {
    this.onData(JSON.parse(data));

    if (checkIfFinalPacket(JSON.parse(data))) {
      this.waitingForFinalPacket = this.waitingForFinalPacket - 1;
      if (
        this.microphoneQueue.peek() &&
        this.waitingForFinalPacket < this.waitingAfterMessages
      ) {
        this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
        this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
      }
    }

    // check if the user tried to destroy the VTC client
    if (
      this.waitingForFinalPacket === 0 &&
      this.microphoneQueue.isEmpty &&
      this.shouldDestroy
    ) {
      this.destroy();
    }
  }
}

export default VatisTechClient;
