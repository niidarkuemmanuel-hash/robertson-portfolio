# Robertson Portfolio

## Folder structure

```
robertson-portfolio/
│
├── index.html          ← All your page content (structure)
├── css/
│   └── style.css       ← All styling (colors, layout, fonts)
├── js/
│   └── main.js         ← Animations, form logic, nav highlight
└── images/
    ├── profile.jpg     ← Your profile/headshot photo (400x400px)
    ├── project1.jpg    ← Portfolio project 1 (800x600px)
    ├── project2.jpg    ← Portfolio project 2 (800x600px)
    ├── project3.jpg    ← Portfolio project 3 (800x600px)
    └── project4.jpg    ← Portfolio project 4 (800x600px)
```

---

## How to run it

1. Open the `robertson-portfolio` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. The site opens at `http://localhost:5500`

---

## How to customize

### Change your name / title
Open `index.html` and search for "Robertson" to update your name.

### Change the accent color
Open `css/style.css` and find line:
```css
--accent: #4d9fff;
```
Replace `#4d9fff` with any color you like. It updates everywhere.

### Add your profile photo
- Save your photo as `images/profile.jpg`
- Recommended: 400×400px, square crop, JPG or PNG

### Add portfolio project images
- Save images to the `images/` folder as `project1.jpg`, `project2.jpg`, etc.
- Or change the `src` attribute in `index.html` to match your filenames
- Recommended: 800×600px, JPG or PNG
- Update the project title and description in the `.portfolio-overlay` divs

### Update your contact links
In `index.html`, search for `yourname@gmail.com`, `yourprofile`, `yourusername`
and replace them with your real email and social/freelance profile URLs.

### Connect the contact form to actually send emails
In `js/main.js`, scroll to the **TODO** comment and follow the
Formspree instructions to make the form send real emails for free.

---

## Hosting (free options)

| Service | How |
|---------|-----|
| **Netlify** | Drag the whole folder to netlify.com/drop |
| **GitHub Pages** | Push to a GitHub repo, enable Pages in Settings |
| **Vercel** | Connect your GitHub repo at vercel.com |
