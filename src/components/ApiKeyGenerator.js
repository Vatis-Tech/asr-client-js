class ApiKeyGenerator {
  apiUrl;
  responseCallback;
  apiKey;
  serviceHost;
  authToken;
  xmlHttp;
  constructor({ apiUrl, responseCallback, apiKey }) {
    this.apiUrl = apiUrl;
    this.responseCallback = responseCallback;
    this.apiKey = apiKey;
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.onload = this.onLoad.bind(this);
    this.xmlHttp.onerror = this.onError;
    this.xmlHttp.open("GET", apiUrl);
    this.xmlHttp.setRequestHeader("Authorization", "Bearer " + apiKey);
    this.xmlHttp.send();
  }
  onError(e) {
    const errorMessage = `Could not initilize the API KEY.`;
    console.error(errorMessage);
    throw errorMessage;
  }
  onLoad() {
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
