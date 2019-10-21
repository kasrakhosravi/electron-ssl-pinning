import { session, BrowserWindow } from 'electron';
import { createSslVerificator, SSL_USE_CHROME_VERIFICATION } from '../index';
import fetchSslPinningConfig, { DomainConfig } from '../fetchSslPinningConfig';

const url = new URL('https://www.example.org');
let domainConfig: DomainConfig;

beforeAll(async () => {
  domainConfig = await fetchSslPinningConfig(url);
});

describe('createSslVerificator', () => {
  it('should validate config domain', () => {
    expect(() => {
      createSslVerificator([
        {
          strict: true,
          domain: '*.example.*',
          fingerprints: []
        }
      ]);
    }).toThrow();
  });

  it('should correctly handle strict validation', async () => {
    const verificator = createSslVerificator([
      {
        strict: true,
        domain: domainConfig.domain,
        fingerprints: domainConfig.fingerprints
      }
    ]);

    const callbackResults: Array<number> = [];

    const ses = session.fromPartition(`test_${Math.random()}`);
    ses.setCertificateVerifyProc((request, callback) => {
      verificator(request, (result) => {
        callbackResults.push(result);
        callback(result);
      });
    });

    const window = new BrowserWindow({
      webPreferences: {
        session: ses
      }
    });

    await window.loadURL('https://www.example.org');

    expect(callbackResults.length).toBeGreaterThan(0);
    for (const result of callbackResults) {
      expect(result).toBe(SSL_USE_CHROME_VERIFICATION);
    }
  });

  it('should correctly handle non strict validation with head fingerprint', async () => {
    const verificator = createSslVerificator([
      {
        strict: false,
        domain: domainConfig.domain,
        fingerprints: [
          domainConfig.fingerprints[domainConfig.fingerprints.length - 1]
        ]
      }
    ]);

    const callbackResults: Array<number> = [];

    const ses = session.fromPartition(`test_${Math.random()}`);
    ses.setCertificateVerifyProc((request, callback) => {
      verificator(request, (result) => {
        callbackResults.push(result);
        callback(result);
      });
    });

    const window = new BrowserWindow({
      webPreferences: {
        session: ses
      }
    });

    await window.loadURL('https://www.example.org');

    expect(callbackResults.length).toBeGreaterThan(0);
    for (const result of callbackResults) {
      expect(result).toBe(SSL_USE_CHROME_VERIFICATION);
    }
  });
});
