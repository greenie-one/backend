import querystring from 'node:querystring';

export class HttpClient {
  static async callApi<T = unknown>(request: HttpRequest): Promise<T> {
    const url = new URL(request.url);
    if (request.method === 'GET' && request.query) {
      for (const [key, value] of Object.entries(request.query)) {
        url.searchParams.append(key, value);
      }
    }

    let body: string | undefined = undefined;
    if (request.method === 'POST' && request.body) {
      if (request.headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
        body = querystring.encode(request.body);
      } else {
        body = JSON.stringify(request.body);
      }
    }

    console.info(`Sending HTTP request [${request.method}]:`, request);

    const resp = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers ?? {}),
      },
      body,
    });

    let response: T;
    if (request.toJSON !== false) {
      response = (await resp.json()) as T;
    } else {
      response = (await resp.text()) as T;
    }

    console.info('Got response', response);

    return response;
  }
}
