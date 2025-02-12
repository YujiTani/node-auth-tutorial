import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
const router = Router()

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4),
})

const salt = bcrypt.genSaltSync(10);

const users = []

/**
 * ユーザーを登録
 * 
 * @param req リクエスト
 * @param res レスポンス
 * @returns ユーザー情報とcookieを返す
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = userSchema.parse(req.body)
        
        // 一致するユーザーがいる場合、中断してエラーを返す
        if (users.find((user) => user.email === email)) {
            return res.status(400).json({ error: 'User already exists' })
        }
        
        // ユーザーを作成
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: await bcrypt.hashSync(password, salt), // パスワードをハッシュ化 ソルト強度10
    }
    users.push(newUser)

    // ユーザー情報とcookieを返す
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' })
  }
})

export default router
