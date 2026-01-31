# Next Prime Real Estate – Frontend

## API mode

To use the backend API instead of localStorage:

1. Copy `.env.example` to `.env` and set `VITE_API_URL` (e.g. `http://localhost:5000`).
2. Ensure the backend is running and CORS allows your frontend origin.
3. Log in with your dashboard email and password (e.g. `admin@nextprimerealestate.com` / `admin123`).

When `VITE_API_URL` is set, the main site fetches data from `GET /api/site-data` and the dashboard uses the API for all CRUD. When it is not set, the app uses localStorage as before.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
