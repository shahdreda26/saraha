import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from("dfghjk45632@45321#ftyu123art98!4"); //--> 32 bytes 
const IV_LENGTH = 16;//-->16 bytes


export function encrypt(text) {

//------>Generate a random initialization vector"increase security"مش اكتر من كدا 
   const iv = crypto.randomBytes(IV_LENGTH);//-->securityعشان ازود ال  keyميطلعليش نفس ال encryptعشان كل مره اعمل 

//----->Create cipher with AES-256-CBC "algorithm"  & AES is fixed-size block(16 bytes) encryption لو الرقم اقل من 16 او  16 بعتبره بلوك و بعمله على طول 
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);//createCipheriv--> بتحتوى على CipherKey = BinaryLike | KeyObject --> ENCRYPTION_KEY احطلها فىbuffer 

//----->Encrypt the data incomplete block and add padding يعنى بتحشى البلوك الى ناقص & encryption لانها بتهندل الfinal لحد ما تلاقى واحد ناقص توديه لencryptionتعمله block  هتاخد كل update الرقم لو اكبر من 16 ومش بيقبل القسمه على 16 ساعتها 
  let encrypted = cipher.update(text, 'utf8', 'hex');//text = data "01203097856 & ahmed" & utf8 --> encoding of the input data & hex --> encoding of the input data & hex --> encoding of the output data تتعرض فى صوره هيكسا
  encrypted += cipher.final('hex'); // finalize the encryption process & return the last encrypted data 

//----->Return both the encrypted data and the IV as hexa
  return iv.toString('hex') + ':' + encrypted;

}


//----->Decryption
export function decrypt(text) {
    const [ivHex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
