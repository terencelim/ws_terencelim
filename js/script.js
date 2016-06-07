;(function(window, document, undefined) {
    var taglines = ['Loves working with BASH',
                    'Likes to food hack in his spare time',
                    'Eat. Sleep. Disrupt. Repeat.',
                    'I eat Python for breakfast'];
                    //'Is a HUGE fan of IDEATION',
    document.addEventListener("DOMContentLoaded", function() {
        var tagline = document.getElementById('tagline');
        var taglinesLength = (taglines.length - 1);

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getTagline() {
            var randomIndex = getRandomInt(0, taglinesLength);
            var getTagline = taglines[randomIndex];

            tagline.innerHTML = getTagline;
        }

        getTagline();

        setInterval(getTagline, 5000);

    });
})(window, document);
