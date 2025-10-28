# Deploy Your NBA Stats Tracker to Vercel

This guide will help you deploy your app to Vercel (free) where **stats.nba.com will work** and provide real shot charts, game-by-game stats, and play-by-play data!

## 📋 **Prerequisites**

1. A GitHub account (free)
2. A Vercel account (free) - sign up at [vercel.com](https://vercel.com)

## 🚀 **Deployment Steps**

### **Step 1: Push Your Code to GitHub**

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (name it something like `nba-stats-tracker`)
3. **Don't** initialize with README (your code already has one)
4. Click "Create repository"

5. In Replit, open the **Shell** tab and run these commands:

```bash
# Set your GitHub username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add your GitHub repo as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nba-stats-tracker.git

# Push your code
git push -u origin main
```

**If it asks for a password:** GitHub now uses Personal Access Tokens instead of passwords.
- Go to: [github.com/settings/tokens](https://github.com/settings/tokens)
- Click "Generate new token (classic)"
- Give it a name, check "repo" scope, and generate
- Use the token as your password when pushing

### **Step 2: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `nba-stats-tracker` repo and click **"Import"**

5. **Configure Project:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add: `BALLDONTLIE_API_KEY` = `67fd791f-fa2b-4403-a536-4807f5f602c9`
   - (This is your existing API key from Replit)

7. Click **"Deploy"**

### **Step 3: Wait for Deployment** ⏳

Vercel will:
- Install dependencies (~2 minutes)
- Build your app (~1 minute)
- Deploy to a live URL

You'll see a success screen with your live URL like:
`https://nba-stats-tracker-xyz123.vercel.app`

### **Step 4: Test Real Data!** 🎉

Visit your deployed app and:

1. Go to **Players** page
2. Click on any player
3. Go to **Shot Chart** tab
4. Go to **Trends** tab

**You should now see:**
- ✅ Real shot locations from actual NBA games!
- ✅ Real game-by-game performance data!
- ✅ No more "simulated" data!

Check the browser console (F12) - you should see successful API calls to stats.nba.com instead of timeout errors.

## 🔄 **Updating Your App**

Whenever you make changes in Replit:

```bash
# In Replit Shell
git add .
git commit -m "Your update message"
git push
```

Vercel will **automatically** rebuild and redeploy your app! (Usually takes 1-2 minutes)

## 💰 **Cost**

**$0** - Vercel's free tier includes:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN

## 🎯 **What You Get on Vercel**

- ✅ **Real shot charts** with actual X/Y coordinates
- ✅ **Real game-by-game stats** (not simulated trends)
- ✅ **Real play-by-play** descriptions
- ✅ **All existing features** continue working
- ✅ **Faster loading** (Vercel's CDN)
- ✅ **Automatic HTTPS** (secure)

## ❓ **Troubleshooting**

### Build Fails
- Check the Vercel build logs
- Make sure all dependencies are in `package.json`
- Verify Node version compatibility

### Environment Variable Missing
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add `BALLDONTLIE_API_KEY` with your API key

### Stats.nba.com Still Not Working
- Check browser console for errors
- Verify you're on the Vercel deployment (not Replit)
- May need to wait a few minutes after first deploy

## 🎊 **You're Done!**

Your NBA Stats Tracker is now live with **real NBA data** from stats.nba.com!

Share your live URL: `https://your-app.vercel.app` 🏀
