import prismaClient from "@core/database/prismaClient";
import { Request } from "express";
import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ROLE } from "./RoleData";
import bcryptUtil from "@utils/bcrypt.util";
import { User } from "@prisma/client";
import { UnAuthenticated } from "@core/types/ErrorTypes";

const initPassport = (passport: PassportStatic) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req: Request, username: string, password: string, done) {
        try {
          if (req.body.isAdminLogin) {
            const user = await prismaClient.user.findFirst({
              where: {
                username,
              },
            });
            if (!user) {
              return done(null, false, { message: "Incorrect username." });
            }
            if (!user.password) {
              return done(null, false, { message: "Incorrect username." });
            }
            const isSamePassword = await bcryptUtil.comparePassword(
              password,
              user.password
            );
            if (!isSamePassword) {
              return done(null, false, {
                message: "Incorrect password.",
              });
            }
            return done(null, user, { message: "Login success" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: Partial<User>, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: User["id"], done) => {
    const user = await prismaClient.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        avatar: true,
        displayedName: true,
        username: true,
        email: true,
        role: true,
      },
    });
    if (user) done(null, user);
    else done(new UnAuthenticated(), null);
  });
};

export default initPassport;
