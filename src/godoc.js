javascript:(function(){
        /* This tries to handle most cases on GitHub. */
        const re = /\/((tree|blob|commits?|issues|pull|graphs|settings|network)\/[^/]+|(issues|pulls|projects|wiki|pulse|community|network|settings)$)/;
        const loc = window.location;
        window.location = 'https://godoc.org/'+loc.hostname+loc.pathname.replace(re, '');
})();void(0);
