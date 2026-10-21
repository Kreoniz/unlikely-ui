#!/usr/bin/env python3
"""Forced SSH command: publish static files only, with no shell or Docker access."""

import fcntl
import hashlib
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
import tempfile

SITE = Path('/opt/unlikely-ui/site')
RELEASE = re.compile(r'[a-f0-9]{40}-[0-9]{1,20}-[0-9]{1,5}')
MAX_ARCHIVE = 32 * 1024 * 1024
MAX_CONTENT = 128 * 1024 * 1024


def unpack(archive, destination):
    """Reject traversal, links, devices, duplicate paths and oversized archives."""
    seen = set()
    total = 0
    with tarfile.open(archive, 'r:gz') as source:
        members = []
        for member in source:
            members.append(member)
            if len(members) > 5000:
                raise ValueError('Too many archive entries')
            path = PurePosixPath(member.name)
            if path == PurePosixPath('.') and member.isdir():
                continue
            if (path.is_absolute() or not path.parts
                    or any(part.startswith('.') for part in path.parts)
                    or path in seen or not (member.isfile() or member.isdir())):
                raise ValueError('Unsupported archive entry')
            seen.add(path)
            total += member.size
            if total > MAX_CONTENT:
                raise ValueError('Archive content is too large')
        for member in members:
            path = destination / member.name
            if member.isdir():
                path.mkdir(parents=True, exist_ok=True, mode=0o755)
            else:
                path.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
                with source.extractfile(member) as incoming, path.open('xb') as output:
                    shutil.copyfileobj(incoming, output)
                path.chmod(0o644)
    if not (destination / 'index.html').is_file():
        raise ValueError('Missing index.html')
    if not (destination / 'assets').is_dir():
        raise ValueError('Missing assets directory')


def current_target(site, name):
    link = site / name
    if not link.is_symlink():
        return None
    target = os.readlink(link)
    if not target.startswith('releases/') or not RELEASE.fullmatch(target[9:]):
        raise ValueError('Unexpected release link')
    if not (site / target / 'index.html').is_file():
        raise ValueError('Release link has no index')
    return target


def swap(site, name, target):
    pending = site / ('.' + name + '-next')
    pending.unlink(missing_ok=True)
    pending.symlink_to(target)
    pending.replace(site / name)


def publish(site, release, incoming):
    target = site / 'releases' / release
    if target.exists():
        raise ValueError('Release already exists; use a new run attempt')
    with tempfile.TemporaryDirectory(prefix='.upload-', dir=site) as temporary:
        temporary = Path(temporary)
        archive = temporary / 'site.tgz'
        size = 0
        with archive.open('xb') as output:
            while chunk := incoming.read(64 * 1024):
                size += len(chunk)
                if size > MAX_ARCHIVE:
                    raise ValueError('Compressed archive is too large')
                output.write(chunk)
        content = temporary / 'content'
        content.mkdir(mode=0o755)
        unpack(archive, content)
        # Retain immutable chunks so already-open pages survive a new deployment.
        for asset in (content / 'assets').rglob('*'):
            if not asset.is_file():
                continue
            shared = site / 'assets' / asset.relative_to(content / 'assets')
            shared.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
            if shared.exists():
                if hashlib.sha256(shared.read_bytes()).digest() != hashlib.sha256(asset.read_bytes()).digest():
                    raise ValueError('Immutable asset name collision')
            else:
                os.link(asset, shared)
        content.rename(target)
    previous = current_target(site, 'current')
    if previous:
        swap(site, 'previous', previous)
    swap(site, 'current', 'releases/' + release)
    print('Published ' + release)


def rollback(site, release):
    if current_target(site, 'current') != 'releases/' + release:
        raise ValueError('Current release changed; refusing stale rollback')
    previous = current_target(site, 'previous')
    if not previous:
        raise ValueError('No previous release is available')
    swap(site, 'current', previous)
    print('Restored ' + previous)


def main():
    command = os.environ.get('SSH_ORIGINAL_COMMAND', '').split()
    if len(command) != 2 or command[0] not in ('deploy', 'rollback'):
        raise ValueError('Only deploy and rollback are allowed')
    if not RELEASE.fullmatch(command[1]):
        raise ValueError('Invalid release ID')
    os.umask(0o022)
    with (SITE / '.deploy-lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if command[0] == 'deploy':
            publish(SITE, command[1], sys.stdin.buffer)
        else:
            rollback(SITE, command[1])


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, tarfile.TarError) as error:
        print('Deployment rejected: ' + str(error), file=sys.stderr)
        sys.exit(1)
