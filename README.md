# One Night Pass

A small, friendly study sprint site for exam-eve revision. It's plain HTML, CSS, and JavaScript with no build step, login, backend, or database. The sample differentiation unit is generic demo content, not a claim about your syllabus; replace it with notes from your course before using it to revise.

## Run it

Browsers block local `fetch()` requests from `file://`, so serve the folder over HTTP. From this directory, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Any simple static web server works. KaTeX is loaded from jsDelivr to typeset formulas; the rest of the site and content are local.

## Add a unit

1. Create a folder such as `content/physics/unit-1/`.
2. Add `notes.md`, `formulas.md`, `examples.md`, `exam-tips.md`, `questions.md`, and `flashcards.json`. Markdown supports headings, lists, bold, quotes, inline `$math$`, and display `$$math$$`.
3. Add the unit's metadata to that subject's `units` array in `content/index.json`:

```json
{
  "id": "unit-1",
  "title": "Your unit title",
  "description": "A short friendly intro",
  "badges": ["Must Do", "Easy Marks"],
  "panic": true
}
```

Use a unique folder-safe `id`. The site loads the conventional filenames from that folder; no JavaScript edits are needed. Set `panic: true` on the unit Panic Mode should open. If none is marked, it opens the first unit in the index. In `notes.md`, use `## Pass-Fast Summary` followed by `## Revision Notes` to split those two tabs. Without the second heading, the notes appear in both.

`flashcards.json` is an array like:

```json
[
  { "q": "Question goes here?", "a": "Short answer goes here." }
]
```

## Add memes

The home page picks a random entry from `memes/index.json` on each load. Its ten starter entries are text-and-emoji memes, so they need no image files. For a custom local image, put the image in `memes/` and add an entry such as `{ "file": "my-meme.webp", "caption": "A short caption" }` to the JSON array. Static hosting cannot discover newly dropped files by itself, so the index entry is required. Images are never hotlinked.

## Deploy

The repository includes `vercel.json` for a no-build static deployment. Import the GitHub repository into Vercel and keep the project root as the Root Directory. The site files (`index.html`, `app.js`, and `styles.css`) and the `content/` and `memes/` folders are deployed together, so no build command or output-directory change is needed.

The same files can also be deployed to GitHub Pages or Netlify as a static site.

## Name ideas

- One Night Pass
- Cram & Carry
- The Last-Minute Lab

The site uses **One Night Pass**.