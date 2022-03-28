import constants from "../constants/index.js";

const { API_URL, API_URL_PATH } = constants;

function generateApiUrl({ service, model, language, host }) {
  let apiUrl = (host ? host : API_URL) + API_URL_PATH;

  if (service) {
    apiUrl = apiUrl.replace("<service>", service);
  } else {
    apiUrl = apiUrl.replace("?service=<service>", "?");
  }

  if (model) {
    apiUrl = apiUrl.replace("<model>", model);
  } else {
    apiUrl = apiUrl.replace("&model=<model>", "");
  }

  if (language) {
    apiUrl = apiUrl.replace("<language>", language);
  } else {
    apiUrl = apiUrl.replace("&language=<language>", "");
  }

  if (apiUrl.includes("?&")) {
    apiUrl = apiUrl.replace("?&", "?");
  }

  if (apiUrl.endsWith("?")) {
    apiUrl = apiUrl.replace("?", "");
  }

  return apiUrl;
}

export default generateApiUrl;
