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

        const options = { mimeType: "audio/mpeg-3", bitsPerSecond: 256000 };

        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener(
          "dataavailable",
          function (e) {
            if (e.data.size > 0) {
              this.onDataCallback(e.data);
            }
          }.bind(this)
        );

        mediaRecorder.start(1000);
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
