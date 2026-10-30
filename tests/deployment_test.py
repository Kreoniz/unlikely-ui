"""Exercise the SSH receiver against real tar archives in an isolated directory."""

import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('receive', Path(__file__).resolve().parents[1] / 'deploy/receive.py')
receive = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receive)


def archive(entries):
    result = io.BytesIO()
    with tarfile.open(fileobj=result, mode='w:gz') as output:
        for name, value in entries:
            member = tarfile.TarInfo(name)
            if isinstance(value, bytes):
                member.size = len(value)
                output.addfile(member, io.BytesIO(value))
            else:
                member.type = value[0]
                member.linkname = '../../outside'
                output.addfile(member)
    result.seek(0)
    return result


class DeploymentTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.site = Path(self.temporary.name)
        (self.site / 'releases').mkdir()

    def test_rejects_unsafe_archives_without_writing_files(self):
        for name, value in [
            ('../outside', b'escape'), ('/outside', b'escape'),
            ('.env', b'secret'), ('assets/link', (tarfile.SYMTYPE,)),
            ('assets/link', (tarfile.LNKTYPE,)), ('device', (tarfile.CHRTYPE,)),
        ]:
            with self.subTest(name=name, value=value):
                payload = self.site / 'unsafe.tgz'
                payload.write_bytes(archive([('index.html', b'index'), (name, value)]).read())
                destination = self.site / 'unpacked'
                destination.mkdir(exist_ok=True)
                with self.assertRaises(ValueError):
                    receive.unpack(payload, destination)
                self.assertEqual(list(destination.iterdir()), [])

    def test_rejects_duplicate_paths_and_oversized_content(self):
        payload = self.site / 'invalid.tgz'
        destination = self.site / 'unpacked'
        destination.mkdir()
        payload.write_bytes(archive([('index.html', b'a'), ('./index.html', b'b')]).read())
        with self.assertRaises(ValueError):
            receive.unpack(payload, destination)
        payload.write_bytes(archive([('index.html', b'four')]).read())
        with patch.object(receive, 'MAX_CONTENT', 3), self.assertRaises(ValueError):
            receive.unpack(payload, destination)

    def test_promotion_rollback_and_immutable_assets(self):
        first, second, third = [letter * 40 + '-1-1' for letter in 'abc']
        receive.publish(self.site, first, archive([('index.html', b'first'), ('assets/old.js', b'old')]))
        receive.publish(self.site, second, archive([('index.html', b'second'), ('assets/new.js', b'new')]))
        self.assertEqual((self.site / 'current/index.html').read_bytes(), b'second')
        self.assertEqual((self.site / 'previous/index.html').read_bytes(), b'first')
        self.assertEqual((self.site / 'assets/old.js').read_bytes(), b'old')
        with self.assertRaises(ValueError):
            receive.publish(self.site, third, archive([('index.html', b'bad'), ('assets/old.js', b'changed')]))
        self.assertEqual((self.site / 'current/index.html').read_bytes(), b'second')
        with self.assertRaises(ValueError):
            receive.rollback(self.site, first)
        receive.rollback(self.site, second)
        self.assertEqual((self.site / 'current/index.html').read_bytes(), b'first')
        self.assertEqual((self.site / 'assets/new.js').read_bytes(), b'new')


class PublishClientTest(unittest.TestCase):
    """Stub transport/verification only; never contact a server or read credentials."""

    def run_client(self, phase, rollback_fails=False):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / '.local/showcase').mkdir(parents=True)
            (root / '.local/showcase/index.html').write_text('fixture')
            (root / 'bin').mkdir()
            (root / 'deploy').mkdir()
            log = root / 'calls.jsonl'
            ssh = root / 'bin/ssh'
            ssh.write_text(f'#!{sys.executable}\n' + '''
import json, os, pathlib, sys
command = sys.argv[-1]
root = pathlib.Path.cwd()
with open(os.environ['PUBLISH_TEST_LOG'], 'a') as log:
    log.write(json.dumps({'command': command, 'key': sys.argv[sys.argv.index('-i') + 1]}) + '\\n')
if command.startswith('deploy '):
    sys.stdin.buffer.read()
    if os.environ['PUBLISH_TEST_PHASE'] != 'before':
        (root / 'promoted').touch()
    if os.environ['PUBLISH_TEST_PHASE'] in ('before', 'after'):
        sys.exit(255)
else:
    if os.environ['PUBLISH_TEST_ROLLBACK_FAIL'] == '1' or not (root / 'promoted').exists():
        sys.exit(1)
    (root / 'promoted').unlink()
''')
            ssh.chmod(0o755)
            (root / 'deploy/verify.py').write_text('''
import json, os, sys
with open(os.environ['PUBLISH_TEST_LOG'], 'a') as log:
    log.write(json.dumps({'command': 'verify'}) + '\\n')
sys.exit(1 if os.environ['PUBLISH_TEST_PHASE'] == 'verification' else 0)
''')
            release = 'a' * 40 + '-1-1'
            environment = {
                **os.environ,
                'PATH': str(root / 'bin') + os.pathsep + os.environ['PATH'],
                'DEPLOY_HOST': 'fixture.invalid', 'DEPLOY_USER': 'fixture',
                'DEPLOY_KEY': 'fake-test-key', 'DEPLOY_KNOWN_HOSTS': 'fake-test-host',
                'RELEASE_ID': release, 'SITE_URL': 'https://fixture.invalid',
                'PUBLISH_TEST_PHASE': phase,
                'PUBLISH_TEST_ROLLBACK_FAIL': '1' if rollback_fails else '0',
                'PUBLISH_TEST_LOG': str(log),
            }
            script = Path(__file__).resolve().parents[1] / 'deploy/publish.sh'
            result = subprocess.run(['bash', str(script)], cwd=root, env=environment, capture_output=True, text=True)
            calls = [json.loads(line) for line in log.read_text().splitlines()]
            for call in calls:
                if 'key' in call:
                    self.assertFalse(Path(call['key']).parent.exists(), 'credential directory must be cleaned')
            return result, [call['command'] for call in calls], (root / 'promoted').exists(), release

    def test_failure_before_promotion_requests_guarded_reconciliation(self):
        result, calls, promoted, release = self.run_client('before')
        self.assertEqual(result.returncode, 255)
        self.assertEqual(calls, [f'deploy {release}', f'rollback {release}'])
        self.assertFalse(promoted)
        self.assertIn('needs reconciliation', result.stderr)

    def test_failure_after_promotion_requests_rollback(self):
        result, calls, promoted, release = self.run_client('after')
        self.assertEqual(result.returncode, 255)
        self.assertEqual(calls, [f'deploy {release}', f'rollback {release}'])
        self.assertFalse(promoted)

    def test_verification_failure_requests_rollback(self):
        result, calls, promoted, release = self.run_client('verification')
        self.assertEqual(result.returncode, 1)
        self.assertEqual(calls, [f'deploy {release}', 'verify', f'rollback {release}'])
        self.assertFalse(promoted)

    def test_failed_rollback_preserves_failure_and_reports_uncertainty(self):
        result, calls, promoted, release = self.run_client('after', rollback_fails=True)
        self.assertEqual(result.returncode, 255)
        self.assertEqual(calls[-1], f'rollback {release}')
        self.assertTrue(promoted)
        self.assertIn('needs reconciliation', result.stderr)

    def test_success_verifies_without_rollback(self):
        result, calls, promoted, release = self.run_client('success')
        self.assertEqual(result.returncode, 0)
        self.assertEqual(calls, [f'deploy {release}', 'verify'])
        self.assertTrue(promoted)


if __name__ == '__main__':
    unittest.main()
