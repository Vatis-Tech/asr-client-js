import ApiKeyGenerator from "./components/ApiKeyGenerator.js";
import InstanceReservation from "./components/InstanceReservation.js";
import SocketIOClientGenerator from "./components/SocketIOClientGenerator.js";
import MicrophoneGenerator from "./components/MicrophoneGenerator.js";
import MicrophoneQueue from "./components/MicrophoneQueue.js";

import constants from "./helpers/constants/index.js";
import functions from "./helpers/functions/index.js";

const {
  WAIT_AFTER_MESSAGES,
  SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
  SOCKET_IO_SERVER_MESSAGE_TYPE_CONFIG_APPLIED,
  SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME,
  MICROPHONE_TIMESLICE
} = constants;

const { generateApiUrl, checkIfFinalPacket, checkIfCommandPacket } = functions;

class VatisTechClient {
  blobCollectorChunks;
  microphoneGenerator;
  instanceReservation;
  apiKeyGenerator;
  socketIOClientGenerator;
  microphoneQueue;
  onData;
  onCommandData;
  waitingForFinalPacket;
  waitingAfterMessages;
  logger;
  log;
  shouldDestroy;
  onDestroyCallback;
  errorHandler;
  config;
  onConfig;
  onPartialData;
  onFinalData;
  EnableOnCommandFinalFrame;
  flushPacketWasSent;
  connectionConfig;
  microphoneTimeslice;
  microphoneDeviceId;
  constructor({
    service,
    model,
    language,
    apiKey,
    onData,
    onCommandData,
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
    config,
    onConfig,
    onPartialData,
    onFinalData,
    EnableOnCommandFinalFrame,
    connectionConfig,
    microphoneDeviceId
  }) {
    this.blobCollectorChunks = [];
    this.microphoneDeviceId = microphoneDeviceId;

    if (microphoneTimeslice) {
      this.microphoneTimeslice = microphoneTimeslice;
    } else {
      this.microphoneTimeslice = MICROPHONE_TIMESLICE;
    }

    this.flushPacketWasSent = false;

    if (EnableOnCommandFinalFrame === true) {
      this.EnableOnCommandFinalFrame = true;
    } else {
      this.EnableOnCommandFinalFrame = false;
    }

    if (config) {
      this.config = config;
    } else {
      this.config = undefined;
    }

    if (errorHandler) {
      this.errorHandler = errorHandler;
    } else {
      this.errorHandler = (e) => { };
    }

    this.log = log;

    if (this.log === true && typeof logger === "function") {
      this.logger = logger;
    } else if (this.log === true) {
      this.logger = console.log;
    } else {
      this.logger = () => { };
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
      this.onDestroyCallback = () => { };
    } else {
      this.onDestroyCallback = onDestroyCallback;
    }

    // callback for sending to the user the data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onData === undefined) {
      this.onData = () => { };
    } else {
      this.onData = onData;
    }

    // callback for sending to the user the partial data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onPartialData === undefined) {
      this.onPartialData = () => { };
    } else {
      this.onPartialData = onPartialData;
    }

    // callback for sending to the user the final data that comes as a result from ASR SERVICE through the SocketIOClientGenerator
    if (onFinalData === undefined) {
      this.onFinalData = () => { };
    } else {
      this.onFinalData = onFinalData;
    }

    // callback for sending to the user the data that comes as a result for a command from ASR SERVICE through the SocketIOClientGenerator
    // e.g. data.headers.SpokenCommand === 'NEW_PARAGRAPHS'
    if (onCommandData === undefined) {
      this.onCommandData = () => { };
    } else {
      this.onCommandData = onCommandData;
    }

    // callback for sending to the user the data that comes as a result for appling a config from ASR SERVICE through the SocketIOClientGenerator
    if (onConfig === undefined) {
      this.onConfig = () => { };
    } else {
      this.onConfig = onConfig;
    }

    // instantiante MicrophoneQueue - this will keep all the microphone buffers until they can be sent to the ASR SERVICE through the SocketIOClientGenerator
    this.microphoneQueue = new MicrophoneQueue({
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler
    });

    // instantiante ApiKeyGenerator - this will return on the responseCallback the serviceHost and the authToken for the InstanceReservation to reserve a live asr instance based on the apiUrl and apiKey
    this.apiKeyGenerator = new ApiKeyGenerator({
      apiUrl: generateApiUrl({ service, model, language, host }),
      responseCallback: this.initInstanceReservation.bind(this),
      apiKey: apiKey,
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
      connectionConfig: connectionConfig
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
      config: this.config,
      frameLength,
      frameOverlap,
      bufferOffset,
      EnableOnCommandFinalFrame,
    });

    // instantiante MicrophoneGenerator - this will return on the this.onMicrophoneGeneratorDataCallback the data that it captures from the user's microphone
    this.microphoneGenerator = new MicrophoneGenerator({
      onDataCallback: this.onMicrophoneGeneratorDataCallback.bind(this),
      onBlobDataCallback: this.onBlobDataCallback.bind(this),
      logger: this.logger.bind(this),
      errorHandler: this.errorHandler,
      microphoneTimeslice,
      microphoneDeviceId
    });

    // initilize ApiKeyGenerator (if successful it will initilize SocketIOClientGenerator (if successful it will initilize the MicrophoneGenerator))
    this.initApiKey();
  }

  // this will make everything undefined on the this instance - i.e. this instance will not be of any use anymore
  destroy({ hard } = { hard: false }) {
    // stop the microphone - i.e. stop data being recorded by the MediaRecorder
    this.microphoneGenerator.destroy();
    if (hard) {
      // notify destruction
      this.onDestroyCallback();

      // destroy the socket
      this.socketIOClientGenerator.destroy();

      // delete data members
      this.microphoneGenerator = undefined;
      this.apiKeyGenerator = undefined;
      this.instanceReservation = undefined;
      this.socketIOClientGenerator = undefined;
      this.microphoneQueue = undefined;
      this.onData = undefined;
      this.onCommandData = undefined;
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
    } else {
      // let the messaging know that we want the client to be destroyed
      this.shouldDestroy = true;

      setTimeout(function () {
        this.socketIOClientGenerator.emitData({
          type: SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
          data: "",
          flush: "True",
          close: "True",
        });
        this.flushPacketWasSent = true;
        if (this.waitingForFinalPacket < 0) {
          this.waitingForFinalPacket = 1;
        } else {
          this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
        }
      }.bind(this), this.microphoneTimeslice + 100);
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
  initInstanceReservation({ serviceHost, authToken, useSameServiceHostOnWsConnection }) {
    this.instanceReservation.init({ serviceHost, authToken, useSameServiceHostOnWsConnection });
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
      .then(() => { })
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
      if (this.microphoneQueue.peek().type === SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA) {
        this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
      }
      this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
    }
  }

  // get data from SocketIOClientGenerator from the SOCKET_IO_CLIENT_RESULT_PATH and send it to user's callback function
  // if the data was final, and the MicrophoneQueue was not empty, send a new data to the ASR SERVICE through the SocketIOClientGenerator
  // if the data was final, and the MicrophoneQueue was empty, let the MicrophoneGenerator know that, when it gets new data, it can send it to the ASR SERVICE through the SocketIOClientGenerator
  onSocketIOClientGeneratorOnAsrResultCallback(data) {

    const parsedData = JSON.parse(data);


    if (parsedData.type === SOCKET_IO_SERVER_MESSAGE_TYPE_CONFIG_APPLIED) {
      this.onConfig(parsedData);
      return;
    }

    this.onData(parsedData);

    if (checkIfCommandPacket(parsedData)) {
      this.onCommandData({
        spokenCommand: parsedData.headers.SpokenCommand,
        ...parsedData
      });
    }

    if (
      parsedData.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME) &&
      parsedData.headers[SOCKET_IO_CLIENT_RESPONSE_FINAL_FRAME]
    ) {
      if (parsedData.words && parsedData.words.length) {
        this.onFinalData(parsedData);
      }
    }
    else {
      this.onPartialData(parsedData);
    }

    if (checkIfFinalPacket(parsedData)) {
      this.waitingForFinalPacket = this.waitingForFinalPacket - 1;
      if (
        this.microphoneQueue.peek() &&
        this.waitingForFinalPacket < this.waitingAfterMessages
      ) {
        if (this.microphoneQueue.peek().type === SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA) {
          this.waitingForFinalPacket = this.waitingForFinalPacket + 1;
        }
        this.socketIOClientGenerator.emitData(this.microphoneQueue.dequeue());
      }
    }

    // check if the user tried to destroy the VTC client
    if (
      this.waitingForFinalPacket === 0 &&
      this.microphoneQueue.isEmpty &&
      this.shouldDestroy &&
      this.flushPacketWasSent
    ) {
      this.destroy({ hard: true });
    }
  }

  // this function collects all blob recorded from user's microphone so you can download the recording
  onBlobDataCallback(blobData) {
    this.blobCollectorChunks.push(blobData);
  }

  // this function actually downloads the recording
  onDownloadRecording() {
    try {
      const audioBlob = new Blob(this.blobCollectorChunks, {
        "type": "audio/webm"
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.href = audioUrl;
      anchor.download = "audio.webm"
      anchor.click();
      window.URL.revokeObjectURL(audioUrl);
      anchor?.remove();
    } catch (error) {
      console.error(error);
    }
  }

  // this function returns for the user the recording as blob chunks
  getRecordingAsBlobChunks() {
    return this.blobCollectorChunks;
  }
}

export default VatisTechClient;
