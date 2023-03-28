class ApiKeyGenerator {
  apiUrl;
  responseCallback;
  apiKey;
  serviceHost;
  authToken;
  xmlHttp;
  logger;
  errorHandler;
  connectionConfig;
  constructor({ apiUrl, responseCallback, apiKey, logger, errorHandler, connectionConfig }) {
    this.errorHandler = errorHandler;

    this.logger = logger;

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Instantianting the "ApiKeyGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: This is the constructor of ApiKeyGenerator class. This class, when it will be initialized, will get from the Vatis Tech API, a key for the LIVE ASR service.`,
    });

    this.apiUrl = apiUrl;
    this.responseCallback = responseCallback;
    this.apiKey = apiKey;
    this.connectionConfig = connectionConfig;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError.bind(this);
  }
  init() {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initializing the "ApiKeyGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: Here it is where the XMLHttpRequest happens to get a valid key for the LIVE ASR  service.`,
    });

    if (
        this.connectionConfig && 
        this.connectionConfig.service_host !== undefined && 
        this.connectionConfig.auth_token !== undefined && 
        typeof this.connectionConfig.service_host === "string" && 
        typeof this.connectionConfig.auth_token === "string"
    ) {
      this.logger({
        currentState: `@vatis-tech/asr-client-js: Initialized the "ApiKeyGenerator" plugin.`,
        description: `@vatis-tech/asr-client-js: A valid key was received from the Vatis Tech API, in order to use the LIVE ASR service.`,
      });

      const bearer = "Bearer ";
      
      this.responseCallback({
        serviceHost: this.connectionConfig.service_host,
        authToken: `${this.connectionConfig.auth_token.startsWith(bearer) ? "" : bearer}${this.connectionConfig.auth_token}`,
      });
    } else {
      this.xmlHttp.open("GET", this.apiUrl);
      this.xmlHttp.setRequestHeader("Authorization", "Bearer " + this.apiKey);
      this.xmlHttp.send();
    }
  }
  onError(e) {
    this.logger({
      currentState: `@vatis-tech/asr-client-js: Could not initilize the "ApiKeyGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: ` + e,
    });
    this.errorHandler(e);
  }
  onLoad() {
    if (this.xmlHttp.status !== 200) {
      this.onError(JSON.parse(this.xmlHttp.responseText));
      return;
    }

    this.logger({
      currentState: `@vatis-tech/asr-client-js: Initialized the "ApiKeyGenerator" plugin.`,
      description: `@vatis-tech/asr-client-js: A valid key was received from the Vatis Tech API, in order to use the LIVE ASR service.`,
    });

    const credentials = JSON.parse(this.xmlHttp.responseText);
    this.serviceHost = credentials.service_host;
    this.authToken = credentials.auth_token;
    this.responseCallback({
      serviceHost: credentials.service_host,
      authToken: credentials.auth_token,
    });
  }
}

export default ApiKeyGenerator;
