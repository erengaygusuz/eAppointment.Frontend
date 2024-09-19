import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionDecryptionService {
  private key = CryptoJS.enc.Utf8.parse(environment.ENCRYPT_DECRYPT_KEY);
  private iv = CryptoJS.enc.Utf8.parse(environment.ENCRYPT_DECRYPT_IV);

  constructor() {}

  encryptUsingAES256(text: string): any {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(text),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return encrypted.toString();
  }

  decryptUsingAES256(text: string) {
    const decrypted = CryptoJS.AES.decrypt(text, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
