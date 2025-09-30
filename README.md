# GitHub Copy for Slack

A little Arc Boost / Chrome extension I vibe coded for sharing pretty GitHub PRs in Slack.

<img width="369" height="93" alt="Screenshot 2025-09-30 at 9 53 47 AM" src="https://github.com/user-attachments/assets/6fbe2119-42a1-4d67-a235-08c37f3454d1" />

<img width="572" height="358" alt="Screenshot 2025-09-30 at 9 54 27 AM" src="https://github.com/user-attachments/assets/4145c008-eb3a-4d95-a8a8-02918fad63f6" />

## Install Locally (Load Unpacked)

> Note: I made this for myself specifically for sharing PRs in the Vercel Slack, so the emojis used are from that Slack workspace. Make sure you have emojis that line up with the ones here, or change the source to include your own emojis.

1. Clone this repository:

   ```bash
   git clone https://github.com/your-user/github-copy-for-slack.git
   cd github-copy-for-slack
   ```

2. Open Chrome and go to `chrome://extensions`.
3. Toggle **Developer mode** on (top-right).
4. Click **Load unpacked** and select the repository folder (the one containing `manifest.json`).
5. Navigate to any GitHub pull request. You should see the **Copy for Slack** button in the header; click it to copy the formatted link. You can also use `Cmd/Ctrl + Shift + Y`.
