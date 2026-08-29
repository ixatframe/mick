// Xat presence configuration
// Set STATUS_API_URL to your backend endpoint when deployed.
// Expected JSON: {\"online\": true, \"group\": \"Trade\"}
window.XAT_PRESENCE_CONFIG = {
  userId: 1984,
  pollMs: 60000,
  statusApiUrl: '/api/xat-status'
};
