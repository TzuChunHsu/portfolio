# TzuChun Hsu - Portfolio

Personal portfolio site, published with GitHub Pages at https://tzuchunhsu.github.io/portfolio/.
Plain HTML, CSS, and JavaScript, so there is no build step.

## Preview locally

```bash
cd /var/www/portfolio
python3 -m http.server 8765
# open http://localhost:8765
```

## Files

- `index.html`: all page content. Sections, in order: hero, About, Career, Experience, Skills, Projects, Activities, Contact.
- `css/style.css`: styles and animations. It is mobile friendly, with breakpoints at 1000px (burger menu), 900px, 768px, and 500px.
- `js/script.js`: sticky header, burger menu, scroll reveal (`.box`), timeline lines, photo glow, card tilt, skills filter, copy-email button, and the "Powered By" CPU pulses.
- `images/skills/`: hexagon icons for the Skills section.
- `images/special/`: photos, project screenshots, and the two project diagrams (`*.svg`).
- `cv/`: resume PDFs. The download button links to `cv/Resume Tzu-Chun Hsu.pdf`.

## Editing tips

- **Hero rotating titles.** Edit the five `.animated-item` spans. The CSS animation is timed for exactly five (10s loop, 2s each).
- **Skills.** Each hexagon is one `<li class="skill" data-category="...">`. Categories: `backend`, `frontend`, `data`, `devops`, `security`, and a tile can have several. With 52 tiles the desktop honeycomb fills evenly (rows of 6 / 7; full counts are 39, 45, 52, 58, 65...). Any other count still works, but the last row will be partly empty.
- **Projects.** The cards sit in two columns. On phones they collapse into one column ordered by each card's `style="--order: N"`, so keep those numbers in reading order when you add a card.

## Credits

- Icons: [Font Awesome Free](https://fontawesome.com/) (CDN), [Devicon](https://devicon.dev/) (MIT, see `images/skills/DEVICON-LICENSE.txt`), and [Simple Icons](https://simpleicons.org/) (CC0).
- Hero illustration: LottieFiles animation, loaded with `@dotlottie/player-component`.
- Fonts: Inter and Pacifico from Google Fonts.
