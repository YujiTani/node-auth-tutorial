const express = require("express");

const session = require("express-session");
import {RedisStore} from "connect-redis"
import {createClient} from "redis"

import authRouter from "./routes/auth";

const redisClient = createClient({
    url: process.env.REDIS_URL,
})
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const app = express();

// セッションを開始したときのクッキーへの送信とRedisへの登録の設定
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30日
        httpOnly: true, // クッキーを通じてのJavaScriptアクセスを禁止
        secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPS接続が必要
        sameSite: "lax", // クロスサイトリクエストを許可
    },
  })
);

// ルーティング
app.use("/auth", authRouter);

app.listen(4400, () => {
  console.log("Server is running on port 4400");
});
