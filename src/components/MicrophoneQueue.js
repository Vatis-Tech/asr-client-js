class MicrophoneQueue {
  queue;
  constructor() {
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
