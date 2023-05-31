"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("@core/config"));
const mailtrap_1 = require("mailtrap");
class EmailClient {
    static getInstace() {
        return EmailClient.mailTrapClient
            ? EmailClient.mailTrapClient
            : new mailtrap_1.MailtrapClient({
                token: config_1.default.MAIL_TRAP_TOKEN,
            });
    }
}
EmailClient.mailTrapClient = new mailtrap_1.MailtrapClient({
    token: config_1.default.MAIL_TRAP_TOKEN,
});
exports.default = EmailClient.getInstace();
