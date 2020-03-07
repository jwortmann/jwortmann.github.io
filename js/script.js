function parseDate(date) {
    return Sugar.Date(Sugar.Date.create(date.toString())).short('de');
}

function searchfilter() {
    var filter_string = $('#searchfilter').val().toLowerCase();
    $('div#grid').children().each(function() {
        var title_filter = $(this).attr('game-title').toLowerCase().indexOf(filter_string) >= 0;
        var played_filter = 
            ($('#checkbox1').prop('checked') && $(this).attr('played') == 'true') ||
            ($('#checkbox2').prop('checked') && $(this).attr('played') == 'false');
        var platform_filter = 
            ($('#checkbox3').prop('checked') && $(this).find('.steam').length > 0) ||
            ($('#checkbox4').prop('checked') && $(this).find('.epic-games').length > 0) ||
            ($('#checkbox5').prop('checked') && $(this).find('.uplay').length > 0) ||
            ($('#checkbox6').prop('checked') && $(this).find('.origin, .gog, .battle-net, .retail, .playstation, .playstation-2').length > 0);
        var genre_filter = 
            !($('#checkbox7').prop('checked') ||
              $('#checkbox8').prop('checked') ||
              $('#checkbox9').prop('checked') ||
              $('#checkbox10').prop('checked') ||
              $('#checkbox11').prop('checked') ||
              $('#checkbox12').prop('checked') ||
              $('#checkbox13').prop('checked') ||
              $('#checkbox14').prop('checked') ||
              $('#checkbox15').prop('checked') ||
              $('#checkbox16').prop('checked') ||
              $('#checkbox17').prop('checked') ||
              $('#checkbox18').prop('checked') ||
              $('#checkbox19').prop('checked')) ||
            ($('#checkbox7').prop('checked') && $(this).attr('genre').indexOf('Action') >= 0) ||
            ($('#checkbox8').prop('checked') && $(this).attr('genre').indexOf('Adventure') >= 0) ||
            ($('#checkbox9').prop('checked') && $(this).attr('genre').indexOf('Casual') >= 0) ||
            ($('#checkbox10').prop('checked') && $(this).attr('genre').indexOf('Multiplayer') >= 0) ||
            ($('#checkbox11').prop('checked') && $(this).attr('genre').indexOf('Point & Click') >= 0) ||
            ($('#checkbox12').prop('checked') && $(this).attr('genre').indexOf('Puzzle') >= 0) ||
            ($('#checkbox13').prop('checked') && $(this).attr('genre').indexOf('Racing') >= 0) ||
            ($('#checkbox14').prop('checked') && $(this).attr('genre').indexOf('RPG') >= 0) ||
            ($('#checkbox15').prop('checked') && $(this).attr('genre').indexOf('Sandbox') >= 0) ||
            ($('#checkbox16').prop('checked') && $(this).attr('genre').indexOf('Shooter') >= 0) ||
            ($('#checkbox17').prop('checked') && $(this).attr('genre').indexOf('Sports') >= 0) ||
            ($('#checkbox18').prop('checked') && $(this).attr('genre').indexOf('Strategy') >= 0) ||
            ($('#checkbox19').prop('checked') && $(this).attr('genre').indexOf('Visual Novel') >= 0);
        if (title_filter && played_filter && platform_filter && genre_filter) {
            // $(this).removeClass('scale-out').show();
            // $(this).removeClass('scale-out');
            $(this).fadeIn(250);
        } else {
            // $(this).addClass('scale-out').delay(300).hide();
            // $(this).addClass('scale-out');
            $(this).fadeOut(200, function() { $(this).hide(); });
        }
    });
}

$(document).ready(function() {
    var request = new XMLHttpRequest();
    request.open('GET', 'pcgames.json', true);
    request.responseType = 'text';
    request.send(null);
    request.onload = function() {
        if (request.readyState == 4 && request.status == 200) {
            var pcgames = JSON.parse(request.responseText);
            var pcgames_html = [];
            var titles = [];
            var ratings = [];
            var years = [];
            var years_played = [];
            var years_unplayed = [];
            for (let i = 0; i < pcgames.length; i++) {
                var title = pcgames[i]['title'];
                var release = Array.isArray(pcgames[i]['release']) ? Object.values(pcgames[i]['release'][0]) : pcgames[i]['release'];
                var img = pcgames[i].hasOwnProperty('app_id') ? pcgames[i]['app_id'] + 'p.webp' : pcgames[i]['img'];
                var played = pcgames[i].hasOwnProperty('rating');
                var tooltip_html = title;

                if (pcgames[i].hasOwnProperty('mod')) {
                    tooltip_html += ' (' + pcgames[i]['mod'] + ' Mod)';
                }

                tooltip_html += '<br>';
                if (Array.isArray(pcgames[i]['release'])) {
                    for (var j = 0; j < pcgames[i]['release'].length-1; j++) {
                        tooltip_html += Object.keys(pcgames[i]['release'][j]) + ': ' + parseDate(Object.values(pcgames[i]['release'][j])) + '<br>';
                    }
                    tooltip_html += Object.keys(pcgames[i]['release'][pcgames[i]['release'].length-1]) + ': ' + parseDate(Object.values(pcgames[i]['release'][pcgames[i]['release'].length-1]));
                } else {
                    tooltip_html += parseDate(pcgames[i]['release']);
                }

                if (played) {
                    tooltip_html += '<br>';
                    for (let j = 0; j < Math.floor(pcgames[i]['rating']); j++) {
                        tooltip_html += '<i class=\'material-icons\'>star</i>';
                    }
                    if (!Number.isInteger(pcgames[i]['rating'])) {
                        tooltip_html += '<i class=\'material-icons\'>star_half</i>';
                    }
                    for (let j = Math.ceil(pcgames[i]['rating']); j < 5; j++) {
                        tooltip_html += '<i class=\'material-icons\'>star_border</i>';
                    }
                }

                years.push(parseInt(release.slice(0, 4)));
                if (played) {
                    years_played.push(parseInt(release.slice(0, 4)));
                } else {
                    years_unplayed.push(parseInt(release.slice(0, 4)));
                }

                var img_html = '<img class="responsive-img" src="img/' + img + '" alt="' + title + '" title="' + tooltip_html + '">';
                if (pcgames[i].hasOwnProperty('link')) {
                    img_html = '<a href="' + pcgames[i]['link'] + '">' + img_html + '</a>';
                }

                var platform = Array.isArray(pcgames[i]['platform']) ? pcgames[i]['platform'] : [pcgames[i]['platform']];
                var icons_html = '<div class="icon platform-icon">';
                for (var j = 0; j < platform.length; j++) {
                    if (platform[j] == "Steam") {
                        icons_html += '<svg class="steam" width="24" height="24" viewBox="-2 -2 28 28" title="Steam"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>';
                    } else if (platform[j] == "Epic Games") {
                        icons_html += '<svg class="epic-games" width="24" height="24" viewBox="-2 -2 28 28" title="Epic Games"><path d="M3.538 0C2.166 0 1.66.506 1.66 1.878v16.565c0 .155.007.299.019.431.034.302.037.593.317.922.026.038.31.246.31.246.151.076.257.128.43.2l8.334 3.492c.431.197.613.276.926.265H12c.317.011.499-.068.93-.265l8.333-3.492c.174-.072.276-.124.431-.2 0 0 .284-.212.31-.246.28-.329.283-.62.317-.922.012-.132.02-.276.02-.43V1.877C22.34.506 21.833 0 20.461 0zm13.356 3.11h.68c1.134 0 1.686.552 1.686 1.697v1.879h-1.372V4.883c0-.367-.17-.537-.525-.537h-.234c-.367 0-.537.17-.537.537v5.813c0 .366.17.536.537.536h.26c.352 0 .522-.17.522-.536v-2.08h1.376v2.144c0 1.145-.564 1.708-1.701 1.708h-.692c-1.141 0-1.7-.567-1.7-1.708V4.819c0-1.142.559-1.709 1.7-1.709zm-12.188.076H7.82v1.277H6.104v2.604h1.652v1.274H6.104v2.774h1.739v1.274H4.706zm3.817 0h2.196c1.137 0 1.7.567 1.7 1.712v2.445c0 1.145-.563 1.709-1.7 1.709h-.794v3.337H8.523zm4.528 0h1.398v9.203h-1.398zm-3.13 1.24v3.39h.579c.351 0 .521-.17.521-.54v-2.31c0-.37-.17-.54-.521-.54zM6.066 14.58h.208l.046.007h.075l.038.012h.038l.038.011.037.008.034.007.034.008.034.007.038.012.03.007.03.012.038.011.03.015.039.015.034.015.03.02.038.014.026.02.038.018.03.02.034.018.03.023.03.019.03.022.031.023.03.026.03.023-.022.03-.027.027-.022.03-.027.03-.022.027-.023.026-.027.03-.022.03-.023.027-.026.03-.023.03-.027.03-.022.027-.023.03-.026.03-.023.031-.026.026-.023.03-.03-.022-.03-.026-.03-.02-.035-.022-.026-.019-.034-.019-.03-.019-.035-.019-.03-.015-.03-.015-.03-.011-.034-.012-.038-.01-.03-.008-.038-.008-.038-.008-.038-.003h-.041l-.046-.008h-.075l-.038.004h-.038l-.038.011-.034.008-.034.011-.037.011-.03.015-.038.016-.027.018-.03.02-.03.018-.027.023-.026.023-.027.022-.022.027-.03.026-.02.03-.018.027-.023.03-.015.034-.02.03-.018.034-.011.034-.016.034-.01.038-.005.038-.011.034-.008.042v.037l-.007.038v.09l.004.039.003.034.004.037.008.038.011.03.004.038.011.03.012.03.015.039.019.037.015.03.019.03.022.031.023.03.019.027.03.026.023.027.026.022.03.023.03.023.031.019.03.018.034.016.038.015.03.015.038.011.038.012.038.007.037.008.038.004.046.003h.124l.046-.007h.037l.038-.012.038-.007.038-.012.034-.007.034-.015.03-.015.038-.016.023-.015.03-.019v-.347h-.552v-.56h1.247v1.248l-.026.022-.03.023-.027.019-.03.023-.03.018-.03.023-.03.019-.031.019-.038.019-.034.019-.03.019-.038.015-.03.019-.038.015-.038.015-.038.015-.034.015-.034.011-.034.012-.037.011-.034.011-.038.012-.034.007-.038.008-.038.008-.038.007-.037.004-.038.004-.038.004-.045.003-.038.004-.042.004h-.196l-.042-.008h-.038l-.037-.007h-.038l-.038-.012-.038-.007-.038-.008-.037-.007-.03-.012-.038-.007-.038-.012-.034-.015-.034-.011-.038-.015-.034-.015-.038-.015-.03-.016-.038-.018-.026-.02-.038-.018-.027-.02-.03-.018-.03-.023-.03-.023-.034-.022-.023-.023-.03-.023-.027-.026-.026-.023-.027-.026-.022-.027-.027-.026-.022-.03-.023-.027-.019-.03-.023-.03-.019-.03-.018-.03-.02-.035-.018-.03-.015-.034-.015-.034-.016-.034-.015-.034-.011-.03-.015-.034-.008-.034-.011-.034-.008-.038-.011-.034-.008-.038-.003-.034-.008-.038-.004-.034-.003-.038-.004-.037-.004-.038v-.208l.008-.038v-.041l.01-.038v-.038l.012-.038.012-.037.007-.038.011-.034.012-.038.011-.034.015-.038.015-.034.016-.034.015-.034.015-.034.019-.034.019-.03.018-.03.02-.03.018-.03.023-.031.023-.03.022-.03.027-.027.022-.026.023-.027.03-.026.023-.027.03-.023.027-.026.03-.023.03-.022.03-.02.03-.022.03-.019.031-.019.034-.019.038-.019.03-.018.038-.016.034-.015.038-.019.03-.01.038-.012.034-.015.034-.008.034-.011.038-.008.034-.011.037-.008h.038l.038-.011h.038l.038-.008h.037zm11.989.007h.207l.046.008h.075l.038.011h.045l.038.012.034.007.038.008.038.007.034.008.038.011.037.012.03.007.038.015.038.012.03.015.038.015.038.015.034.02.027.014.037.02.034.018.03.019.035.023.03.018.03.023.03.023.03.022-.022.03-.019.031-.023.03-.022.03-.023.034-.019.03-.023.03-.022.031-.02.03-.022.03-.023.03-.022.031-.02.034-.022.03-.026.03-.02.03-.022.031-.03-.023-.034-.019-.03-.018-.03-.023-.035-.015-.03-.02-.038-.014-.026-.015-.038-.016-.03-.015-.03-.011-.034-.015-.038-.011-.038-.012-.038-.011-.041-.008-.038-.007-.038-.008-.038-.004-.037-.004-.034-.003h-.084l-.041.007-.038.008-.038.007-.03.016-.026.015-.034.03-.023.034-.015.034v.094l.019.042.015.023.026.026.038.02.03.018.038.015.038.015.049.015.03.008.03.011.038.008.03.011.038.008.042.011.041.011.042.012.042.007.037.012.042.011.038.008.037.011.038.011.038.012.038.011.034.011.038.012.037.015.038.019.038.015.038.019.038.019.03.019.03.018.034.023.027.02.034.026.026.026.03.03.027.027.019.03.026.038.019.026.015.038.019.026.011.038.012.03.007.038.008.038.007.038.004.038.004.037v.095l-.004.041-.004.038-.003.042-.008.038-.011.037-.008.038-.011.038-.015.034-.015.03-.016.034-.018.03-.023.03-.02.03-.018.031-.026.027-.023.026-.027.023-.03.026-.026.023-.03.023-.03.018-.031.023-.038.019-.03.015-.038.02-.038.014-.037.015-.038.012-.038.011-.03.011-.038.008-.038.008-.03.007-.038.008h-.038l-.037.007h-.038l-.038.008h-.28l-.037-.004-.038-.004-.042-.003-.038-.008-.037-.004-.038-.007-.038-.008-.042-.011-.037-.008-.038-.011-.038-.008-.038-.011-.037-.012-.038-.015-.034-.011-.038-.011-.038-.016-.03-.015-.038-.015-.03-.019-.038-.015-.034-.019-.026-.019-.038-.019-.027-.018-.034-.02-.03-.022-.03-.023-.03-.022-.03-.023-.027-.023-.03-.026.022-.03.027-.027.023-.03.026-.03.023-.027.022-.03.027-.03.023-.027.026-.03.023-.026.026-.03.023-.03.022-.027.027-.03.023-.03.026-.027.027-.03.026.022.038.023.026.023.038.022.03.02.034.022.03.019.035.015.03.019.034.015.038.015.03.015.038.011.03.016.038.01.037.012.038.012.038.007.038.008.038.007h.041l.038.012h.208l.038-.008.037-.008.03-.007.03-.011.027-.016.034-.022.02-.027.018-.03.011-.038v-.087l-.015-.037-.022-.03-.023-.023-.034-.023-.027-.015-.037-.015-.038-.015-.045-.02-.027-.007-.03-.008-.038-.01-.03-.008-.038-.012-.038-.007-.041-.012-.038-.007-.042-.012-.037-.007-.038-.012-.038-.007-.038-.012-.038-.01-.037-.008-.034-.012-.034-.011-.034-.012-.038-.015-.042-.015-.038-.015-.037-.015-.038-.019-.038-.019-.026-.019-.038-.019-.027-.022-.034-.02-.022-.022-.027-.026-.03-.027-.023-.026-.022-.027-.02-.026-.018-.03-.02-.034-.014-.027-.012-.03-.011-.034-.011-.03-.008-.038-.007-.034v-.038l-.008-.038v-.162l.004-.038.004-.038.007-.03.008-.038.011-.03.008-.038.015-.03.015-.038.015-.03.019-.038.019-.03.026-.03.02-.03.03-.03.026-.027.023-.03.034-.027.022-.019.034-.023.03-.022.03-.02.038-.018.03-.015.039-.019.03-.015.038-.012.037-.015.038-.011.027-.008.037-.007.03-.008.038-.007.038-.008.038-.004.038-.004.038-.003zm-9.237.027h.707l.015.034.015.034.015.034.011.038.015.034.015.034.016.034.015.034.011.034.019.037.015.034.015.035.008.034.015.034.019.034.015.037.015.034.011.034.015.034.02.034.01.034.016.038.011.038.015.03.02.038.014.03.015.038.012.038.011.03.019.038.015.03.015.038.011.03.016.038.019.038.015.034.011.034.011.034.015.034.02.034.014.037.016.035.01.034.016.034.015.034.015.034.015.037.012.034.015.034.019.034.015.034.015.034.008.038.015.034.019.034.015.034.011.034.015.034.015.038.02.038.01.03.016.038.011.03.015.038.019.038.015.03.011.038.016.03.011.038.019.03.015.038.011.038.015.03.016.038.018.03.016.038.01.037.012.03.015.038.02.03h-.783l-.02-.033-.01-.034-.016-.034-.015-.038-.011-.034-.015-.034-.015-.034-.012-.034-.015-.034-.015-.034-.011-.034-.015-.038-.015-.034-.012-.034-.015-.034H8.617l-.015.038-.011.03-.015.038-.019.037-.008.03-.015.039-.015.03-.011.038-.015.03-.015.038-.012.03-.015.038-.015.037-.015.03-.011.038h-.775l.015-.037.015-.034.015-.034.012-.038.01-.034.02-.034.015-.034.015-.034.011-.034.015-.038.02-.034.014-.034.012-.034.011-.034.015-.034.02-.038.014-.034.015-.034.012-.034.015-.034.015-.034.015-.038.015-.038.012-.03.015-.038.019-.03.015-.038.011-.037.011-.03.015-.038.02-.03.014-.038.016-.03.01-.038.016-.038.019-.03.011-.038.015-.03.012-.038.015-.038.019-.03.015-.038.011-.03.015-.038.012-.03.019-.038.015-.038.015-.034.011-.034.015-.034.02-.034.014-.034.008-.038.015-.034.015-.034.019-.034.015-.034.011-.034.016-.038.015-.037.015-.03.015-.038.011-.03.015-.038.015-.038.02-.03.014-.038.012-.03.011-.038.015-.03.02-.038.014-.038.012-.03.015-.038.015-.03.019-.038.011-.038.011-.03.016-.038zm2.192.019h.775l.022.03.02.034.022.03.019.034.019.03.019.034.018.03.023.035.019.03.019.03.019.034.019.03.026.034.015.03.02.035.022.03.023.03.015.034.022.03.02.034.014.03.027.035.019.03.019.034.019.03.018.03.023.034.019.03.019.035.019.03.019.034.022.03.02.034.018.03.023-.03.015-.038.023-.026.022-.038.02-.026.014-.038.027-.027.019-.037.015-.027.023-.03.022-.038.02-.026.018-.038.019-.027.023-.037.018-.027.02-.038.018-.026.02-.03.022-.038.019-.027.019-.037.022-.027.02-.038.018-.026.023-.03.019-.038.022-.027.02-.037.018-.027.02-.038.022-.026.019-.038.019-.026h.782v2.789h-.734v-1.64l-.018.026-.023.038-.019.026-.023.03-.019.038-.022.027-.02.03-.022.038-.019.026-.019.03-.026.03-.019.039-.023.026-.019.03-.018.038-.023.026-.019.03-.023.038-.019.027-.022.03-.02.038-.018.026-.023.03-.019.038-.022.027-.023.03-.019.03-.019.038-.023.027-.022.03-.015.038-.027.026-.019.03-.022.038-.02.027h-.014l-.023-.034-.019-.03-.023-.035-.019-.03-.022-.034-.02-.03-.022-.034-.019-.03-.022-.034-.02-.03-.026-.035-.015-.03-.023-.034-.022-.03-.02-.034-.022-.03-.019-.038-.022-.03-.02-.034-.022-.03-.019-.035-.023-.03-.018-.034-.023-.03-.019-.034-.023-.03-.019-.034-.022-.03-.02-.035-.022-.03-.019-.034-.026-.03-.015-.034-.023-.03v1.644h-.725v-2.76zm3.47 0h2.199v.63h-1.47v.447h1.322v.593H15.21v.48h1.489v.631h-2.215v-2.759zm-5.318.854l-.015.038-.012.03-.015.038-.015.037-.011.034-.015.034-.016.038-.015.038-.011.03-.015.038-.015.03-.012.038-.015.038-.015.03-.011.038-.015.03-.015.038-.016.038-.01.03-.016.038-.015.038-.011.03-.016.038h.643l-.015-.038-.012-.034-.015-.038-.015-.034-.011-.034-.015-.034-.015-.038-.012-.034-.015-.034-.015-.034-.011-.034-.015-.038-.012-.034-.015-.034-.015-.034-.011-.034-.015-.037-.015-.038-.012-.03-.015-.038-.015-.038-.011-.034zm-1.15 5.223h8.013l-4.09 1.35z"/></svg>';
                    } else if (platform[j] == "Uplay") {
                        icons_html += '<svg class="uplay" width="24" height="24" viewBox="-2 -2 28 28" title="Uplay"><path d="M23.561 11.989C23.301-.304 6.953-4.89.655 6.634c.282.206.661.477.943.672a11.748 11.748 0 0 0-.976 3.068 11.886 11.886 0 0 0-.184 2.071c0 6.374 5.182 11.556 11.567 11.556s11.556-5.171 11.556-11.556v-.455zM3.29 14.048c-.152 1.247-.054 1.637-.054 1.789l-.282.098c-.108-.206-.369-.932-.488-1.908-.304-3.718 2.233-7.068 6.103-7.697 3.545-.52 6.938 1.68 7.729 4.759l-.282.098c-.087-.087-.228-.336-.77-.878-4.282-4.282-11.003-2.32-11.957 3.74zm11.003 2.082a3.145 3.145 0 0 1-2.591 1.355 3.151 3.151 0 0 1-3.155-3.155 3.159 3.159 0 0 1 2.927-3.144c1.019-.043 1.973.51 2.417 1.398a2.58 2.58 0 0 1-.455 2.949c.293.206.575.401.856.596zm6.58.119c-1.669 3.783-5.106 5.767-8.77 5.713-7.035-.347-9.084-8.466-4.38-11.393l.206.206c-.076.108-.358.325-.791 1.182-.51 1.041-.672 2.081-.607 2.732.369 5.67 8.315 6.83 11.046 1.214C21.057 8.217 11.821.401 3.625 6.374l-.184-.184c2.157-3.382 6.374-4.889 10.396-3.881 6.147 1.55 9.453 7.957 7.035 13.941z"/></svg>';
                    } else if (platform[j] == "Origin") {
                        icons_html += '<svg class="origin" width="24" height="24" viewBox="-2 -2 28 28" title="Origin"><path d="M12.588 3.11c1.189.071 2.352.384 3.417.919 1.031.514 1.95 1.225 2.706 2.094.751.865 1.322 1.853 1.715 2.963.391 1.109.548 2.278.464 3.502-.033.636-.135 1.252-.306 1.848-.167.588-.393 1.159-.674 1.703-.439.849-.929 1.652-1.47 2.412-.538.759-1.125 1.465-1.762 2.118-.638.653-1.313 1.254-2.032 1.802-.719.544-1.471 1.038-2.254 1.479l-.037.026c-.033.018-.071.026-.109.023-.063-.015-.118-.048-.159-.097-.041-.05-.063-.111-.062-.173 0-.029.004-.059.012-.085.008-.023.021-.044.037-.062.277-.393.506-.806.686-1.235.181-.434.303-.885.368-1.359 0-.032-.015-.064-.038-.085-.021-.025-.053-.038-.085-.038-.264.032-.528.053-.795.062-.266.009-.532-.003-.796-.037-1.189-.071-2.353-.385-3.418-.918-1.031-.515-1.949-1.226-2.705-2.095-.754-.87-1.336-1.875-1.715-2.963-.394-1.123-.552-2.314-.465-3.502.033-.636.135-1.252.306-1.848.171-.598.396-1.155.675-1.68.439-.864.931-1.676 1.469-2.436.539-.757 1.125-1.464 1.761-2.118.639-.652 1.314-1.252 2.033-1.8.72-.546 1.47-1.039 2.253-1.479l.038-.025c.033-.02.07-.027.109-.025.065.016.119.051.158.098.043.051.062.106.062.174.001.027-.003.057-.012.084-.007.023-.02.043-.036.061-.273.386-.505.801-.687 1.237-.181.433-.3.885-.366 1.358 0 .033.012.063.036.086.022.024.054.037.085.037.262-.033.527-.053.795-.061.272-.009.536.003.798.035zm-.807 12.367c.922.079 1.838-.231 2.521-.855.72-.639 1.109-1.438 1.176-2.4.078-.928-.232-1.846-.856-2.535-.601-.708-1.472-1.131-2.4-1.162-.927-.078-1.845.232-2.534.855-.709.602-1.132 1.473-1.164 2.4-.078.926.228 1.842.846 2.535.628.725 1.432 1.115 2.411 1.162z"/></svg>';
                    } else if (platform[j] == "GOG.com") {
                        icons_html += '<svg class="gog" width="24" height="24" viewBox="-2 -2 28 28" title="GOG.com"><path d="M7.15 15.24H4.36a.4.4 0 0 0-.4.4v2c0 .21.18.4.4.4h2.8v1.32h-3.5c-.56 0-1.02-.46-1.02-1.03v-3.39c0-.56.46-1.02 1.03-1.02h3.48v1.32zM8.16 11.54c0 .58-.47 1.05-1.05 1.05H2.63v-1.35h3.78a.4.4 0 0 0 .4-.4V6.39a.4.4 0 0 0-.4-.4H4.39a.4.4 0 0 0-.41.4v2.02c0 .23.18.4.4.4H6v1.35H3.68c-.58 0-1.05-.46-1.05-1.04V5.68c0-.57.47-1.04 1.05-1.04H7.1c.58 0 1.05.47 1.05 1.04v5.86zM21.36 19.36h-1.32v-4.12h-.93a.4.4 0 0 0-.4.4v3.72h-1.33v-4.12h-.93a.4.4 0 0 0-.4.4v3.72h-1.33v-4.42c0-.56.46-1.02 1.03-1.02h5.61v5.44zM21.37 11.54c0 .58-.47 1.05-1.05 1.05h-4.48v-1.35h3.78a.4.4 0 0 0 .4-.4V6.39a.4.4 0 0 0-.4-.4h-2.03a.4.4 0 0 0-.4.4v2.02c0 .23.18.4.4.4h1.62v1.35H16.9c-.58 0-1.05-.46-1.05-1.04V5.68c0-.57.47-1.04 1.05-1.04h3.43c.58 0 1.05.47 1.05 1.04v5.86zM13.72 4.64h-3.44c-.58 0-1.04.47-1.04 1.04v3.44c0 .58.46 1.04 1.04 1.04h3.44c.57 0 1.04-.46 1.04-1.04V5.68c0-.57-.47-1.04-1.04-1.04m-.3 1.75v2.02a.4.4 0 0 1-.4.4h-2.03a.4.4 0 0 1-.4-.4V6.4c0-.22.17-.4.4-.4H13c.23 0 .4.18.4.4zM12.63 13.92H9.24c-.57 0-1.03.46-1.03 1.02v3.39c0 .57.46 1.03 1.03 1.03h3.39c.57 0 1.03-.46 1.03-1.03v-3.39c0-.56-.46-1.02-1.03-1.02m-.3 1.72v2a.4.4 0 0 1-.4.4v-.01H9.94a.4.4 0 0 1-.4-.4v-1.99c0-.22.18-.4.4-.4h2c.22 0 .4.18.4.4zM23.49 1.1a1.74 1.74 0 0 0-1.24-.52H1.75A1.74 1.74 0 0 0 0 2.33v19.34a1.74 1.74 0 0 0 1.75 1.75h20.5A1.74 1.74 0 0 0 24 21.67V2.33c0-.48-.2-.92-.51-1.24m0 20.58a1.23 1.23 0 0 1-1.24 1.24H1.75A1.23 1.23 0 0 1 .5 21.67V2.33a1.23 1.23 0 0 1 1.24-1.24h20.5a1.24 1.24 0 0 1 1.24 1.24v19.34z"/></svg>';
                    } else if (platform[j] == "Battle.net") {
                        icons_html += '<svg class="battle-net" width="24" height="24" viewBox="-2 -2 28 28" title="Battle.net"><path d="M10.457 0c-.516.02-.859.314-1.053.523-.807.87-1.136 2.298-1.168 3.952-.304-.522-.72-1.061-1.199-1.198a.905.905 0 00-.172-.03c-.958-.138-1.768 1.393-1.66 3.812-1.8.064-3.33.268-4.363.525-.182.045-.312.1-.42.154-.075.035-.128.07-.18.104-.162.106-.234.199-.234.199.47-.177 2.358-.495 5.234-.387l-.004-.045h.006c.126 1.29.502 2.789 1.235 4.409v.003l-.024-.044c-.456.721-1.792 2.923-2.217 4.58-.277 1.081-.202 1.772.014 2.218.262.59.764.776 1.08.848 1.173.268 2.6-.176 4.068-.998-.316.537-.603 1.204-.476 1.709a.881.881 0 00.058.162c.363.897 2.091.832 4.131-.47.948 1.51 1.882 2.72 2.616 3.48.13.136.243.223.345.289.277.195.467.205.467.205-.387-.316-1.598-1.78-2.934-4.303l-.035.028c0-.002-.003-.005-.004-.006 1.064-.76 2.186-1.847 3.23-3.31h.003l-.028.038-.002.004c.896.034 3.41.08 5.03-.373 1.07-.299 1.63-.706 1.91-1.115.383-.523.293-1.054.197-1.365-.354-1.15-1.448-2.16-2.892-3.022.622.005 1.342-.08 1.714-.441a.884.884 0 00.116-.139c.587-.764-.335-2.227-2.479-3.34.834-1.576 1.417-2.989 1.71-4.004.05-.179.067-.319.073-.44.032-.339-.054-.509-.054-.509-.08.493-.743 2.271-2.26 4.69l.041.02-.002.003c-1.19-.54-2.693-.968-4.482-1.14l-.002-.003.05.004c-.418-.793-1.633-2.992-2.834-4.168-.792-.775-1.426-1.058-1.92-1.097a1.532 1.532 0 00-.23-.012zm1.172 2.643c.461.008.936.364 1.328.738.491.47 1.111 1.374 1.412 1.83-.083-.003-.161-.014-.246-.016-1.863-.047-3.216.366-4.195.98.06-1.543.419-2.8 1.238-3.374a.847.847 0 01.463-.158zM7.514 4.71c.03 0 .06.007.09.012.256.07.471.338.642.642.023.563.075 1.144.15 1.733a34.71 34.71 0 00-1.988-.06c.041-1.377.428-2.31 1.106-2.327zm5.478 1.21c.244-.007.494-.003.752.013 2.092.125 4.045.717 5.45 1.443-.33.486-.696.993-1.09 1.514-.601-1.09-1.467-1.74-1.868-1.91-.349-.15-.422-.14-.422-.14s.033-.01.57.413c.579.455 1.046 1.106 1.376 1.805a33.723 33.723 0 00-5.405-1.489 30.386 30.386 0 00-1.847-.283c-.002.011-.002.033-.004.045l-.025-.004c-.016.111-.036.277-.05.46-.014.2-.02.358-.023.452.157.03.316.058.475.09 2.275.45 5.224 1.381 7.363 2.596.034 1.103-.325 2.417-1.19 3.726-1.154 1.75-2.644 3.147-3.976 4a35.941 35.941 0 01-.767-1.705c1.266.037 2.282-.395 2.634-.66.3-.224.33-.294.33-.297-.001.004-.03.044-.64.287-.696.278-1.51.356-2.293.285a33.748 33.748 0 003.988-3.931c.408-.478.797-.967 1.168-1.46l-.035-.025.016-.019a7.198 7.198 0 00-.754-.518l-.315.366c-1.522 1.74-3.794 3.819-5.91 5.066-.964-.525-1.913-1.49-2.61-2.88-.936-1.874-1.4-3.863-1.474-5.442.573.042 1.183.106 1.816.185-.644 1.066-.775 2.144-.722 2.576.045.372.09.43.092.432-.002-.002-.022-.046.072-.697.105-.728.432-1.46.873-2.094a33.707 33.707 0 001.414 5.422c.21.593.437 1.173.678 1.74l.039-.015.011.023c.105-.042.258-.107.422-.187.181-.088.32-.162.403-.208-.054-.15-.108-.303-.16-.457-.748-2.194-1.414-5.212-1.432-7.671.784-.486 1.833-.808 3.07-.846zm6.793 1.788c1.172.724 1.788 1.526 1.465 2.121-.182.264-.605.323-1.025.307a20.285 20.285 0 00-1.504-.7c.383-.582.738-1.162 1.064-1.728zm-1.033 3.518c1.307.823 2.215 1.76 2.303 2.757a.85.85 0 01-.096.485.987.987 0 01-.11.154c-.273.303-.743.49-1.19.621-.653.19-1.746.277-2.292.31.045-.07.09-.132.135-.204.973-1.59 1.293-2.968 1.25-4.123zM6.93 12.936c.046.088.084.173.133.261.883 1.626 1.907 2.59 2.921 3.133-1.374.727-2.647 1.051-3.558.627a.852.852 0 01-.453-.5c-.123-.388-.052-.888.058-1.34.166-.68.662-1.71.899-2.181zm4.6 4.273c.313.625.637 1.223.964 1.789-1.212.652-2.212.785-2.566.207-.017-.027-.026-.059-.037-.088-.075-.28.08-.633.283-.955.453-.29.907-.611 1.355-.953Z"/></svg>';
                    } else if (platform[j] == "Retail") {
                        icons_html += '<svg class="retail" width="24" height="24" viewBox="-26 -18 548 548" title="Retail"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zM88 256H56c0-105.9 86.1-192 192-192v32c-88.2 0-160 71.8-160 160zm160 96c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z"/></svg>';
                    } else if (platform[j] == "PlayStation") {
                        icons_html += '<svg class="playstaytion" width="24" height="24" viewBox="-2 -2 28 28" title="PlayStation"><path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.876c2.441 1.193 4.362-.002 4.362-3.153 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.391-1.502h-.002zm4.656 16.242l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.499v-2.385l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.029 5.437.661 1.848.601 2.041 1.472 1.576 2.072s-1.622 1.036-1.622 1.036l-8.544 3.107v-2.297l.02-.023zM1.808 18.6c-1.9-.545-2.214-1.668-1.352-2.321.801-.585 2.159-1.051 2.159-1.051l5.616-2.013v2.313L4.206 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.248 17v2.074c-.121.029-.256.044-.391.073-1.938.331-3.995.196-6.037-.479l-.012-.068z"/></svg>';
                    } else if (platform[j] == "PlayStation 2") {
                        icons_html += '<svg class="playstaytion-2" width="24" height="24" viewBox="-2 -2 28 28" title="PlayStation 2"><path d="M7.46 13.779v.292h4.142v-3.85h3.796V9.93h-4.115v3.85zm16.248-3.558v1.62h-7.195v2.23H24v-.292h-7.168v-1.646H24V9.929h-7.487v.292zm-16.513 0v1.62H0v2.23h.292v-1.938H7.46V9.929H0v.292Z"/></svg>';
                    }
                }
                icons_html += '</div>';
                if (pcgames[i].hasOwnProperty('patch')) {
                    icons_html += '<a href="' + pcgames[i]['patch'] + '"><i class="material-icons icon patch-icon" title="Patch">healing</i></a>';
                }

                var html_str = '<div class="col s6 m3 xl2 scale-transition" game-title="' + title + '" release="' + release + '" played="' + played.toString() + '" genre="' + pcgames[i]['genre'].join(', ') + '"><div class="img-container">' + img_html + icons_html + '<div class="shine-effect"></div></div></div>';

                pcgames_html.push(html_str);
                titles.push(title);
                ratings.push(pcgames[i].hasOwnProperty('rating') ? pcgames[i]['rating'] : 0);
            }

            // Sort by titles and ratings
            var title_idx = Array.from(Array(titles.length).keys()).sort((a, b) => titles[a] < titles[b] ? -1 : (titles[b] < titles[a]) | 0);
            var rating_idx = Array.from(Array(ratings.length).keys()).sort((a, b) => ratings[a] > ratings[b] ? -1 : (ratings[b] > ratings[a]) | 0);

            for (let i of pcgames_html) {
                $('div#grid').append(i);
            }

            // Tooltips
            tippy('[title]', {
                placement: "top",
                arrow: true,
                arrowType: "round",
                animation: "scale",
                theme: "translucent"
            });

            // Dropdown
            $('.dropdown-trigger#btn1').dropdown({ 'constrainWidth': false, 'closeOnClick': false });
            $('.dropdown-trigger#btn2').dropdown({ 'constrainWidth': false });

            // Searchfields
            document.getElementById('searchfilter').value = "";
            $('#searchfilter').keyup(function() {
                searchfilter();
            });
            $('#clear').click(function() {
                document.getElementById('searchfilter').value = "";
                searchfilter();
            });

            // Checkboxes
            $('input[type="checkbox"]').prop('checked', false);
            $('#checkbox1, #checkbox2, #checkbox3, #checkbox4, #checkbox5, #checkbox6').prop('checked', true);

            $('input[type="checkbox"]').change(function() { searchfilter(); });

            $('#sort_release').click(function() {
                $('div#grid').children().remove();
                for (let i of pcgames_html) {
                    $('div#grid').append(i);
                }
                tippy('[title]', { placement: "top", arrow: true, arrowType: "round", animation: "scale", theme: "translucent" });
                searchfilter();
            });

            $('#sort_title').click(function() {
                $('div#grid').children().remove();
                for (let i of title_idx) {
                    $('div#grid').append(pcgames_html[i]);
                }
                tippy('[title]', { placement: "top", arrow: true, arrowType: "round", animation: "scale", theme: "translucent" });
                searchfilter();
            });

            $('#sort_rating').click(function() {
                $('div#grid').children().remove();
                for (let i of rating_idx) {
                    $('div#grid').append(pcgames_html[i]);
                }
                tippy('[title]', { placement: "top", arrow: true, arrowType: "round", animation: "scale", theme: "translucent" });
                searchfilter();
            });

            var chart_labels = [];
            var year_min = Math.min(...years);
            var year_max = Math.max(...years);
            for (i = year_min; i <= year_max; i++) {
                chart_labels.push(i.toString());
            }
            var chart_data1 = new Array(chart_labels.length).fill(0);
            var chart_data2 = new Array(chart_labels.length).fill(0);
            for (let i of years_played) {
                chart_data1[i - year_min]++;
            }
            for (let i of years_unplayed) {
                chart_data2[i - year_min]++;
            }

            Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
            Chart.defaults.global.defaultFontFamily = 'Ubuntu';
            Chart.defaults.global.defaultFontSize = 13;
            Chart.defaults.global.plugins.rough.roughness = 0;
            Chart.defaults.global.plugins.rough.bowing = 0;

            chart = new Chart(
                document.getElementById('canvas').getContext('2d'),
                {
                    type: 'bar',
                    data: {
                        labels: chart_labels,
                        datasets: [{
                            label: 'Bereits gespielt',
                            backgroundColor: getComputedStyle(document.body).getPropertyValue('--primary-color-variant').trim(),
                            borderColor: getComputedStyle(document.body).getPropertyValue('--primary-color').trim(),
                            borderWidth: 1,
                            data: chart_data1
                        }, {
                            label: 'Noch nicht gespielt',
                            backgroundColor: getComputedStyle(document.body).getPropertyValue('--secondary-color-variant').trim(),
                            borderColor: getComputedStyle(document.body).getPropertyValue('--secondary-color').trim(),
                            borderWidth: 1,
                            data: chart_data2
                        }],
                    },
                    options: {
                        legend: {
                            position: 'top'
                        },
                        scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                        },
                        tooltips: {
                            mode: 'index'
                        }
                    },
                    plugins: [ChartRough]
                }
            );

            // Toggle theme
            $('#toggle-theme').click(function() {
                if (document.body.getAttribute('theme') == 'light') {
                    document.body.setAttribute('theme', 'dark');
                    $('#theme-icon').text('wb_sunny');
                } else {
                    document.body.setAttribute('theme', 'light');
                    $('#theme-icon').text('brightness_2');
                }
                Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
                chart.update();
            });

            // Set initial theme
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.body.setAttribute('theme', 'light');
                $('#theme-icon').text('brightness_2');
            } else {
                document.body.setAttribute('theme', 'dark');
                $('#theme-icon').text('wb_sunny');
            }
        }
    }
});
