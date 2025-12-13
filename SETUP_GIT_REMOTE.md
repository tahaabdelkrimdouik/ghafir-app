# 🔗 Setting Up Git Remote for Deployment

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `ghafir-app` (or your choice)
3. Choose **Private** or **Public**
4. **DO NOT** check "Add a README" or any other options
5. Click **"Create repository"**

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

### If you created a NEW repository:

```powershell
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ghafir-app.git

# Rename branch to main (optional, but recommended)
git branch -M main

# Push your code
git push -u origin main
```

### If your branch is called `master` (and you want to keep it):

```powershell
# Add the remote
git remote add origin https://github.com/YOUR_USERNAME/ghafir-app.git

# Push to master
git push -u origin master
```

## Step 3: Verify

```powershell
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/ghafir-app.git (fetch)
origin  https://github.com/YOUR_USERNAME/ghafir-app.git (push)
```

## Step 4: Deploy to Vercel

Once your code is on GitHub:

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your `ghafir-app` repository
5. Add environment variables
6. Deploy!

---

## Alternative: Use Existing Repository

If you already have a GitHub repository:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin master
```

Or if the remote already exists but points to wrong URL:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin master
```

