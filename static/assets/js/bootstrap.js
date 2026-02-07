(function () {
    // Default Trusted Type policy so Svelte hydration can assign to innerHTML under CSP require-trusted-types-for 'script'.
    if (typeof window.trustedTypes !== 'undefined' && window.trustedTypes.createPolicy) {
        try {
            window.trustedTypes.createPolicy('default', {
                createHTML: function (input) {
                    return input;
                },
            });
        } catch {
            /* policy already exists */
        }
    }

    var t = localStorage.getItem('mifi-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
})();
