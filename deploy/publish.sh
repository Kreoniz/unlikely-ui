#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_HOST:?}" "${DEPLOY_USER:?}" "${DEPLOY_KEY:?}" "${DEPLOY_KNOWN_HOSTS:?}"
: "${RELEASE_ID:?}" "${SITE_URL:?}"
[[ "$RELEASE_ID" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]]
[[ "$DEPLOY_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ ]]

umask 077
credential_dir=$(mktemp -d)
trap 'rm -rf -- "$credential_dir"' EXIT
printf '%s\n' "$DEPLOY_KEY" > "$credential_dir/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$credential_dir/known_hosts"
unset DEPLOY_KEY DEPLOY_KNOWN_HOSTS
ssh_options=(
  -i "$credential_dir/key" -o IdentitiesOnly=yes -o BatchMode=yes
  -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$credential_dir/known_hosts"
  -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=3
)
target="$DEPLOY_USER@$DEPLOY_HOST"
tar -czf - -C .local/showcase . | ssh "${ssh_options[@]}" "$target" "deploy $RELEASE_ID"
if ! python3 deploy/verify.py "$SITE_URL" .local/showcase; then
  echo 'Public verification failed; restoring the previous release.' >&2
  ssh "${ssh_options[@]}" "$target" "rollback $RELEASE_ID"
  exit 1
fi
