import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config({ path: ".env.production" });
}


const authenticate = async (req, res, next) => {
  try {
    const { refresh_token: Rtoken, access_token: Atoken } = req.cookies;

    if (!Atoken) {
      return res.status(400).send({
        message: "authorization token was not provided or was not valid",
      });
    }

    // Verify the access token
    jwt.verify(
      Atoken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          // If access token is invalid, check the refresh token
          if (!Rtoken) {
            return res.status(400).send({
              message: "authorization token was not provided or was not valid",
            });
          }

          // Verify the refresh token
          jwt.verify(
            Rtoken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, user) => {
              if (err) {
                return res.status(400).send({
                  message:
                    "authorization token was not provided or was not valid",
                });
              }

              // Check if the refresh token is in the database
              const queryResult = await User.findOne({
                atrributes: ["refresh_token"],
                where: {
                  user_id: user.user_id,
                  email: user.email,
                },
              });

              if (queryResult.dataValues.refreshToken !== Rtoken) {
                return res.status(400).send({
                  message:
                    "authorization token was not provided or was not valid",
                });
              }

              // Generate a new access token
              const Atoken = jwt.sign(
                { user_id: user.user_id, username: user.username, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
              );
              await res.cookie("access_token", Atoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              });

              req.user = user;
              next();
            }
          );
        } else {
          req.user = decoded;
          next();
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while validating the user token",
    });
  }
};

export default authenticate;
