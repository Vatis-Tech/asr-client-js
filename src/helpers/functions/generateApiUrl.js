function generateApiUrl({ service, model, language, API_URL }) {
  let apiUrl = API_URL;

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
