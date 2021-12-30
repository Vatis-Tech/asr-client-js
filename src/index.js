import MicrophoneGenerator from "./MicrophoneGenerator.js";

class VatisTechClient {
  microphone;
  constructor() {
    this.microphone = new MicrophoneGenerator({
      onDataCallBack: this.onDataCallBack,
    });
    this.microphone
      .init()
      .then(() => {
        // console.log(this);
      })
      .catch((err) => {
        const errorMessage =
          "Could not initilize the microphone stream with error: " + err;
        console.error(errorMessage);
        throw errorMessage;
      });
  }
  onDataCallBack(data) {}
}

export default VatisTechClient;
