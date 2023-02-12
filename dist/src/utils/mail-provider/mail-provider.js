"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailProvider {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_PROVIDER_USER,
                pass: process.env.EMAIL_PROVIDER_PASSWORD,
            },
        });
    }
    async sendMail(message) {
        const info = await this.transporter.sendMail({
            to: {
                name: message.to.name,
                address: message.to.email,
            },
            from: {
                name: message.from.name,
                address: message.to.email,
            },
            subject: message.subject,
            html: message.body,
        });
        return info.messageId;
    }
}
exports.MailProvider = MailProvider;
