import CryptoES from "crypto-es";
import * as Forge from "node-forge";

import configApi from "./api";

const keySize = 256 / 32;
const iterations = 2000;

export function cryptoGenerateKey(salt, passPhrase) {
  return CryptoES.PBKDF2(passPhrase, CryptoES.enc.Hex.parse(salt), {
    keySize,
    iterations,
  });
}

export function cryptoEncryptAES(passPhrase, plainText) {
  const iv = CryptoES.lib.WordArray.random(128 / 8).toString(CryptoES.enc.Hex);
  const salt = CryptoES.lib.WordArray.random(128 / 8).toString(
    CryptoES.enc.Hex
  );
  const key = cryptoGenerateKey(salt, passPhrase);
  const encrypted = CryptoES.AES.encrypt(plainText, key, {
    iv: CryptoES.enc.Hex.parse(iv),
  });
  return { iv, salt, data: encrypted.ciphertext.toString(CryptoES.enc.Base64) };
}

export function forgeEncryptRSA(msg, encodedPublic) {
  // load public key from PEM-formatted string
  const pem = `-----BEGIN PUBLIC KEY-----${encodedPublic}-----END PUBLIC KEY-----`;
  const publicKey = Forge.pki.publicKeyFromPem(pem);

  // convert string to UTF-8 encoded bytes
  // const buffer = Forge.util.createBuffer(msg, 'utf8');
  const buffer = Forge.util.createBuffer(msg);
  const bytes = buffer.getBytes();

  // encrypt data with a public key using RSAES PKCS#1 v1.5
  const encrypted = publicKey.encrypt(bytes, "RSAES-PKCS1-V1_5");

  // base64-encode encrypted data to send to server
  return Forge.util.encode64(encrypted);
}

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    // tslint:disable-next-line:no-bitwise one-variable-per-declaration
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const handleEncryptBody = (body, publicKey, userLogin) => {
  const randomKey = uuidv4();
  const encryptData = cryptoEncryptAES(randomKey, body);
  const aesMeta = encryptData.salt + "::" + encryptData.iv + "::" + randomKey;
  const encryptMeta = forgeEncryptRSA(aesMeta, publicKey);
  return {
    meta: encryptMeta,
    data: encryptData.data,
    verified: userLogin,
  };
};
export const checkURLForUserLogin = (url) => {
  return !(
    url.includes("/login/getLoginFailLimitConfig") ||
    url.includes("/login/fetchInfo") ||
    url.includes("/login/forgetPassword") ||
    url.includes("/summary/sendSMSOTP") ||
    url.includes("/summary/getOTPNumber") ||
    url.includes("/summary/createOFFAuthenEntrust") ||
    // url.includes('/setting/customer/checkUserExitsByUserIdAndPass') ||
    url.includes("/mail/findMailServiceType") ||
    url.includes("/mail/insertContact") ||
    url.includes("/billPayment/checkVNTopUpInfo")
  );
};

export const unauthenticated = (URL) => {
  let List = [configApi.API_GET_PERMISSION];

  if (List.includes(URL)) {
    return true;
  } else {
    return false;
  }
};

export const makeNewBody = (url, permissionID, data, custId) => {
  let newBody;
  const authBody = Object.assign({}, data, { certId: custId });
  if (!url.match(/\/security\//)) {
    newBody = handleEncryptBody(
      JSON.stringify(authBody),
      permissionID,
      checkURLForUserLogin(url)
    );
    // newBody = { verified: true, ...authBody };
  } else {
    newBody = { ...data };
  }
  if (typeof newBody === "object") {
    return JSON.stringify(newBody);
  }
  return newBody;
};

export function testSHA256(arrayBuffer) {
  const words = CryptoES.lib.WordArray.create(arrayBuffer);
  const rst = CryptoES.SHA256(words).toString();
  return rst;
}
