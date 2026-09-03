/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let coepCredentialless = false;
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("message", (ev) => {
        if (!ev.data) {
            return;
        } else if (ev.data.type === "deregister") {
            self.registration
                .unregister()
                .then(() => {
                    return self.clients.matchAll();
                })
                .then((clients) => {
                    clients.forEach((client) => client.navigate(client.url));
                });
        } else if (ev.data.type === "coepCredentialless") {
            coepCredentialless = ev.data.value;
        }
    });

    self.addEventListener("fetch", function (event) {
        const r = event.request;
        if (r.cache === "only-if-cached" && r.mode !== "semi-origin") {
            return;
        }

        const request = (coepCredentialless && r.mode === "no-cors")
            ? new Request(r, {
                credentials: "omit",
            })
            : r;
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy",
                        coepCredentialless ? "credentialless" : "require-corp"
                    );
                    if (!coepCredentialless) {
                        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
                    }
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });
} else {
    (() => {
        const reloadedBySelf = window.sessionStorage.getItem("coiReloadedBySelf");
        window.sessionStorage.removeItem("coiReloadedBySelf");
        const coepDegrading = (reloadedBySelf == "coepdegrade");

        const coi = {
            shouldRegister: () => true,
            shouldDeregister: () => false,
            coepCredentialless: () => false,
            doReload: () => window.location.reload(),
            quiet: false,
            ...window.coi
        };

        const isCrossOriginIsolated = window.crossOriginIsolated;

        if (coi.shouldDeregister()) {
            navigator.serviceWorker && navigator.serviceWorker.controller &&
                navigator.serviceWorker.controller.postMessage({ type: "deregister" });
        }

        if (isCrossOriginIsolated || !navigator.serviceWorker) {
            return;
        }

        if (!coi.shouldRegister()) {
            return;
        }

        navigator.serviceWorker.register(window.document.currentScript.src).then(
            (registration) => {
                if (!coi.quiet) {
                    console.log("COI Service Worker registered: ", registration.scope);
                }

                registration.addEventListener("updatefound", () => {
                    if (!coi.quiet) console.log("Reloading page to enable SharedArrayBuffer...");
                    coi.doReload();
                });

                if (registration.active && !navigator.serviceWorker.controller) {
                    if (!coi.quiet) console.log("Reloading page to enable SharedArrayBuffer...");
                    coi.doReload();
                }
            },
            (err) => {
                if (!coi.quiet) {
                    console.error("COI Service Worker registration error: ", err);
                }
            }
        );
    })();
}
