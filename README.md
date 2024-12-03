This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Git commands:
# 1. Switch to your working branch
git checkout racheli

# 2. Check branch state and ensure it’s up-to-date
git log

# 3. Pull updates from main branch to stay updated
if everything in the branch is up on git: (HEAD -> racheli == origin/racheli):
    git pull origin main

# 4. Stage and commit changes
git add .
git commit -m "add something"

# 5. Push to the remote branch and ensure no Vercel errors
git push origin racheli

# 6. Update main with the latest changes
git checkout main
git pull origin main
git checkout racheli

# Resolve conflicts if necessary and push updates again
git merge main

# 7. Ensure no errors on Vercel after resolving conflicts
git push origin racheli

# 8. Merge back into main
git checkout main
git merge racheli
git push origin main

# 9. Switch back to your working branch
git checkout racheli

