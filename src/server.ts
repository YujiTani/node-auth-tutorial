// app.js
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const redisClient = redis.createClient();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // HTTPSを使用する場合はtrueに設定
}));

// ユーザー情報を保存するための簡易データベース（メモリ内）
let users = [];

// ユーザー登録エンドポイント
app.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // 既に登録されているユーザーか確認
    const existingUser = users.find((user: { username: string }) => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー情報を保存
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
