const express = require("express");

const session = require("express-session");
const RedisStore = require('connect-redis');
const { createClient } = require("redis");

import authRouter from "./routes/auth";

const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
    client: redisClient,
    prefix: "prefix:",
  });

const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const app = express();

// セッションを開始したときのクッキーへの送信とRedisへの登録の設定
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE) },
    store: redisStore,
  })
);

// ルーティング
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
