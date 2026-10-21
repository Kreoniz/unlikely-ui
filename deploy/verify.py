"""Compare every public build file with the artifact; no third-party modules."""

from concurrent.futures import ThreadPoolExecutor
import hashlib
from pathlib import Path
import sys
import time
from urllib.parse import quote
from urllib.request import urlopen


def verify(origin, directory):
    files = sorted(path for path in directory.rglob('*') if path.is_file())
    if not files or not (directory / 'index.html').is_file():
        raise ValueError('Missing build output')

    def check(path):
        relative = path.relative_to(directory).as_posix()
        digest = hashlib.sha256(path.read_bytes()).digest()
        url = origin.rstrip('/') + '/' + quote(relative) + '?verify=' + digest.hex()[:16]
        for attempt in range(6):
            try:
                with urlopen(url, timeout=15) as response:
                    if hashlib.sha256(response.read()).digest() != digest:
                        raise ValueError('Public file differs: ' + relative)
                    if relative.startswith('assets/') and 'immutable' not in response.headers.get('Cache-Control', ''):
                        raise ValueError('Asset cache policy is missing')
                return
            except Exception:
                if attempt == 5:
                    raise
                time.sleep(2)

    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(check, files))
    print(f'Verified {len(files)} public files against the build artifact.')


if __name__ == '__main__':
    verify(sys.argv[1], Path(sys.argv[2]))
