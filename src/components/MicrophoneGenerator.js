class MicrophoneGenerator {
  stream;
  onDataCallback;
  constructor({ onDataCallback }) {
    this.onDataCallback = onDataCallback;
  }
  async init() {
    await navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        this.stream = stream;
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(16384, 1, 1);

        source.connect(processor);
        processor.connect(context.destination);

        processor.onaudioprocess = function (e) {
          this.onDataCallback(e.inputBuffer);
        }.bind(this);
      })
      .catch((err) => {
        const errorMessage =
          "Could not initilize the microphone stream with error: " + err;
        console.error(errorMessage);
        throw errorMessage;
      });
  }
  getStream() {
    return this.stream;
  }
}

export default MicrophoneGenerator;
