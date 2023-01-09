import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';

const secretKey = Buffer.from('ghs2022lab000000').toString('base64');
const plainIv = Buffer.from('0000000000000000').toString('base64');

@Injectable()
export class PwCryptoUtil {

    getAlgorithm(keyBase64) {
        console.log(plainIv)
        var key = Buffer.from(keyBase64, 'base64');
        switch (key.length) {
            case 16:
                return 'aes-128-cbc';
            case 32:
                return 'aes-256-cbc';
                
        }
        
        throw new Error('Invalid key length: ' + key.length);
    }
    
    async encrypt(plainText){
        const key = Buffer.from(secretKey, 'base64');
        const iv = Buffer.from(plainIv, 'base64');
        const cipher = createCipheriv(this.getAlgorithm(secretKey), key, iv)

        let encrypted = cipher.update(plainText, 'utf8', 'base64')
        encrypted += cipher.final('base64');

        return encrypted;
    }

    async decrypt(encryptText){
        const key = Buffer.from(secretKey, 'base64');
        const iv = Buffer.from(plainIv, 'base64')
        const decipher = createDecipheriv(this.getAlgorithm(secretKey), key, iv);
        
        let decrypted = decipher.update(encryptText, 'base64').toString();
        decrypted += decipher.final();

        return decrypted;
    }

}
   