import crypto from 'crypto';

//encryption سريه المعلومات "confidentiality" is two way -->التشفير بيكون عكسى يعنى انا بشفر الباسورد وبقدر افك الشفرة واعرف الباسورد اللى فى الداتا (كلام مقروءplain text = 123456-->encrypt"algorithm"-->cipher text = asdfghjkl) & decryption (cipher text = asdfghjkl-->decrypt-->plain text = 123456) -->reserved
    //-->symmetric encryption (same one key "shared secret key" for encryption & decryption) -->from source to destination
        //--> algorithms: AES "advanced encryption standard", DES "data encryption standard "  & مميزاته faster than asymmetric encryption - simple to implement--> بستخدمه اما اكون انا الى مسوؤل عن تشفير الداتا وفكها
 // micro services use it  //-->asymmetric encryption (different keys "generate two keys" for encryption "public key" & decryption "private key") --> from source to  destination (public & private وكل واحد منهم ليه )  
        //--> algorithms: RSA "Rivest-Shamir-Adleman" & ECC "Elliptic Curve Cryptography" & مميزاته more secure than symmetric encryption - no shared private key 
//hashing سلامه المعلومات "integrity" is one way "irreversible" -->not allowed to dehash -->(plain text = 123456-->hashing-->hashed password = asdfghjkl) & data convert into  fixed_length & password ومقدرش ارجعها لاصلها تانى زى 
  //-->algorithm :SHA-256 "secure hash algorithm 256" & MD5 "message digest 5" 
  //-->Bcrypt generator.com --> app generate hashing value 
  //--> algorithm :argon2 "2a" & Bcrypt "2b"
  //-->cost factor --> number of rounds  (higher cost factor increases security but also increases the time it takes to hash a password and decrease performance)  2^cost factor = 10 --> 2^10 rounds of hashing
  //--> salting --> add random data to ensure that the output is unique salt 
  // encryption : crypto "server side" use in backend - high performance-security - more complex in implementation & crypto-js use in frontend --> are modules in Node.js 

// create cipher --> update cipher --> final cipher "crypto module"

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
