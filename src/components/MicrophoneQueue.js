class MicrophoneQueue {
  queue;
  logger;
  constructor({ logger }) {
    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting and initializing the "MicrophoneQueue" plugin.`,
      description: `@vatis-tech/asr-client-js: The data from user's microphone is stored here. When the SocketIOClientGenerator gets a response for the previous sent data, it takes from here the next data that was recored by the MicrophoneGenerator and sends it to the LIVE ASR service.`,
    });

    this.queue = [];
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
}

export default MicrophoneQueue;
