$(document).ready(function () {
    $('.carousel').carousel({
        interval: false
    });
    var totalQuestions = 0;
    $.getJSON("data/questions.json", function (data) {
        totalQuestions = data.length;
        console.log(totalQuestions)
        for (var i = 0; i < data.length; i++) {
            var question = data[i].question;
            var type = data[i].type;
            var questionHTML = "<div class='item";
            if (i === 0) {
                questionHTML += " active";
            }
            questionHTML += "'><div class='container'><div class='question'><h3>" + question + "</h3>";
            var answer = "";
            var category = "";
            var overlay = "";
            var choices = shuffle(data[i].choices);
            if (type === "image") {
                var imageHTML = "<div class='image row'>";
                for (var j = 0; j < choices.length; j++) {
                    answer = choices[j].answer;
                    category = choices[j].category;
                    overlay = choices[j].overlay;
                    imageHTML += "<div class='col-sm-4'><div class='q-item' tabindex='0' data-category='" + category + "'><div class='image-wrapper'><img src='img/" + answer + "' alt='" + overlay + "'><span>" + overlay + "</span></div></div></div>";
                }
                imageHTML += "</div>";
                questionHTML += imageHTML;
            } else if (type === "text") {
                var textHTML = "<ul>";
                for (var k = 0; k < choices.length; k++) {
                    answer = choices[k].answer;
                    category = choices[k].category;
                    textHTML += "<li class='q-item' tabindex='0' data-category='" + category + "'>" + answer + "</li>"
                }
                textHTML += "</ul>";
                questionHTML += textHTML;
            }
            questionHTML += "</div></div></div>";
            $('#questionsSlider .carousel-inner').append(questionHTML);
        }
    });
    $(document).on('click', '.question .q-item', function () {
        var parent = $(this).parent().parent();
        if (!$(this).hasClass('selected')) {
            parent.find('.selected').removeClass('selected');
            $(this).addClass('selected');
            if (!parent.hasClass('selected')) {
                parent.addClass('selected');
            }
        }
        setTimeout(function () {
            $('.carousel').carousel('next');
        }, 700);
        calculate()
    });
    $(document).on('keyup', 'body', function (e) {
        if (e.which === 37) {
            $('.carousel').carousel('prev');
            setTimeout(function () {
                $('.item.active').focus();
            }, 500);
        }
        if (e.which === 39) {
            $('.carousel').carousel('next');
            setTimeout(function () {
                $('.item.active').focus();
            }, 500);
        }
    });
    $(document).on('keyup', '.question .q-item', function (e) {
        console.log(e.which);
        if (e.which === 13) {
            var parent = $(this).parent().parent();
            if (!$(this).hasClass('selected')) {
                parent.find('.selected').removeClass('selected');
                $(this).addClass('selected');
                if (!parent.hasClass('selected')) {
                    parent.addClass('selected');
                }
            }
            $('.carousel').carousel('next');
            setTimeout(function () {
                $('.item.active').focus();
            }, 500);
            calculate()
        }
    });
    function calculate() {
        if ($('.q-item.selected').length === totalQuestions) {
            var results = [];
            $('.question').each(function () {
                results.push($(this).find('.q-item.selected').attr('data-category'));
            });
            results.sort();
            var finalResult = [];
            var finalResultCatName = [];
            var current = null;
            var cnt = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i] !== current) {
                    if (cnt > 0) {
                        finalResult.push(cnt);
                        finalResultCatName.push(current);
                    }
                    current = results[i];
                    cnt = 1;
                } else {
                    cnt++;
                }
            }
            var maxCat = finalResultCatName[indexOfMax(finalResult)];
            $.getJSON("data/result.json", function (data) {
                for (var o = 0; o < data.length; o++) {
                    if (maxCat === data[o].category) {
                        $('#catName').text(data[o].Name);
                        $('#description').text(data[o].Description);
                        $('#image').attr('src', 'img/' + data[o].Image).attr('alt', data[o].Name);
                        $('#questionsSlider').hide();
                        $('#result').fadeIn('slow');
                    }
                }
            });
        }
    }

    function indexOfMax(arr) {
        if (arr.length === 0) {
            return -1;
        }
        var max = arr[0];
        var maxIndex = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }
        return maxIndex;
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
});