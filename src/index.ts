/*
 * Copyright 2018 Dialog LLC <info@dlg.im>
 */

import { CertificateVerifyProcRequest } from 'electron';

type Config = Array<{
  domain: string,
  strict: boolean,
  fingerprints: Array<string>
}>;

function createVerificator(config: Config) {
  config.forEach(({ domain }) => {
    const wildcardCount = domain.match(/\*/g);
    if (wildcardCount && wildcardCount.length > 1) {
      throw new Error('Wrong wildcard format specified. Use "*.example.org".');
    }    
  });

  const rules = config.map((rule) => {
    const fingerprintSet = new Set(rule.fingerprints);
    const hostnameRegex = new RegExp('^' + rule.domain.replace('*.', '.*\\.?') + '$');
    
    return (hostname: string, fingerprints: Array<string>) => {
      if (!hostnameRegex.test(hostname)) {
        return false;
      }

      if (rule.strict) {
        return fingerprints.every((fp) => fingerprintSet.has(fp));
      }

      return fingerprints.some((fp) => fingerprintSet.has(fp));
    };
  });

  return (request: CertificateVerifyProcRequest, callback: (verificationResult: number) => void) => {
    const fingerprints: Array<string> = []; 
    for (let cert = request.certificate; cert && cert !== cert.issuerCert; cert = cert.issuerCert) {
      fingerprints.push(cert.fingerprint);
    }

    if (rules.some((rule) => rule(request.hostname, fingerprints))) {
      callback(-3)
    } else {
      callback(-2);
    }
  };
}

module.exports = createVerificator;