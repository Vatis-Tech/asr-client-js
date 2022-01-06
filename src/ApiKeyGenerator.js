class ApiKeyGenerator {
  apiUrl;
  responseCallback;
  apiKey;
  constructor({ apiUrl, responseCallback, apiKey }) {
    this.apiUrl = apiUrl;
    this.responseCallback = responseCallback;
    this.apiKey = apiKey;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", function () {
      const credentials = JSON.parse(this.responseText);
      responseCallback({
        serviceHost: credentials.service_host,
        authToken: credentials.auth_token,
      });
    });
    xmlHttp.open("GET", apiUrl);
    xmlHttp.setRequestHeader("Authorization", "Bearer " + apiKey);
    xmlHttp.send();
  }
}

export default ApiKeyGenerator;
