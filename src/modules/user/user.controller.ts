import { ROLE } from "@core/authenticate/RoleData";
import prismaClient from "@core/database/prismaClient";
import { User } from "@prisma/client";
import bcryptUtil from "@utils/bcrypt.util";
import imagekitUtil from "@utils/imagekit.util";
import { NextFunction, Request, Response } from "express";
import { toInteger } from "lodash";
import { userInfo } from "os";
import { v4 } from "uuid";
import crypto from "crypto";
import nodemailer from "nodemailer";
import emailClient from "@core/email/emailClient";
import config from "@core/config";
import moment from "moment";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as Partial<User>;
  try {
    if (user && user.role === ROLE.ADMIN) {
      const users = await prismaClient.user.findMany({
        where: {
          role: ROLE.USER,
        },
        select: {
          id: true,
          displayedName: true,
          email: true,
          username: true,
          joinday: true,
          role: true,
        },
      });
      res.send(users);
    } else {
      res.send({
        error: {
          message:
            "Yout not permit to see user infomation. Please login as admin.",
        },
      });
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as Partial<User>;
  try {
    if (user) {
      let base64 = req.body.base64Image;
      let filename = v4();

      const re = await imagekitUtil.upload(filename, base64);
      console.log(re);
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          avatar: filename,
        },
      });
      res.send({ message: "Update avatar successfull!" });
    } else {
      res.send({
        error: {
          message: "Yout not permit to edit this user infomation.",
        },
      });
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

const changeNickName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as Partial<User>;
  try {
    if (user) {
      let newNickname = req.body.newNickname;
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          displayedName: newNickname,
        },
      });
      res.send({ message: "Update nickname successfull!" });
    } else {
      res.send({
        error: {
          message:
            "Yout not permit to see user infomation. Please login as admin.",
        },
      });
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

const getLikedMusics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as Partial<User>;
  try {
    if (user) {
      const musics = await prismaClient.music.findMany({
        where: {
          likes: {
            some: {
              userid: user.id,
            },
          },
        },
      });
      res.send(musics);
    } else {
      res.send({ error: { message: "Not login yet." } });
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as Partial<User>;
  try {
    if (!user)
      res.send({
        error: { message: "You cannot see user info who is not you." },
      });
    else {
      const userInfo = await prismaClient.user.findFirst({
        where: {
          id: user.id,
        },
      });
      res.send(userInfo);
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { selector, password, currentpassword, newpassword } = req.body || {};
  const user = req.user as Partial<User>;
  if (selector) {
    //For reset for forget password
    let resultEmail;
    const resetPasswordTarget = await prismaClient.resetPassword.findFirst({
      where: {
        selector,
      },
    });
    if (!resetPasswordTarget) {
      res.send({ error: { message: "Something error!" } });
      return;
    }
    let hashedPassword = await bcryptUtil.generateHash(password);
    await prismaClient.user.update({
      where: {
        email: resetPasswordTarget.useremail,
      },
      data: {
        password: hashedPassword,
      },
    });
    await prismaClient.resetPassword.delete({
      where: {
        id: resetPasswordTarget.id,
      },
    });
    res.send({ message: "Update password successfull." });
    return;
  } else if (user) {
    const userInfo = await prismaClient.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!userInfo) {
      res.send({ error: { message: "User not found" } });
      return;
    }
    const isSamePassword = await bcryptUtil.comparePassword(
      currentpassword,
      userInfo?.password as string
    );
    if (!isSamePassword) {
      res.send({ error: { message: "Password not same" } });
      return;
    }
    const hashedNewPassword = await bcryptUtil.generateHash(newpassword);
    await prismaClient.user.update({
      where: {
        id: userInfo.id,
      },
      data: {
        password: hashedNewPassword,
      },
    });
    res.send({ message: "Update password successfully" });
  } else {
    res.send({ error: { message: "You not permit to perform this action." } });
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body || {};
    const userInfo = await prismaClient.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email: username,
          },
        ],
      },
    });
    if (!userInfo) {
      res.send({ error: { message: "User not found" } });
      return;
    }
    let token = crypto.randomBytes(20).toString("hex");
    let selector = crypto.randomBytes(9).toString("hex");
    const EXPIRES_IN = 600000; //5 minutes afterward
    let expires = moment(Date.now()).add(EXPIRES_IN, "millisecond").toDate();
    let hashToken = await bcryptUtil.generateHash(token);
    await prismaClient.resetPassword.create({
      data: {
        expires: expires,
        token: hashToken,
        selector,
        useremail: userInfo.email,
      },
    });

    await emailClient.send({
      from: { email: config.SENDER_EMAIL, name: "Tien Hoang" },
      to: [{ email: userInfo.email, name: "User" }],
      subject: "Reset Password",
      html:
        `<h1>Reset Password For SE447-E Music App</h1>` +
        `<h1><a href='http://${req.hostname}/resetpassword?sel=${selector}&token=${token}'>Click here to reset password.</a></h1>`,
    });
    res.send({ message: "Check email for reset password." });
  } catch (err) {
    console.log(err);
    res.send({
      error: {
        message: String(err),
      },
    });
  }
};

const authenticateResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sel, userToken } = req.body || {};
    let hexRegex = /^[0-9a-fA-F]+$/;
    if (hexRegex.test(sel) && hexRegex.test(userToken)) {
      const resetPassword = await prismaClient.resetPassword.findFirst({
        where: {
          selector: sel,
          expires: {
            gt: moment(Date.now()).toDate(),
          },
        },
      });
      if (!resetPassword) {
        res.send({ error: { message: "Token was expires!" } });
        return;
      }

      let hashedUserToken = resetPassword.token;

      if (await bcryptUtil.comparePassword(userToken, hashedUserToken)) {
        res.send({
          isAuth: true,
          message: "Request Reset password success!",
        });
      } else {
        res.send({ error: { message: "Token is invalid." } });
      }
    } else {
      res.send({ error: { message: "Token is invalid!" } });
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

export default {
  getUsers,
  uploadAvatar,
  changeNickName,
  getLikedMusics,
  getProfile,
  changePassword,
  authenticateResetPassword,
  resetPassword,
};
