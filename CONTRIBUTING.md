# Contributing to OrderSync Frontend

First off, thank you for considering contributing! 🎉

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Development Setup

```bash
git clone https://github.com/SohaibKhaliq/OrderSync-Frontend.git
cd OrderSync-Frontend
npm install
cp .env.example .env
npm run dev
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm run build` to verify no errors
5. Commit with clear messages
6. Push and open a PR against `master`

## Coding Standards

- Use functional components with React hooks
- Follow existing patterns (SWR for data fetching, Context for state)
- Use Tailwind CSS classes for styling (no CSS modules)
- Use Tabler Icons for icons
- Handle loading, error, and empty states in every view

**Thank you for contributing!** 🚀
