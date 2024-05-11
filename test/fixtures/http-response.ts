export const httpResponse = {
  url: 'http://example.com',
  type: 'default',
  status: 200,
  statusText: 'OK',
  headers: {
    'content-encoding': 'gzip',
    'accept-ranges': 'bytes',
    'age': '343443',
    'cache-control': 'max-age=604800',
    'content-type': 'text/html; charset=UTF-8',
    'date': 'Sat, 11 May 2024 18:16:41 GMT',
    'etag': '"3147526947+gzip"',
    'expires': 'Sat, 18 May 2024 18:16:41 GMT',
    'last-modified': 'Thu, 17 Oct 2019 07:18:26 GMT',
    'server': 'ECAcc (chd/0760)',
    'vary': 'Accept-Encoding',
    'x-cache': 'HIT',
    'content-length': '648'
  },
  body: `<!doctype html>
  <html>
  <head>
      <title>Example Domain</title>
  
      <meta charset="utf-8" />
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">
      body {
          background-color: #f0f0f2;
          margin: 0;
          padding: 0;
          font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
          
      }
      div {
          width: 600px;
          margin: 5em auto;
          padding: 2em;
          background-color: #fdfdff;
          border-radius: 0.5em;
          box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);
      }
      a:link, a:visited {
          color: #38488f;
          text-decoration: none;
      }
      @media (max-width: 700px) {
          div {
              margin: 0 auto;
              width: auto;
          }
      }
      </style>    
  </head>
  
  <body>
  <div>
      <h1>Example Domain</h1>
      <p>This domain is for use in illustrative examples in documents. You may use this
      domain in literature without prior coordination or asking for permission.</p>
      <p><a href="https://www.iana.org/domains/example">More information...</a></p>
  </div>
  </body>
  </html>
`
}