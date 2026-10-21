"""Exercise the SSH receiver against real tar archives in an isolated directory."""

import importlib.util
import io
from pathlib import Path
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


if __name__ == '__main__':
    unittest.main()
