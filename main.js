//npm install -g http-server
//http-server . -o -c-1

const imageDiv = document.getElementById("image");

const imageSize = {
  width: 2544,
  height: 1315
}
const image_ratio = imageSize.height / imageSize.width

const canvas = d3.select("#image")
.append("canvas")
.attr("width", window.innerWidth)
.attr("height", 0.81 * window.innerHeight);

d3.select("body").append("svg")
.attr("width", window.innerWidth)
.attr("height", 0.81 * window.innerHeight)

const context = canvas.node().getContext("2d");
const image = new Image(imageSize.width, imageSize.height);
image.src = "lausanne_map.png";
image.onload = onLoad;
window.onresize = function(event) {};

let runners_data = [];
let subsampled_runners_data = [];
let track_segments = [];
let cx_array = [];
let circles, timer, lines;

let marathon_distance = 1500 * 60
let runners_datastep = 0

function onLoad() {
  context.drawImage(this, 0, 0, imageSize.width, imageSize.height, 0, 0, window.innerWidth, window.innerWidth * image_ratio);
  d3.csv("data/df_20kmLausanne_count.csv", parse_runners)
  d3.csv("data/track_points.csv", parse_track)
  draw_histogram();
}

function parse_runners(data){
  std = track_width/2
  current_year = 2017
  runners_data = new Array(data.length);
  for (var i = 0; i < data.length; i++) {
    runners_data[i] = new Array(5);
  }
  distances_all_runners = new Array(data.length).fill(0);
  time_all_runners = new Array(data.length).fill(0);

  let max_count = 0
  for (i = 0; i < data.length; i++) {
    let fist_split = data[i].Time.split(' ')[2]
    let second_split = fist_split.split(':');
    let hours = parseInt(second_split[0])
    let minutes = parseInt(second_split[1])
    let seconds = parseInt(second_split[2])
    seconds += 3600 * hours + 60 * minutes

    runners_data[i][0] = seconds
    runners_data[i][1] = -std + Math.random() * 2 * std
    if (data[i].Sex == "F") runners_data[i][2] = 0
    if (data[i].Sex == "M") runners_data[i][2] = 1
    runners_data[i][3] = data[i].RaceYear - data[i].Year
    runners_data[i][4] = data[i].Count
  }
  draw_runners();
}

function draw_runners(){
  var svg = d3.select("svg");

  subsampled_runners_data = [];
  for (var i = 0; i < runners_data.length; i++) {
    let fraction = runners_fraction / 100
    let r = Math.random();
    if (r < fraction)
      subsampled_runners_data.push(runners_data[i])
  }

  svg.selectAll("circle").remove();

  circles = svg.selectAll("foo")
  .data(subsampled_runners_data)
  .enter()
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("rand", d => d[1])
  .attr("distance", 0)
  .attr("r", 3)
  .attr("fill", "green")
  .attr("opacity", "0.75")
  .attr("t", d => d[0])
  .attr("gender", d => d[2])
  .attr("age", d => d[3])
  .attr("experience", d => d[4])

  timer = d3.timer(animate_map);
}

function animate_map() {
  runners_datastep = runners_datastep + 1
  if (runners_datastep < 75)
    document.getElementById("time_slider").value = runners_datastep;
  circles.attr("distance", function() {
    //if (+d3.select(this).attr("distance") > 1500) { timer.stop() }
    let runner = d3.select(this)
    var t = runner.attr("t")
    if (change_speed == true) {
      var shift = speedup * marathon_distance/(t + 1)
      return + runner.attr("distance") + shift
    }
    if (change_time == true) {
      var d =  runners_datastep * speedup * marathon_distance/(t + 1)
      return d
    }
  });
  circles.attr("cx", function() {
    let runner = d3.select(this)
    let distance = runner.attr("distance")
    let index = Math.floor(distance)
    if (index >= distance_map.length) return runner.attr("cx")
    let p = distance_map[index]
    let x = p.x - p.v * parseFloat(runner.attr("rand"))
    return x
  });
  circles.attr("cy", function() {
    let runner = d3.select(this)
    let distance = runner.attr("distance")
    let index = Math.floor(distance)
    if (index >= distance_map.length) return runner.attr("cy")
    let p = distance_map[index]
    let y = p.y + p.u * parseFloat(runner.attr("rand"))
    return y
  });
  if (gender_classifier == true) {
    circles.attr("fill", function() {
      var gender = d3.select(this).attr("gender")
      if (gender == 0) color = "#CA6FA8"
      if (gender == 1) color = "#49ABD1"
      return color
    });
  }
  if (age_classifier == true) {
    circles.attr("fill", function() {
      var age = d3.select(this).attr("age")
      if (age < 20) color = "#89D863"
      if (age >= 20 && age < 33) color = "#3CC46C"
      if (age >= 33 && age < 47) color = "#49ABD1"
      if (age >= 47 && age < 60) color = "#9267C4"
      if (age >= 60) color = "#CA6FA8"
      return color
    });
  }
  if (experience_classifier == true) {
    circles.attr("fill", function() {
      var experience = d3.select(this).attr("experience")
      if (experience == 1) color = "#79DA4A"
      if (experience >= 2 && experience <= 3) color = "#00B9A6"
      if (experience >= 4) color = "#CA6FA8"
      return color
    });
  }

  circles.attr("opacity", function() {
    var gender = d3.select(this).attr("gender")
    var age = d3.select(this).attr("age");
    var experience = d3.select(this).attr("experience")

    opacity = 0.75;
    if (females_only_filter && gender != 0) opacity = 0.0
    if (males_only_filter && gender != 1) opacity = 0.0

    if (ages_7_20_filter && age >= 20) opacity = 0.0
    if (ages_20_33_filter && (age < 20 || age >= 33)) opacity = 0.0
    if (ages_33_47_filter && (age < 33 || age >= 47)) opacity = 0.0
    if (ages_47_60_filter && (age < 47 || age >= 60)) opacity = 0.0
    if (ages_60_filter && (age < 60)) opacity = 0.0

    if (count_1_filter && experience > 1) opacity = 0.0
    if (count_2_5_filter && (experience < 2 || experience > 3)) opacity = 0.0
    if (count_6_filter && experience < 4) opacity = 0.0

    return opacity;
  });


};
