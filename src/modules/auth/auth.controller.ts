import { ROLE } from "@core/authenticate/RoleData";
import prismaClient from "@core/database/prismaClient";
import { User } from "@prisma/client";
import bcryptUtil from "@utils/bcrypt.util";
import imagekitUtil from "@utils/imagekit.util";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { v4 } from "uuid";

const login = async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    "local",
    { failureFlash: true },
    (err: any, user: User, info: any) => {
      console.log("authenticated");
      if (err) {
        return res.send({
          error: {
            message: String(err),
          },
        });
      } else if (!user) {
        return res.send({
          error: {
            message: info["message"],
          },
        });
      } else {
        return req.logIn(user, (err) => {
          if (err) {
            return res.send({ error: { message: String(err) } });
          } else {
            return res.send({
              user: {
                id: user.id,
                nickname: user["displayedName"],
                avatar: user["avatar"],
                role: user["role"],
              },
              message: info["message"],
            });
          }
        });
      }
    }
  )(req, res, next);
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logOut((err) => {
      if (err) {
        res.send({
          error: {
            message: String(err),
          },
        });
      } else {
        res.send({ message: "Logout success" });
      }
    });
  } catch (err) {
    res.send({
      error: {
        message: "Logout failed",
      },
    });
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, isAdminSignup } = req.body || {};
    console.log(req.body);
    if (isAdminSignup) {
      const admin = await prismaClient.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
          role: ROLE.ADMIN,
        },
      });
      if (admin) {
        res.send({
          error: {
            message: "User existed",
          },
        });
      } else {
        let hashedPassword = await bcryptUtil.generateHash(password);
        await prismaClient.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            role: ROLE.ADMIN,
          },
        });

        res.send({
          message: "Sign up successful!",
          username,
        });
      }
    } else {
      const user = await prismaClient.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
          role: ROLE.USER,
        },
      });
      if (user) {
        res.send({
          error: {
            message: "User existed",
          },
        });
      } else {
        let hashedPassword = await bcryptUtil.generateHash(password);
        await prismaClient.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });
        res.send({
          message: "Sign up successfully!",
          username,
        });
      }
    }
  } catch (err) {
    res.send({
      error: {
        message: String(err),
      },
    });
  }
};

const loginFacebook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, userid } = req.body || {};
    if (user) {
      const id = user.userid;

      let username = user.email;
      let email = user.email;
      let displayedName = user.name;
      let avatarBase64 = user.avatarBase64;
      let rawData = avatarBase64.split(";base64,").pop();
      const avatarFilename = v4();
      imagekitUtil.upload(avatarFilename, avatarBase64);
      const userInfo = await prismaClient.user.findFirst({
        where: {
          id,
        },
      });
      if (!userInfo) {
        const facebookUser = await prismaClient.user.create({
          data: {
            id,
            displayedName,
            avatar: avatarFilename,
            email,
            username,
          },
        });
        req.logIn(facebookUser, (err) => {
          if (err) {
            res.send({
              error: {
                message: String(err),
              },
            });
          } else {
            res.send(facebookUser);
          }
        });
      } else {
        req.logIn(userInfo, (err) => {
          if (err) res.send({ error: { message: String(err) } });
          else {
            res.send(userInfo);
          }
        });
      }
    } else {
      res.send({ error: { message: "Request login with Facebook failed!" } });
    }
  } catch (err) {
    res.send({
      error: {
        message: String(err),
      },
    });
  }
};

const checkLoginStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = req.user as Partial<User>;
    console.log(user, "user");
    if (user) {
      res.send({
        isLogin: true,
        nickname: user.displayedName,
        avatar: user.avatar,
        id: user.id,
        role: user.role,
      });
    } else {
      res.send({
        isLogin: false,
      });
    }
  } catch (err) {
    res.send({
      error: {
        message: String(err),
      },
    });
  }
};

export default {
  login,
  logout,
  signup,
  loginFacebook,
  checkLoginStatus,
};
