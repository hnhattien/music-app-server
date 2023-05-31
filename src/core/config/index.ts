import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY as string;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY as string;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT as string;
const UPCARE_SECRET_KEY = process.env.UPCARE_SECRET_KEY as string;
const UPCARE_PUBLIC_KEY = process.env.UPCARE_PUBLIC_KEY as string;
const MAIL_TRAP_TOKEN = process.env.MAILTRAP_TOKEN as string;
const SENDER_EMAIL = process.env.SENDER_EMAIL as string;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET as string;
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID as string;
export default {
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_URL_ENDPOINT,
  UPCARE_SECRET_KEY,
  UPCARE_PUBLIC_KEY,
  MAIL_TRAP_TOKEN,
  SENDER_EMAIL,
  DROPBOX_CLIENT_SECRET,
  DROPBOX_CLIENT_ID,
};
