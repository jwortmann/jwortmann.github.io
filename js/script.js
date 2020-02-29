$.fn.extend({
    toggleText: function(a, b) {
        return this.text(this.text() == b ? a : b);
    }
});

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
            ($('#checkbox3').prop('checked') && $(this).find('span.steam').length > 0) ||
            ($('#checkbox4').prop('checked') && $(this).find('span.epic-games').length > 0) ||
            ($('#checkbox5').prop('checked') && $(this).find('span.uplay').length > 0) ||
            ($('#checkbox6').prop('checked') && $(this).find('span.origin, span.gog, span.battle-net, span.cd, span.playstation, span.playstation3').length > 0);
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
            ($('#checkbox17').prop('checked') && $(this).attr('genre').indexOf('Sport') >= 0) ||
            ($('#checkbox18').prop('checked') && $(this).attr('genre').indexOf('Strategie') >= 0) ||
            ($('#checkbox19').prop('checked') && $(this).attr('genre').indexOf('Visual Novel') >= 0);
        if (title_filter && played_filter && platform_filter && genre_filter) {
            // $(this).removeClass('scale-out').show();
            // $(this).removeClass('scale-out');
            $(this).fadeIn(300);
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
                        icons_html += '<span class="game-platforms steam" title="Steam"></span>';
                    } else if (platform[j] == "Epic Games") {
                        icons_html += '<span class="game-platforms epic-games" title="Epic Games"></span>';
                    } else if (platform[j] == "Uplay") {
                        icons_html += '<span class="game-platforms uplay" title="Uplay"></span>';
                    } else if (platform[j] == "Origin") {
                        icons_html += '<span class="game-platforms origin" title="Origin"></span>';
                    } else if (platform[j] == "GOG.com") {
                        icons_html += '<span class="game-platforms gog" title="GOG.com"></span>';
                    } else if (platform[j] == "Battle.net") {
                        icons_html += '<span class="game-platforms battle-net" title="Battle.net"></span>';
                    } else if (platform[j] == "Retail") {
                        icons_html += '<span class="game-platforms cd" title="Retail"></span>';
                    } else if (platform[j] == "PlayStation") {
                        icons_html += '<span class="game-platforms playstation" title="PlayStation"></span>';
                    } else if (platform[j] == "PlayStation 2") {
                        icons_html += '<span class="game-platforms playstation" title="PlayStation 2"></span>';
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

            // Dark/Light Theme
            $('#toggle-theme').click(function() {
                document.documentElement.toggleAttribute('light-theme');
                $('#theme-icon').toggleText('wb_sunny', 'brightness_2');
            });
        }
    }
});
