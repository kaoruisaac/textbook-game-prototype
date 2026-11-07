# Qrio — Stone Age Explorer · Textbook Gaming Prototype

Interactive six-screen demonstration of an **Integrated Learning Mission**: Teacher Intent → Mission Blueprint → Student Explorer → Learning Evidence → Teacher Decision.

**Live preview:** https://textbook-gaming.isaac-lin.cc/

## Demo routes

| Route | Screen |
| --- | --- |
| `/` | Home and role-based demo entry |
| `/teacher/builder` | Teacher materials → confirmed goals → editable Mission Blueprint and mock publication |
| `/mission/demo` | Student mission brief and learning-path choice |
| `/mission/demo/explore` | 5×5 coordinate game, scripted assistant, discoveries, scoring and countdown |
| `/mission/demo/result` | Score, exploration log and next-step navigation |
| `/teacher/evidence/demo` | Source events, possible learning signals and teacher review |

## Run locally

```bash
npm install
npm run dev
npm run build
npm run preview
```

Built with SolidJS, TypeScript and Vite. Try the complete demo from the teacher's upload screen, or jump directly into the student journey.

## Important demo boundaries

- The file picker records **filenames only**. It does not parse, upload, or process document contents.
- The Qrio assistant uses **prewritten prompts and terrain hints**. There are no live AI calls.
- Teacher goals, mission paths, map, ten artefact sites, and scoring are example data.
- Students and Evidence Studio sample traces are explicitly marked **Demo Data**.
- This prototype has **no login, real class publishing, persistent storage, or backend**.
- The 120-second clock begins when the student starts exploring. The demo also has a manual end control for walkthroughs.
- Scores are for gameplay only; teachers review raw decisions and explanations before making learning judgments.

## Source and product planning

- [Original Qrio user stories v0.2](./storybook/Qrio_Stone_Age_Explorer_Hackathon_Workflow_User_Stories.md)
- [Prototype v1 UX proposal](./notes/prototype-v1-page-flow-proposal.md)
- [Living requirements (GitHub snapshot)](./requirements.md)
- [Project notes (GitHub snapshot)](./project.md)

In the Mac mini Docs Assistant Workspace, the canonical source documents live one folder above this repo: `../storybook/`, `../requirements.md`, and `../project.md`. Copies are synced to GitHub when published.
