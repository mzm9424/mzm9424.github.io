# bit Trade net (BTN)

Responsive cryptocurrency trading portal frontend built with plain HTML, CSS and JavaScript.

## Important
This repository is a **simulated frontend**. It does not connect to a blockchain, exchange, bank, payment processor, or real trading account. Balances, prices, orders, deposits, withdrawals and transaction history are local UI data only.

## Files

- `index.html` — application shell and authentication UI
- `style.css` — responsive dark fintech interface
- `script.js` — routing, UI state, simulated chart, localStorage interactions
- `assets/logo.svg` — BTN logo
- `vercel.json` — Vercel SPA rewrite
- `README.md` — project notes

## Run locally

Open `index.html` in a browser, or use any static server.

Example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub + Vercel

1. Create a GitHub repository.
2. Upload the project files.
3. Import the repository into Vercel.
4. Deploy.
5. Vercel will serve the static application.

No Node.js or npm installation is required for this version.

## Client-side storage

The app uses `localStorage` for the simulated login/profile state and transaction history. Do not put real passwords, private keys, seed phrases, bank credentials or production financial data into this frontend.

## Suggested production architecture

For a real financial application, replace the local simulation with:
- secure server-side authentication
- database-backed user accounts
- server-side authorization
- audited wallet/exchange integrations
- secure secrets management
- transaction signing controls
- rate limiting and fraud monitoring
- logging and monitoring
- independent security testing
