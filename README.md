Electron SSL Pinning
====================

Prevents MITM in Electron applications.

[What? MITM?](https://www.owasp.org/index.php/Certificate_and_Public_Key_Pinning#Introduction)

Installation
------------

```bash
npm install electron-ssl-pinning
```

Usage
-----

Retrive pinning config using following command

```bash
fetch-ssl-pinning-config google.com
```

Then apply this config to Electron session.

```js
const { session } = require('electron');
const { default: createSslVerificator } = require('electron-ssl-pinning');

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
