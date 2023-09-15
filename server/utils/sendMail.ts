import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import env from './env';
interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: {
    [key: string]: any;
  };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT),
    service: env.SMTP_SERVICE,
    auth: {
      user: env.SMTP_EMAIL,
      pass: env.SMTP_PASSWORD,
    },
  });
  const { data, email, subject, template } = options;
  /* get the  path to the email template file */
  const templatePath = path.join(__dirname, '../mails', template);
  const html: string = await ejs.renderFile(templatePath, data);
  const emailOptions = {
    from: env.SMTP_EMAIL,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(emailOptions);
};

export default sendMail;
