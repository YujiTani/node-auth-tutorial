import express from 'express'
import session from 'express-session'
import Redis from 'redis'
import connectRedis from 'connect-redis'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4400

// Redisクライアントの作成
const redisClient = Redis.createClient({
    url: process.env.REDIS_URL
})

// Redisクライアントの接続
// エラーが発生した場合はコンソールにエラーを出力
redisClient.connect().catch(console.error)

// RedisStoreの作成
// RedisStoreはセッションをRedisに保存するためのストア
const RedisStore = connectRedis(session)

// セッションミドルウェアはセッションを管理するためのミドルウェア
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.SESSION_SECRET,
    resave: false, // セッションが変更されない限り保存しない
    saveUninitialized: false, // 未初期化のセッションは保存しない
    cookie: {
        secure: process.env.NODE_ENV === 'production', // 本番環境ではHTTPSを使用
        httpOnly: true, // クライアントサイドのJavaScriptからはアクセスできない
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30日
        sameSite: 'lax', // CSRF攻撃を防ぐため
        path: '/' // セッションが有効なパス
    }
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// 認証用のルーティング
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})