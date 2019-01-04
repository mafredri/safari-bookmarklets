javascript:(function(){
        let loc = window.location.href;
        /* Safari error pages don't expose the URL :(... */
        if (loc === 'safari-resource:/ErrorPage.html') {
                /* I hope they keep their stylized quotes... */
                loc = document.querySelector('.error-message').textContent.split('“‎')[1].split('”')[0];
        }
        window.location = 'http://web.archive.org/web/*/' + loc;
})();void(0);
