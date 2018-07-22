Two files need to be in this folder for the https server to work: `cert.pem` and `key.pem`.

Feel free to disable https by commenting out the code in the main `index.js` file, or create your own self-signed certs with `openssl`; sample command below:

```bash
openssl req -newkey rsa:4096 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
