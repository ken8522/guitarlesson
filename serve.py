"""Small threaded static server for Fretwork.

Two reasons this exists instead of `python -m http.server`:
  * that server drops parallel requests on some setups, which silently truncates
    script files (the Peak Coach project hit this),
  * the tuner needs getUserMedia, and browsers only grant microphone access on
    a secure origin -- http://localhost counts, file:// does not.
"""
import os, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8627
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    # HTTP/1.0: one connection per request. Chattier, but immune to the
    # keep-alive framing problems that silently truncate script files.
    protocol_version = "HTTP/1.0"

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        line = " ".join(str(a) for a in args)
        if "favicon" not in line:
            super().log_message(fmt, *args)


if __name__ == "__main__":
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), partial(Handler, directory=ROOT))
    srv.daemon_threads = True
    print(f"Fretwork serving {ROOT} at http://localhost:{PORT}")
    srv.serve_forever()
