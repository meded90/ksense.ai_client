require("dotenv").config();
import session from "express-session";
import express, { Request, Response } from "express";
import next from "next";
import passport from "passport";
import Auth0Strategy from "passport-auth0";
import uid from "uid-safe";
import authRoutes from "./auth-routes";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();

    // 2 - add session management to Express
    const sessionConfig = {
      secret: uid.sync(18),
      cookie: {
        maxAge: 86400 * 1000 // 24 hours in milliseconds
      },
      resave: false,
      saveUninitialized: true
    };
    server.use(session(sessionConfig));

    // 3 - configuring Auth0Strategy
    const auth0Strategy = new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
      },
      function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
      }
    );

    // 4 - configuring Passport
    passport.use(auth0Strategy);
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // 5 - adding Passport and authentication routes
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(authRoutes);

    // 6 - you are restricting access to some routes
    const restrictAccess = (req, res, next) => {
      if (!req.isAuthenticated()) return res.redirect("/login");
      next();
    };


    server.use("/profile", restrictAccess);
    server.use("/share-thought", restrictAccess);

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
