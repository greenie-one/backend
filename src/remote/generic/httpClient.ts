export class HttpClient {
  async callApi(request: HttpRequest) {
    const url = new URL(request.url);
    if (request.method === 'GET') {
      for (const [key, value] of Object.entries(request.query)) {
        url.searchParams.append(key, value);
      }
    }

    return fetch(url, {
      method: request.method,
      body: request.method === 'POST' ? request.body : undefined,
    });
  }
}
