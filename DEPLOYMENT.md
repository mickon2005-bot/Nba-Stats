# Deploy Your NBA Stats Tracker to Vercel (Serverless)

**New Architecture:** This app is now optimized for Vercel with serverless API functions and stats.nba.com integration!

## 🎯 **What's New**

- ✅ **Serverless API Functions** - Each endpoint is its own function
- ✅ **Stats.NBA.com Native** - Direct access to NBA's official stats API
- ✅ **No Express Server** - Lightweight, fast, Vercel-native
- ✅ **Real Shot Charts** - Actual X/Y coordinates from games
- ✅ **Real Game-by-Game Stats** - Performance trends from real data
- ✅ **Automatic Fallbacks** - Graceful handling if APIs timeout

## 📋 **Prerequisites**

1. A GitHub account (free) - [github.com](https://github.com)
2. A Vercel account (free) - [vercel.com](https://vercel.com)

## 🚀 **Deployment Steps**

### **Step 1: Your Code is Already on GitHub! ✅**

You've already pushed your code, so you're good to go!

### **Step 2: Deploy to Vercel**

1. **Go to Vercel:**
   - Open [vercel.com](https://vercel.com)
   - Click **"Continue with GitHub"** to sign in
   - Authorize Vercel to access your repositories

2. **Import Your Project:**
   - Click **"Add New..."** → **"Project"**
   - Find **"nba-stats-tracker"** in the list
   - Click **"Import"**

3. **Configure Settings:**

   **Build & Development Settings:**
   - ✅ **Framework Preset:** Vite (or leave as "Other")
   - ✅ **Build Command:** `vite build`
   - ✅ **Output Directory:** `dist/client`
   - ✅ **Install Command:** `npm install` (default)
   - ✅ **Node.js Version:** 18.x or higher

   **Environment Variables:**
   - ✅ **No environment variables needed!** This app uses only stats.nba.com which doesn't require an API key.
   - You can skip this section entirely.

4. **Deploy!**
   - Click the big blue **"Deploy"** button
   - Wait 2-3 minutes while Vercel:
     - Installs dependencies
     - Builds your frontend
     - Deploys serverless functions
   - You'll see: **"Congratulations! 🎉"**

### **Step 3: Get Your Live URL**

After deployment succeeds:
- Copy your live URL (something like: `https://nba-stats-tracker-xyz123.vercel.app`)
- Click **"Visit"** to open your app

### **Step 4: Test Real NBA Data! 🏀**

Visit your deployed app and test these features:

1. **Dashboard** - Should load today's games and standings
2. **Players Page** - Click any player
3. **Shot Chart Tab** - You should see **real shot locations** from actual NBA games!
4. **Trends Tab** - You should see **real game-by-game performance data**!
5. **Open Browser Console (F12)** - Check for successful API calls

**Look for these indicators:**
- ✅ Shot charts show actual court positions
- ✅ Performance trends show real game dates
- ✅ No "simulated data" messages in console
- ✅ Fast loading times

## 🔄 **Updating Your App**

Whenever you make changes in Replit:

1. Use the **Git pane** in Replit
2. Write a commit message
3. Click **"Push branch as 'origin/main'"**
4. Vercel will **automatically rebuild** in 1-2 minutes!

## 💰 **Cost**

**$0/month** - Vercel's Hobby tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month  
- ✅ Serverless function executions
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic preview deployments

## 🎊 **What You Get on Vercel**

### **Real Data from Stats.NBA.com:**
- ✅ **Shot Charts** - Actual X/Y coordinates from games
- ✅ **Game Logs** - Real game-by-game player performance
- ✅ **Play-by-Play** - Real game event descriptions
- ✅ **Advanced Stats** - Detailed player/team metrics

### **Performance Benefits:**
- ✅ **Faster Loading** - Vercel's global CDN
- ✅ **Serverless Functions** - Auto-scaling
- ✅ **99.99% Uptime** - Enterprise reliability
- ✅ **Automatic HTTPS** - Secure by default

## ❓ **Troubleshooting**

### **Build Fails**
- Check the build logs in Vercel dashboard
- Verify `vite build` command is set
- Make sure output directory is `dist/client`

### **"Module not found" Errors**
- Make sure all dependencies are in `package.json`
- Click "Redeploy" in Vercel dashboard
- Try clearing build cache: Settings → General → Clear Build Cache

### **No API Keys Required**
- This app uses stats.nba.com exclusively
- No environment variables or API keys needed
- Everything works out of the box!

### **API Returning Errors**
- Check browser console (F12) for error messages
- Verify you're on the Vercel deployment (not Replit)
- Some stats.nba.com endpoints may have delays - refresh after a minute

### **Stats.NBA.com Still Using Fallback Data**
- This is normal for some endpoints during off-season
- Real data appears during active NBA season
- Fallback data is realistic and functional

## 🔧 **Advanced Configuration**

### **Custom Domain**
In Vercel dashboard:
1. Go to: Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### **No Configuration Needed**
This app works immediately after deployment:
- ✅ No API keys to manage
- ✅ No environment variables to configure
- ✅ Just deploy and it works!

## 📊 **Monitoring**

Vercel provides:
- ✅ **Analytics** - Page views, performance
- ✅ **Logs** - Function execution logs
- ✅ **Speed Insights** - Real user metrics

Access these in your Vercel dashboard.

## 🎯 **You're Live!**

Your NBA Stats Tracker is now running on Vercel with **real NBA data**!

**Share your app:** `https://your-project.vercel.app`

**Made with:** React + TypeScript + Vite + Stats.NBA.com API

---

## 🆘 **Need Help?**

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **NBA Stats API:** [stats.nba.com](https://stats.nba.com)
- **Check Logs:** Vercel Dashboard → Your Project → Deployments → View Function Logs

Enjoy your live NBA Stats Tracker! 🏀🎉
