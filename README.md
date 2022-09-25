# Warp10 Sandbox


## Launch warp10 container

```bash
  docker compose up -d
```

## Generate Token for Warp10

```bash
  docker exec -u warp10 -it warp10 warp10-standalone.sh worf app.local 31536000000 > token.json
```
