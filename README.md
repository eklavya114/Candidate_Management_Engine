# Candidate Management Engine (CME)

> A high-fidelity, client-side SPA designed to streamline candidate mock interviews, track interaction histories, and generate automated proof-of-work analytics.

## ⚡ Core Architecture
Engineered with a premium "forensic dark mode" and liquid glassmorphism UI, the CME operates efficiently in the browser using advanced LocalStorage schemas. This eliminates the immediate need for a heavy backend infrastructure during rapid field operations and calling sessions.

## 🚀 Key Features
* **Smart Scheduling & Alerts:** Built-in cron-style background intervals that trigger notifications exactly 5 minutes before a scheduled mock session.
* **Forensic Logging:** Attach visual proof-of-work (screenshots) directly to candidate profiles using automated client-side Base64 image encoding.
* **Command Analytics HUD:** Real-time metrics calculating total mocks conducted, completion rates, and drop-off percentages.
* **Profile Isolation:** Dynamic search filtering to instantly transition from a global timeline to dedicated, single-candidate interaction histories.

## 🛠 Technical Stack
* **Frontend:** React 18 (Hooks, Context API)
* **Styling:** Tailwind CSS (Custom Glassmorphism configuration)
* **Data Persistence:** Client-Side LocalStorage
* **Icons:** Lucide React

## ⚙️ Local Deployment
```bash
# Install dependencies
npm install

# Spin up the local development server
npm run dev
```
