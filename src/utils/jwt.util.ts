import { verify, sign, decode } from "jsonwebtoken";
import config from "../core/config";

let { JWT_ACCESS_TOKEN_PRIVATE_KEY, JWT_REFRESH_TOKEN_PRIVATE_KEY } =
  config || {};

const signAccessToken = (payload: any, expiresIn: any) => {
  return sign(payload, JWT_ACCESS_TOKEN_PRIVATE_KEY as string, {
    algorithm: "RS256",
    expiresIn: expiresIn,
  });
};

const signRefreshToken = (payload: any, expiresIn: any) => {
  return sign(payload, JWT_REFRESH_TOKEN_PRIVATE_KEY as string, {
    algorithm: "RS256",
    expiresIn: expiresIn,
  });
};

const issueAccessToken = (sub: any, sessionId: any, expiresIn: any) => {
  return signAccessToken(
    {
      sub,
      jti: sessionId,
    },
    expiresIn
  );
};

const issueRefreshToken = (sub: any, sessionId: any, expiresIn: any) => {
  return signRefreshToken(
    {
      sub,
      jti: sessionId,
    },
    expiresIn
  );
};

const verifyRefreshToken = (token: string) => {
  try {
    const tokenDetail: any = verify(token, JWT_REFRESH_TOKEN_PRIVATE_KEY, {
      algorithms: ["RS256"],
    });
    const { jti, sub } = tokenDetail || {};
    return {
      sessionId: jti,
      id: sub,
    };
  } catch (error) {
    throw new Error("No authenticated");
  }
};

const verifyAccessToken = (token: string) => {
  try {
    const tokenDetail: any = verify(token, JWT_ACCESS_TOKEN_PRIVATE_KEY, {
      algorithms: ["RS256"],
    });

    const { jti, sub } = tokenDetail || {};
    return {
      sessionId: jti,
      id: sub,
    };
  } catch (error) {
    console.log(error);
    throw new Error("No authenticated");
  }
};

const accessTokenHelper = {
  signAccessToken,
  verifyAccessToken,
  issueAccessToken,
};

const refreshTokenHelper = {
  signRefreshToken,
  verifyRefreshToken,
  issueRefreshToken,
};

export { accessTokenHelper, refreshTokenHelper };
