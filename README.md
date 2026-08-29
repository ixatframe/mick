# MICK XatSpace

## Live xat presence
The profile now polls `/api/xat-status?user=1984` every 60 seconds.

Expected JSON:
```json
{ "online": true, "group": "Trade", "user": 1984 }
```

When `online` is true the button becomes green and shows Online.
When false it shows Offline.

Important: a static GitHub Pages site cannot independently determine whether an xat ID is online across all groups. The live endpoint must be supplied by a backend connected to a legitimate xat presence source. The frontend is already wired for that endpoint.
