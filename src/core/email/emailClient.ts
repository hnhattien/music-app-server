import config from "@core/config";
import { MailtrapClient } from "mailtrap";

class EmailClient {
  static mailTrapClient: MailtrapClient = new MailtrapClient({
    token: config.MAIL_TRAP_TOKEN,
  });
  static getInstace() {
    console.log(config.MAIL_TRAP_TOKEN);
    return EmailClient.mailTrapClient
      ? EmailClient.mailTrapClient
      : new MailtrapClient({
          token: config.MAIL_TRAP_TOKEN,
        });
  }
}

export default EmailClient.getInstace();
