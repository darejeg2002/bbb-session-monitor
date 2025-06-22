# 📊 BigBlueButton Session Monitor

An open-source Moodle plugin to monitor, review, and export BigBlueButton (BBB) session data. Built as a dashboard block, this plugin empowers administrators and course managers with real-time session insights, historical logs, session statistics, and exportable data.

---

## 🧰 Features

- Live dashboard showing all **active BBB sessions** (auto-refresh every 60 seconds).
- View **historical session logs** from the past 48 hours.
- **Export session data** (CSV/XLSX) for up to 120 days.
- Access **session statistics**: participant counts, durations, recordings, and more.
- **Real-time alerts** when new sessions start or fail to sync.
- Direct access to **recordings** and **join links**.
- **Role-aware visibility** (site admins see all, course managers see only their courses).

---

## ✅ Requirements

- Moodle 4.0 – 5.0
- `mod_bigbluebuttonbn` plugin installed and configured
- PHP 7.4 or later
- HTTPS support with a valid SSL certificate (for webhooks)

---

## 📦 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/darejeg2002/bbb-session-monitor.git

Copy to Moodle’s blocks directory:
cp -R bbb-session-monitor /path/to/moodle/blocks/
Complete installation from the Moodle Site Administration > Plugins > Install plugins interface.
Configure webhook support in your BBB server (if applicable).

⚙️ Configuration
Enable/disable polling fallback.
Set data retention limits.
Add allowed IPs for webhook source.
Monitor webhook delivery status via the health dashboard.

🌐 Usage
Add the BigBlueButton Session Monitor block to the Moodle dashboard.
Use filters to explore historical or active sessions.
Export logs by session state, course, time range, or role.
Access recordings and metrics from a centralized interface.
