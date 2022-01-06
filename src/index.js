import MicrophoneGenerator from "./MicrophoneGenerator.js";
import ApiKeyGenerator from "./ApiKeyGenerator.js";

import constants from "./helpers/constants/index.js";
import functions from "./helpers/functions/index.js";

const { API_URL } = constants;

const { generateApiUrl } = functions;

class VatisTechClient {
  microphoneGenerator;
  apiKeyGenerator;
  constructor({ service, model, language, apiKey }) {
    this.microphoneGenerator = new MicrophoneGenerator({
      onDataCallBack: this.onDataCallBack,
    });
    this.apiKeyGenerator = new ApiKeyGenerator({
      apiUrl: generateApiUrl({ service, model, language, API_URL }),
      responseCallback: this.initMicrophone.bind(this),
      apiKey: apiKey,
    });
  }

  onDataCallBack(data) {}

  initMicrophone() {
    this.microphoneGenerator
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
}

export default VatisTechClient;
