const querystring = require('querystring');
const URL = require('url');
const https = require('https');

function request(
  url,
  {
    responseType = 'json',
    method = 'GET',
    query: params,
    headers = {},
    data
  } = {}
) {
  const strigifiedParams = querystring.stringify(params);
  return new Promise((resolve, reject) => {
    // expect we are using node 8.10.x
    const { path, hostname, port, query } = URL.parse(url);
    const requestInst = https
      .request(
        {
          hostname,
          port,
          path,
          method,
          headers,
          query: [query, strigifiedParams].filter(val => val).join('&')
        },
        res => {
          let rawResponse = Buffer.from([]);
          res
            .on('data', newData => {
              rawResponse = Buffer.concat([rawResponse, newData]);
            })
            .on('error', reject)
            .on('end', () => {
              switch (responseType) {
                case 'json':
                  try {
                    const response = JSON.parse(rawResponse.toString());
                    resolve(response);
                  } catch (e) {
                    reject(e);
                  }
                  break;
                case 'text':
                  resolve(rawResponse.toString());
                  break;
                default:
                  resolve(rawResponse);
              }
            });
        }
      )
      .on('error', reject);
    if (data) {
      requestInst.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    requestInst.end();
  });
}

const httpClient = {
  get(url, { headers, query } = {}) {
    return request(url, { headers, query });
  },
  post(url, { headers, query, body: data } = {}) {
    return request(url, {
      method: 'POST',
      headers,
      query,
      data
    });
  },
  put(url, { headers, query, body: data } = {}) {
    return request(url, {
      method: 'PUT',
      headers,
      query,
      data
    });
  },
  patch(url, { headers, query, body: data } = {}) {
    return request(url, {
      method: 'PATCH',
      headers,
      query,
      data
    });
  },
  delete(url, { headers, query } = {}) {
    return request(url, { method: 'DELETE', headers, query });
  }
};

module.exports.httpClient = httpClient;
