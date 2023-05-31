import config from "@core/config";
import { MailtrapClient } from "mailtrap";
import { Dropbox, DropboxOptions } from "dropbox";
class DropboxClient {
  static dropboxClient: Dropbox;
  static dropboxClientConfig: DropboxOptions = {
    clientSecret: config.DROPBOX_CLIENT_SECRET,
    clientId: config.DROPBOX_CLIENT_ID,
  };
  static getInstace() {
    console.log(this.dropboxClientConfig);
    if (this.dropboxClient) {
      return this.dropboxClient;
    } else {
      this.dropboxClient = new Dropbox(this.dropboxClientConfig);
      return this.dropboxClient;
    }
  }
}

export default DropboxClient.getInstace();
