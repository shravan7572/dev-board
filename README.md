# DevBoard — Your Developer Profile, One Link

> A public developer profile platform built for developers who ship. Showcase your skills, projects, GitHub activity, and let people reach you — all from a single, beautiful profile URL.

**Live Demo → [dev-boardapp.vercel.app](https://dev-boardapp.vercel.app)**

---

## What is DevBoard?

Most developers have their work scattered across LinkedIn, GitHub, and static portfolio sites. DevBoard brings everything together into one living, breathing profile that updates as you build.

```
dev-boardapp.vercel.app/shravan
```

One link. Everything a recruiter or collaborator needs to know about you.

---

## Features

### Core
- **Public Profile URL** — Every developer gets a unique `dev-boardapp.vercel.app/username` link
- **Skills Showcase** — Add skills with proficiency levels (Beginner / Intermediate / Expert) and categories (Frontend / Backend / DevOps / Database)
- **Project Portfolio** — Showcase projects with thumbnails, tech stack, live links, and GitHub links
- **GitHub Integration** — Contribution graph and top repositories pulled live from GitHub's public API
- **Reaction System** — Visitors can react with 🔥 ❤️ 👏 (toggle-based, IP-tracked to prevent spam)
- **Contact Form** — Built-in contact form that emails the profile owner directly

### Auth & Security
- **JWT Authentication** — Stateless, token-based auth with 7-day expiry
- **Email OTP Verification** — 6-digit OTP sent on signup, expires in 10 minutes, with resend support
- **Bcrypt Password Hashing** — All passwords hashed with salt rounds of 9
- **Zod Validation** — Schema-based input validation on all auth routes with strong password regex enforcement
- **Rate Limiting** — Express rate limiter on all routes to prevent abuse
- **Protected Routes** — Frontend route guards redirect unauthenticated users

### Analytics
- **Profile View Tracking** — Every visit to a public profile is logged with browser, OS, and device info (via ua-parser-js)
- **View Stats Dashboard** — Profile owners can see total views and browser breakdown

### Media
- **Cloudinary Image Upload** — Profile photos and project thumbnails stored on Cloudinary CDN
- **Multer Middleware** — Handles multipart/form-data for file uploads on the backend

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework and build tool |
| TanStack Query | Data fetching, caching, and mutations |
| React Router DOM | Client-side routing and protected routes |
| Axios | HTTP client with token injection |
| Custom Hooks | `useProfile`, `useSkills`, `useProjects`, `useReactions` |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + Bcrypt | Authentication and password hashing |
| Zod | Input validation |
| Multer + Cloudinary | File upload and CDN storage |
| Brevo (Transactional Email) | OTP verification emails |
| ua-parser-js | Analytics — browser, OS, device detection |
| Express Rate Limit | API abuse prevention |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN |

---

## Architecture

```
Browser (React + TanStack Query)
           ↕
      Vercel CDN
           ↕
    Express REST API
           ↕
    ┌──────────────────┐
    │   MongoDB Atlas  │
    │   Cloudinary     │
    │   Brevo Email    │
    │   GitHub API     │
    └──────────────────┘
```

### Frontend Data Flow
```
pages/          → smart components, uses hooks
hooks/          → TanStack Query logic (useQuery + useMutation)
api/            → all axios calls in one place
components/     → reusable UI pieces, receive props only
```

---

## Database Schemas

| Collection | Purpose |
|---|---|
| `userdatas` | User accounts — auth, profile info, social links |
| `skilldatas` | Skills linked to user via userId |
| `projectdatas` | Projects with thumbnails linked to user |
| `reactiondatas` | Visitor reactions (fire/heart/clap) per profile |
| `profileviews` | Analytics — view logs per profile |

---

### Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Fill in your credentials

node index.js
# Server runs on http://localhost:5001
```

### Frontend Setup
```bash
cd client
npm install

# Create .env file
echo "VITE_BASE_URL=http://localhost:5001" > .env

npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

**server/.env**
```
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
BREVO_API_KEY=...
EMAIL_USER=your@gmail.com
```

**client/.env**
```
VITE_BASE_URL=http://localhost:5001
```
---

## Roadmap

- [ ] Google OAuth login
- [ ] Blog / Dev notes section
- [ ] Learning timeline
- [ ] Custom profile themes (purple / blue / green / orange)
- [ ] Follow other developers
- [ ] Search by skill or username
- [ ] Weekly email digest of profile views

---

## Author

**Shravan Choudhary**
Final year BSc Computer Science — Pune

- DevBoard → [dev-boardapp.vercel.app/shravan](https://dev-boardapp.vercel.app/shravan)
- GitHub → [github.com/shravan7572](https://github.com/shravan7572)

---

*Built with the MERN stack. No shortcuts on the backend.*