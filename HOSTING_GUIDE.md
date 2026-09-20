# 🌐 24/7 Free Cloud Hosting Guide: Zodiac

এই গাইডটি অনুসরণ করে আপনি **Zodiac**-কে কোনো খরচ ছাড়াই (**১০০% ফ্রি**) ক্লাউডে ২৪ ঘণ্টা চালু রাখতে পারবেন—এমনকি আপনার কম্পিউটার বন্ধ বা স্লিপে থাকলেও Zodiac ডিসকর্ডে সবসময় অনলাইন থাকবে এবং নির্ধারিত সময়ে (সকাল ৯টা, দুপুর ১২টা ও সন্ধ্যা ৭টায়) স্বয়ংক্রিয়ভাবে কাজ করবে।

---

## 🛠️ সিস্টেমটি কীভাবে কাজ করে?

আমাদের বট কোডে একটি লাইটওয়েট **HTTP Health-Check Server** (`src/services/healthServer.js`) যুক্ত করা হয়েছে। 
1. এটি ক্লাউডে রান করার পর একটি পাবলিক লিংক তৈরি করে (যেমন: `https://zodiac-bot.onrender.com/health`)।
2. **UptimeRobot** নামের একটি ফ্রি সার্ভিস দিয়ে প্রতি ৫ মিনিট পর পর ওই লিংকে অটো-পিং পাঠানো হয়।
3. এর ফলে ক্লাউড সার্ভার কখনোই স্লিপ (Idle Sleep) মোডে যায় না এবং বটটি সারাদিন-রাত ২৪/৭ সম্পূর্ণ ফ্রিতে লাইভ থাকে!

---

## 🚀 স্টেপ-বাই-স্টেপ সেটআপ গাইড (মাত্র ৫ মিনিটে)

### ধাপ ১: কোড GitHub-এ আপলোড (Push) করা

> ⚠️ **নিরাপত্তা সতর্কতা**: আপনার `.env` ফাইলটি `.gitignore`-এ প্রটেক্ট করা আছে, তাই আপনার গোপন Bot Token কখনোই গিটহাবে যাবে না।

1. [github.com](https://github.com)-এ লগইন করুন এবং একটি নতুন **Private Repository** তৈরি করুন (যেমন: `DeadLeadSocietyBot`)।
2. আপনার কম্পিউটারের টার্মিনাল বা PowerShell-এ প্রজেক্ট ফোল্ডারে গিয়ে কমান্ডগুলো দিন:
   ```bash
   git add .
   git commit -m "feat: complete dead lead society bot with 24/7 keep-alive"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/DeadLeadSocietyBot.git
   git push -u origin main
   ```

---

### ধাপ ২: Render.com-এ ফ্রি ক্লাউড সার্ভিস তৈরি করা

1. [render.com](https://render.com)-এ গিয়ে একটি ফ্রি একাউন্ট তৈরি করুন (GitHub দিয়ে সরাসরি সাইন ইন করা যায়)।
2. ড্যাশবোর্ডে গিয়ে **`New +`** বাটনে ক্লিক করে **`Web Service`** সিলেক্ট করুন।
3. আপনার GitHub অ্যাকাউন্ট কানেক্ট করে আপনার `DeadLeadSocietyBot` রিপোজিটরিটি সিলেক্ট করুন।
4. সেটিংসগুলো নিচের মতো দিন:
   * **Name**: `dead-lead-society-bot`
   * **Region**: Oregon (US West) বা Frankfurt (EU)
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Instance Type**: **Free** ($0/month)
5. স্ক্রোল করে নিচে **`Environment Variables`** সেকশনে ক্লিক করুন এবং আপনার `.env`-এর ৩টি কী যোগ করুন:
   * `DISCORD_TOKEN` = `আপনার_বট_টোকেন`
   * `CLIENT_ID` = `1549546723771416666`
   * `GUILD_ID` = `1549028696512405594`
   * `TIMEZONE` = `Asia/Dhaka`
6. **`Create Web Service`** বাটনে ক্লিক করুন। ২ মিনিটের মধ্যে বটটি ক্লাউডে বিল্ড হয়ে চালু হয়ে যাবে!

---

### ধাপ ৩: UptimeRobot দিয়ে ২৪/৭ Keep-Alive চালু করা

Render-এর ফ্রি সার্ভিস ১৫ মিনিট কোনো রিকোয়েস্ট না পেলে স্লিপে যায়। বটটিকে সারাদিন জাগিয়ে রাখতে:

1. [uptimerobot.com](https://uptimerobot.com)-এ গিয়ে একটি সম্পূর্ণ ফ্রি একাউন্ট খুলুন।
2. ড্যাশবোর্ডে **`Add New Monitor`** বাটনে ক্লিক করুন।
3. নিচের ফিল্ডগুলো পূরণ করুন:
   * **Monitor Type**: `HTTP(s)`
   * **Friendly Name**: `Dead Lead Society Bot`
   * **URL (or IP)**: Render থেকে পাওয়া আপনার বটের URL (যেমন: `https://dead-lead-society-bot.onrender.com/health`)
   * **Monitoring Interval**: `5 minutes` (প্রতি ৫ মিনিট)
4. **`Create Monitor`** বাটনে ক্লিক করুন!

🎉 **অভিনন্দন!** এখন UptimeRobot প্রতি ৫ মিনিট পর পর আপনার বটকে পিং করবে। Render কখনোই স্লিপে যাবে না এবং আপনার পিসি বন্ধ থাকলেও বটটি আজীবন ২৪/৭ অনলাইনে থেকে ডিসকর্ডে সার্ভিস দেবে!

---

## 🔍 লাইভ স্ট্যাটাস চেক করার উপায়
আপনার বটের লাইভ স্ট্যাটাস যে কোনো মোবাইল বা ব্রাউজার থেকে দেখতে এই লিংকে ঢুকুন:
`https://your-app-name.onrender.com/health`

**আউটপুট দেখতে পাবেন:**
```json
{
  "status": "online",
  "service": "Dead Lead Society Bot",
  "tagline": "Where Dead Leads Get a Second Chance.",
  "uptimeSeconds": 86400,
  "timestamp": "2026-09-16T12:00:00.000Z"
}
```
