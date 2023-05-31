import config from "@core/config";
import { MailtrapClient } from "mailtrap";

class EmailClient {
  static mailTrapClient: MailtrapClient = new MailtrapClient({
    token: config.MAIL_TRAP_TOKEN,
  });
  static getInstace() {
    return EmailClient.mailTrapClient
      ? EmailClient.mailTrapClient
      : new MailtrapClient({
          token: config.MAIL_TRAP_TOKEN,
        });
  }
}

export default EmailClient.getInstace();
