function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

document.getElementById('scroll-btn').addEventListener('click', () => {
    window.scroll({
        top: document.querySelector('#demo').offsetTop,
        left: 0,
        behavior: 'smooth'
    });
});

// trigger plugin extensionless mode
SIMPLYSANSKRIT_NOPLUGIN = true;
SIMPLYSANSKRIT_PATH = 'js/simplySanskrit';
