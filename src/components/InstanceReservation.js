import functions from "../helpers/functions/index.js";

const { generateReservationUrl } = functions;

class InstanceReservation {
  serviceHost;
  responseCallback;
  authToken;
  streamUrl;
  reservationToken;
  xmlHttp;
  logger;
  constructor({ responseCallback, logger }) {
    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "InstanceReservation" plugin.`,
      description: `@vatis-tech/asr-client-js: This is the constructor of InstanceReservation class. This class, when it will be initialized, will call the ASR SERVICE to reserve a live asr instance.`,
    });
    this.responseCallback = responseCallback;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError;
  }
  init({ serviceHost, authToken }) {
    this.serviceHost = serviceHost;
    this.authToken = authToken;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initializing the "InstanceReservation" plugin.`,
      description: `@vatis-tech/asr-client-js: Here it is where the XMLHttpRequest happens to reserve a live asr instance.`,
    });

    this.xmlHttp.open(
      "GET",
      generateReservationUrl({ serviceHost: this.serviceHost })
    );
    this.xmlHttp.setRequestHeader("Authorization", this.authToken);
    this.xmlHttp.send();
  }
  onError(e) {
    const errorMessage = `Could not reserve a live asr instance.`;
    console.error(errorMessage);
    throw errorMessage;
  }
  onLoad() {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initialized the "InstanceReservation" plugin.`,
      description: `@vatis-tech/asr-client-js: A live asr instance has been reserved.`,
    });

    const response = JSON.parse(this.xmlHttp.responseText);
    this.streamUrl = credentials.stream_url;
    this.reservationToken = credentials.token;
    this.podName = credentials.pod_name;
    this.responseCallback({
      serviceHost: this.serviceHost,
      authToken: this.authToken,
      streamUrl: this.streamUrl,
      reservationToken: this.reservationToken,
      podName: this.podName,
    });
  }
}

export default InstanceReservation;
