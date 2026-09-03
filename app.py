#!/usr/bin/env python3
"""
Volume Booster - Python Local Server
Serves static files with Cross-Origin Isolation headers (COOP/COEP)
"""

import http.server
import socketserver
import os
import sys

PORT = 8080

class CrossOriginIsolatedHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable Cross-Origin Isolation for SharedArrayBuffer
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Resource-Policy', 'cross-origin')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CrossOriginIsolatedHandler) as httpd:
        print(f"\n🔊 Volume Booster Python Server is running!")
        print(f"👉 Open in browser: http://localhost:{PORT}")
        print(f"🔒 Cross-Origin-Isolation (COOP/COEP) enabled for SharedArrayBuffer\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == '__main__':
    main()
