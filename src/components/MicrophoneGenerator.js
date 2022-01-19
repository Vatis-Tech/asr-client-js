class MicrophoneGenerator {
  stream;
  onDataCallback;
  logger;
  constructor({ onDataCallback, logger }) {
    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "MicrophoneGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: This is the constructor of MicrophoneGenerator class. This class, when it will be initialized, will ask user's permission for microphone usage. If accepted, the data from the microphone will be sent to the LIVE ASR service, using the SocketIOClientGenerator instance.`,
    });

    this.onDataCallback = onDataCallback;
  }
  async init() {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initializing the "MicrophoneGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: The MicrophoneGenerator will request for the user's microphone.`,
    });

    await navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        this.stream = stream;

        const options = { mimeType: "audio/webm", bitsPerSecond: 256000 };

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

        this.logger({
          currentState: `@vatis-tech/asr-client-js: Initialized the "MicrophoneGenerator" plugin.`,
          description: `@vatis-tech/asr-client-js: The MicrophoneGenerator was successful into getting user's microphone, and will start sending data each 1 second.`,
        });
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
