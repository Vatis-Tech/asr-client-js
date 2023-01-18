class MicrophoneQueue {
  queue;
  logger;
  config;
  constructor({ logger, config }) {
    this.logger = logger;
    this.config = config;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting and initializing the "MicrophoneQueue" plugin.`,
      description: `@vatis-tech/asr-client-js: The data from user's microphone is stored here. When the SocketIOClientGenerator gets a response for the previous sent data, it takes from here the next data that was recored by the MicrophoneGenerator and sends it to the LIVE ASR service.`,
    });

    if (config) {
      this.queue = [
        {
          type: SOCKET_IO_CLIENT_MESSAGE_TYPE_CONFIG,
          ...config
        }
      ];
    } else {
      this.queue = [];
    }
  }
  dequeue() {
    return this.queue.shift(0, 1);
  }
  enqueue(element) {
    return this.queue.push(element);
  }
  peek() {
    return this.queue.at(0);
  }
  isEmpty() {
    return this.queue.length > 0 ? false : true;
  }
}

export default MicrophoneQueue;
