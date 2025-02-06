// select all elements with the class 'period' from the document
document.querySelectorAll('.period').forEach(function(period) {
    // add a click event listener to each selected element
    period.addEventListener('click', function() {
        // get the value of the 'data-url' attribute from the clicked element
        const url = period.getAttribute('data-url');
        // changes page to the respective forum
        changePage(url)
    });
});
