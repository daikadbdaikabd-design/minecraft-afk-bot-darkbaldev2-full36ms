const mineflayer = require("mineflayer")
const express = require("express")

let bot
let afkInterval
let chatInterval

const config = {
  host: "curiousgeorge.mcsh.io",
  port: 11187,
  username: "_HuuThien_",
  version: "1.20.1",
  password: "bot123"
}

function startBot() {

  console.log("Đang khởi động bot...")

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  })

  bot.on("login", () => {
    console.log("Bot đã login server")
  })

  bot.on("spawn", () => {

    console.log("Bot đã vào world")

    // login
    setTimeout(() => {
      bot.chat(`/login ${config.password}`)
    }, 3000)

    // register nếu cần
    setTimeout(() => {
      bot.chat(`/register ${config.password} ${config.password}`)
    }, 5000)

    if (afkInterval) clearInterval(afkInterval)
    if (chatInterval) clearInterval(chatInterval)

    // chống AFK
    afkInterval = setInterval(() => {

      if (!bot.entity) return

      bot.setControlState("jump", true)

      bot.look(
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.5
      )

      setTimeout(() => {
        bot.setControlState("jump", false)
      }, 200)

    }, 1500)

    // chat mỗi 10 phút
    chatInterval = setInterval(() => {

      bot.chat("Anh Thiện Đẹp Trai")

    }, 600000)

  })

  bot.on("message", (jsonMsg) => {

    const msg = jsonMsg.toString()

    if (msg.includes("/login")) {
      bot.chat(`/login ${config.password}`)
    }

    if (msg.includes("/register")) {
      bot.chat(`/register ${config.password} ${config.password}`)
    }

  })

  bot.on("end", () => {

    console.log("Bot mất kết nối -> reconnect sau 15s")

    if (afkInterval) clearInterval(afkInterval)
    if (chatInterval) clearInterval(chatInterval)

    setTimeout(startBot, 15000)

  })

  bot.on("error", (err) => {
    console.log("Lỗi:", err.message)
  })

  bot.on("kicked", (reason) => {
    console.log("Bot bị kick:", reason)
  })

}

startBot()

// web server để giữ hosting online
const app = express()

app.get("/", (req, res) => {
  res.send("Minecraft AFK Bot Online")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Web server chạy port", PORT)
})
