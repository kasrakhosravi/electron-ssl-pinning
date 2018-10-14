Electron SSL Pinning
====================

Prevents MITM in Electron applications.

Installation
------------

```
npm install electron-ssl-pinning
```

Usage
-----

Retrive pinning config using following command
```sh
fetch-ssl-pinning-config google.com
```

Then apply this config to Electron session.

```js
const { session } = require('electron');
const createSslVerificator = require('electron-ssl-pinning');

session.defaultSession.setCertificateVerifyProc(
  createSslVerificator([
    {
      domain: '*.google.com',
      fingerprints: [
        'sha256/fyFMxrkFMkcRq9nDQimG8gq8136Vbrzm5pQSMhRH2Os=',
        'sha256/vgzNVNTOzaG9Xl2ezIWgTCwfk6UiDXf96I/prQgfZBs='
      ]
    }
  ])
);
```

License
-------

[Apache-2.0](LICENSE)