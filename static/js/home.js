document.querySelectorAll('.period').forEach(function(period) {
    period.addEventListener('click', function() {
        const url = period.getAttribute('data-url');
        changePage(url)
    });
});
