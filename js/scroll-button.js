$(document).ready(function() {
    $('body').append('<a href="#top" id="scroll-top"><span class="btn-floating"><i class="bx bx-chevrons-up"></i></span></a>');
    $('#scroll-top').hide();
    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('#scroll-top').fadeIn();
            } else {
                $('#scroll-top').fadeOut();
            }
        });
        $('#scroll-top').click(function() {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    });
});
