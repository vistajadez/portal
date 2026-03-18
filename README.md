# Coming Soon — Bootstrap Template

A single-page “coming soon” / author portal template built with Bootstrap and Font Awesome. Use it for a book launch, newsletter signup, or personal landing page.

## Features

- Responsive layout with Bootstrap 5
- “Notify me” email signup (Web3Forms)
- Social links (X, Instagram, Substack, Buy Me a Coffee, etc.)
- Custom cover image and Quicksand font
- Minimal setup: edit `index.html` and `scripts/config.js`

## Quick start

1. **Customize content**  
   Edit `index.html`: title, heading, tagline, and social links.

2. **Configure the signup form**  
   In `scripts/config.js`:
   - Set your Web3Forms access key from [web3forms.com](https://web3forms.com) (free; they email you the key).
   - Optionally set `signupEmail` for your own reference.

3. **Run locally**  
   Open `index.html` in a browser, or use a simple static server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`.

4. **Deploy**  
   Upload the project folder to any static host (GitHub Pages, Netlify, Vercel, etc.) or push to a Git repo and connect it to your host.

## Project structure

```
├── index.html          # Main page — edit copy and links here
├── css/                # Bootstrap, Font Awesome, main.css
├── img/                # Cover image and social icons
├── scripts/
│   ├── config.js       # Web3Forms key and signup email
│   ├── main.js
│   └── notify-form.js  # Form handling
└── styles/             # SCSS source (optional)
```

## Pushing to your Git account

You don’t need a remote repo first. Do this in order:

### 1. Create a new repo on your Git host

- **GitHub:** [github.com/new](https://github.com/new)
- **GitLab:** [gitlab.com/projects/new](https://gitlab.com/projects/new)
- **Bitbucket:** [bitbucket.org/repo/create](https://bitbucket.org/repo/create)

Create the repo **empty** (no README, no .gitignore, no license) so your first push doesn’t conflict.

### 2. Add the remote and push

In your project folder, run (replace `YOUR_REPO_URL` with the URL from step 1):

```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

**Examples:**

- GitHub HTTPS:  
  `git remote add origin https://github.com/yourusername/coming-soon-template.git`
- GitHub SSH:  
  `git remote add origin git@github.com:yourusername/coming-soon-template.git`

Then:

```bash
git push -u origin main
```

After this, `git push` from this repo will go to your account.

## License

See `LICENSE-single.txt` in this repo for the template license terms.
