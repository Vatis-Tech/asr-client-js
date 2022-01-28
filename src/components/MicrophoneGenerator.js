class MicrophoneGenerator {
  stream;
  onDataCallback;
  logger;
  blobState;
  mediaRecorder;
  constructor({ onDataCallback, logger }) {
    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "MicrophoneGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: This is the constructor of MicrophoneGenerator class. This class, when it will be initialized, will ask user's permission for microphone usage. If accepted, the data from the microphone will be sent to the LIVE ASR service, using the SocketIOClientGenerator instance.`,
    });

    this.onDataCallback = onDataCallback;
  }

  // on destroy we want to stop the MediaRecorder from recording
  destroy() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  }

  // lets the user pause recording
  pause() {
    this.mediaRecorder.pause();
  }

  // lets the user resume recording
  resume() {
    this.mediaRecorder.resume();
  }

  async init() {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initializing the "MicrophoneGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: The MicrophoneGenerator will request for the user's microphone.`,
    });

    await navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        console.log(stream);
        this.stream = stream;

        const options = {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
          audioBitrateMode: "constant",
        };

        this.mediaRecorder = new MediaRecorder(stream, options);

        this.mediaRecorder.addEventListener(
          "dataavailable",
          function (e) {
            if (e.data.size > 0) {
              if (this.blobState) {
                this.blobState = new Blob([this.blobState, e.data]);
              } else {
                this.blobState = e.data;
              }
              if (this.blobState.size > 16000) {
                this.blobState.arrayBuffer().then((buffer) => {
                  for (
                    var i = 0;
                    i < Math.trunc(this.blobState.size / 16000);
                    i++
                  ) {
                    let data16000 = buffer.slice(i * 16000, 16000 + i * 16000);
                    this.onDataCallback(new Int32Array(data16000));
                  }
                  this.blobState = this.blobState.slice(
                    i * 16000,
                    this.blobState.size
                  );
                });
              }
            }
          }.bind(this)
        );

        this.mediaRecorder.start(1000);

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
