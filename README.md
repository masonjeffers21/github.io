# Mason Jeffers - Portfolio Website

Personal portfolio website showcasing engineering projects, games, and professional experience.

**Live Site:** [masonjeffers.com](https://masonjeffers.com) | [masonjeffers21.github.io](https://masonjeffers21.github.io)

## About

This site is built with Jekyll using the al-folio theme, customized for a software engineering and robotics portfolio. It features project showcases, technical blog posts, and professional CV/resume information.

## Development

### Prerequisites

- Docker (recommended) or Ruby/Jekyll installed locally
- Git

### Running Locally

**Using Docker (Recommended):**

```bash
docker compose pull
docker compose up
```

Access the site at [http://localhost:8080](http://localhost:8080). Changes to files will auto-reload.

**Using Docker Slim:**

```bash
docker compose -f docker-compose-slim.yml up
```

**Without Docker:**

```bash
bundle install
bundle exec jekyll serve
```

Access the site at [http://localhost:4000](http://localhost:4000).

## Deployment

The site automatically deploys via GitHub Actions when changes are pushed to the `main` branch. The workflow builds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves.

**Important:** Never edit the `gh-pages` branch directly. All changes should be made in `main`.

## Project Structure

- `_config.yml` - Site configuration
- `_pages/` - Static pages (about, projects, games, CV)
- `_projects/` - Individual project files
- `_posts/` - Blog posts
- `_news/` - News items for homepage
- `assets/` - Images, CSS, JavaScript
  - `json/resume.json` - Resume data (JSON Resume format)
- `_data/` - Data files (cv.yml, socials.yml, etc.)

## Customization

See [CLAUDE.md](CLAUDE.md) for detailed documentation on content management, configuration, and development guidelines.

## Tech Stack

- **Static Site Generator:** Jekyll 4.x
- **Theme:** al-folio (customized)
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Languages:** Ruby, Liquid, HTML/CSS, JavaScript

## License

The code is available under the MIT License. Original content and projects are © Mason Jeffers.

Built with [al-folio](https://github.com/alshedivat/al-folio), a Jekyll theme for academics.
