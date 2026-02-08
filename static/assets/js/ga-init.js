(function () {
    var script = document.currentScript;
    var id = script && script.getAttribute('data-ga-id');
    if (!id) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true });
})();
