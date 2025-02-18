const jwt = require("jsonwebtoken");
const User = require("../model/user");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.development" });
} else {
  require("dotenv").config({ path: ".env.production" });
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
                where: {
                  id: user.id,
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
                { id: user.id, name: user.name, email: user.email },
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

module.exports = authenticate;
