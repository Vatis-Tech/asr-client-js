import constants from "../helpers/constants/index.js";
import functions from "../helpers/functions/index.js";

const { MICROPHONE_BIT_RATE_SAMPLES, MICROPHONE_TIMESLICE, SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA } = constants;
const { base64ArrayBuffer } = functions;

class MicrophoneGenerator {
  stream;
  onDataCallback;
  logger;
  blobState;
  mediaRecorder;
  microphoneTimeslice;
  errorHandler;
  constructor({ onDataCallback, logger, microphoneTimeslice, errorHandler }) {
    this.errorHandler = errorHandler;

    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "MicrophoneGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: This is the constructor of MicrophoneGenerator class. This class, when it will be initialized, will ask user's permission for microphone usage. If accepted, the data from the microphone will be sent to the LIVE ASR service, using the SocketIOClientGenerator instance.`,
    });

    this.onDataCallback = onDataCallback;

    if (microphoneTimeslice) {
      this.microphoneTimeslice = microphoneTimeslice;
    } else {
      this.microphoneTimeslice = MICROPHONE_TIMESLICE;
    }
  }

  // on destroy we want to stop the MediaRecorder from recording
  destroy() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
      this.onDataCallback({
        type: SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
        data: "",
        flush: "True",
        close: "True",
      });
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
            // Converting audio blob to base64
            let reader = new FileReader();
            reader.onloadend = () => {
              // You can upload the base64 to server here.
              this.onDataCallback({
                type: SOCKET_IO_CLIENT_MESSAGE_TYPE_DATA,
                data: reader.result
                  .replace("data:audio/webm;codecs=opus;base64,", "")
                  .replace("data:audio/webm; codecs=opus;base64,", "")
                  .replace("data:audio/webm; codecs=opus; base64,", ""),
              });
            };

            reader.readAsDataURL(e.data);
            // if (e.data.size > 0) {
            //   if (this.blobState) {
            //     this.blobState = new Blob([this.blobState, e.data]);
            //   } else {
            //     this.blobState = e.data;
            //   }
            //   if (this.blobState.size > MICROPHONE_BIT_RATE_SAMPLES) {
            //     this.blobState.arrayBuffer().then((buffer) => {
            //       for (
            //         var i = 0;
            //         i <
            //         Math.trunc(
            //           this.blobState.size / MICROPHONE_BIT_RATE_SAMPLES
            //         );
            //         i++
            //       ) {
            //         let dataSamples = buffer.slice(
            //           i * MICROPHONE_BIT_RATE_SAMPLES,
            //           MICROPHONE_BIT_RATE_SAMPLES +
            //             i * MICROPHONE_BIT_RATE_SAMPLES
            //         );
            //         // this.onDataCallback(new Int32Array(dataSamples));
            //         this.onDataCallback(base64ArrayBuffer(dataSamples));
            //       }
            //       this.blobState = this.blobState.slice(
            //         i * MICROPHONE_BIT_RATE_SAMPLES,
            //         this.blobState.size
            //       );
            //     });
            //   }
            // }
          }.bind(this)
        );

        this.mediaRecorder.start(this.microphoneTimeslice);

        this.logger({
          currentState: `@vatis-tech/asr-client-js: Initialized the "MicrophoneGenerator" plugin.`,
          description: `@vatis-tech/asr-client-js: The MicrophoneGenerator was successful into getting user's microphone, and will start sending data each ${this.microphoneTimeslice} miliseconds.`,
        });
      })
      .catch((err) => {
        this.logger({
          currentState: `@vatis-tech/asr-client-js: Could not initilize the "MicrophoneGenerator" plugin.`,
          description: `@vatis-tech/asr-client-js: ` + err,
        });
        this.errorHandler(err);
      });
  }

  getStream() {
    return this.stream;
  }
}

export default MicrophoneGenerator;
