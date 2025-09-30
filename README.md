# GitHub Copy for Slack

A little Arc Boost / Chrome extension I vibe coded for sharing pretty GitHub PRs in Slack.

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
