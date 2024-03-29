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
  errorHandler;
  useSameServiceHostOnWsConnection;
  constructor({ responseCallback, logger, errorHandler }) {
    this.errorHandler = errorHandler;

    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "InstanceReservation" plugin.`,
      description: `@vatis-tech/asr-client-js: This is the constructor of InstanceReservation class. This class, when it will be initialized, will call the ASR SERVICE to reserve a live asr instance.`,
    });
    this.responseCallback = responseCallback;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError.bind(this);
  }
  init({ serviceHost, authToken, useSameServiceHostOnWsConnection }) {
    this.serviceHost = serviceHost;
    this.authToken = authToken;
    this.useSameServiceHostOnWsConnection = useSameServiceHostOnWsConnection;

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
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Could not initilize the "InstanceReservation" plugin.`,
      description: `@vatis-tech/asr-client-js: ` + e,
    });
    this.errorHandler(e);
  }
  onLoad() {
    if (this.xmlHttp.status !== 200) {
      this.onError({
        status: this.xmlHttp.status,
      });
      return;
    }

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initialized the "InstanceReservation" plugin.`,
      description: `@vatis-tech/asr-client-js: A live asr instance has been reserved.`,
    });

    let streamHostType = "http://";

    if (this.serviceHost.startsWith("https")) {
      streamHostType = "https://";
    }

    const response = JSON.parse(this.xmlHttp.responseText);
    this.streamUrl = response.stream_url;
    this.reservationToken = response.token;
    this.streamHost = response.stream_host.startsWith("http") ? response.stream_host : `${streamHostType}${response.stream_host}`;
    this.responseCallback({
      streamHost: this.useSameServiceHostOnWsConnection ? this.serviceHost : this.streamHost,
      streamUrl: this.streamUrl,
      reservationToken: this.reservationToken,
      authToken: this.authToken,
    });
  }
}

export default InstanceReservation;
