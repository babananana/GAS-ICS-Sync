const key = Secrets().aes_passphrase;

function loadLatestEmailAttachment() {
  // Define your Gmail search query
  const query = Secrets().gmail_query; // Change this to your needs

  // Search Gmail threads matching the query
  const threads = GmailApp.search(query, 0, 1); // Only need the latest
  if (threads.length === 0) {
    Logger.log("No threads found for the query.");
    return;
  }

  // Get the most recent message from the latest thread
  const messages = threads[0].getMessages();
  const latestMessage = messages[messages.length - 1];

  

  // Get attachments from the latest message
  const attachments = latestMessage.getAttachments();
  if (attachments.length === 0) {
    Logger.log("No attachments found in the latest message.");
    return;
  }
  
  return aesDecrypt(attachments[0].getBytes(), key);
}

function aesDecrypt(encryptedMessage, keyString) {
  var key = cCryptoGS.CryptoJS.enc.Utf8.parse(keyString);
  var iv = key;

  var encrypted = Utilities.newBlob(encryptedMessage).getDataAsString('utf-8');
  var decrypted = cCryptoGS.CryptoJS.AES.decrypt(encrypted, key, { iv: iv, mode: cCryptoGS.CryptoJS.mode.CBC,
      padding: cCryptoGS.CryptoJS.pad.Pkcs7 });
  var decryptedMessage = decrypted.toString(cCryptoGS.CryptoJS.enc.Utf8);
  //Logger.log(decrypted);
  //Logger.log(decryptedMessage);

  return decryptedMessage;
}
