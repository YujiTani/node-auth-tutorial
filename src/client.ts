
// /auth/registerにユーザーを登録
const register = async () => {
    const response = await fetch("http://localhost:4400/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: "John Doe", email: "test1@example.com", password: "password" }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    console.log(data)
    // レスポンスヘッダーを確認
    console.log(response.headers)
}

register()
