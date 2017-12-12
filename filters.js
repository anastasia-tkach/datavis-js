var gender_classifier = false
let age_classifier = false
let experience_classifier = true

let females_only_filter = false
let males_only_filter = false

let ages_7_20_filter = false
let ages_20_33_filter = false
let ages_33_47_filter = false
let ages_47_60_filter = false
let ages_60_filter = false

let count_1_filter = false
let count_2_5_filter = false
let count_6_filter = false

let change_speed = false
let change_time = true

var speedup = 5
var runners_fraction = 5

document.getElementById("gender").addEventListener("click", function(){
    gender_classifier = true;
    age_classifier = false;
    experience_classifier = false;
});
document.getElementById("age").addEventListener("click", function(){
    age_classifier = true;
    gender_classifier = false;
    experience_classifier = false;
});
document.getElementById("experience").addEventListener("click", function(){
    age_classifier = false;
    gender_classifier = false;
    experience_classifier = true;
});


document.getElementById("females_and_males").addEventListener("click", function(){
    females_only_filter = false;
    males_only_filter = false
});
document.getElementById("females_only").addEventListener("click", function(){
    females_only_filter = true;
    males_only_filter = false
});
document.getElementById("males_only").addEventListener("click", function(){
    females_only_filter = false;
    males_only_filter = true
});
document.getElementById("ages_all").addEventListener("click", function(){
    ages_7_20_filter = false;
    ages_20_33_filter = false;
    ages_33_47_filter = false;
    ages_47_60_filter = false;
    ages_60_filter = false;
});
document.getElementById("ages_7_20").addEventListener("click", function(){
    ages_7_20_filter = true;
    ages_20_33_filter = false;
    ages_33_47_filter = false;
    ages_47_60_filter = false;
    ages_60_filter = false;
});
document.getElementById("ages_20_33").addEventListener("click", function(){
    ages_7_20_filter = false;
    ages_20_33_filter = true;
    ages_33_47_filter = false;
    ages_47_60_filter = false;
    ages_60_filter = false;
});
document.getElementById("ages_33_47").addEventListener("click", function(){
    ages_7_20_filter = false;
    ages_20_33_filter = false;
    ages_33_47_filter = true;
    ages_47_60_filter = false;
    ages_60_filter = false;
});
document.getElementById("ages_47_60").addEventListener("click", function(){
    ages_7_20_filter = false;
    ages_20_33_filter = false;
    ages_33_47_filter = false;
    ages_47_60_filter = true;
    ages_60_filter = false;
});
document.getElementById("ages_60_").addEventListener("click", function(){
    ages_7_20_filter = false;
    ages_20_33_filter = false;
    ages_33_47_filter = false;
    ages_47_60_filter = false;
    ages_60_filter = true;
});

document.getElementById("count_all").addEventListener("click", function(){
    count_1_filter = false;
    count_2_5_filter = false;
    count_6_filter = false;
});
document.getElementById("count_1").addEventListener("click", function(){
  count_1_filter = true;
  count_2_5_filter = false;
  count_6_filter = false;
});
document.getElementById("count_2_5").addEventListener("click", function(){
  count_1_filter = false;
  count_2_5_filter = true;
  count_6_filter = false;
});
document.getElementById("count_6").addEventListener("click", function(){
  count_1_filter = false;
  count_2_5_filter = false;
  count_6_filter = true;
});

function speed_slider_change(new_speedup) {
  speedup = new_speedup;
  change_speed = true; change_time = false;
}

function time_slider_change(new_runners_datastep) {
  runners_datastep = parseFloat(new_runners_datastep);
  change_time = true; change_speed = false;
}

function fraction_slider_change(new_runners_fraction) {
  runners_fraction = parseFloat(new_runners_fraction);
  draw_runners();
}
