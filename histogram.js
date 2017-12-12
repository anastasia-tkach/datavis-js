let histogram_data = [];
let num_bins = 75.0
var x_axis, y_axis;
let histogram_timer;
let bars;
let num_genders = 2;
let num_ages = 5;
let num_histograms = 5;
let distances_all_runners = [];

var histogram_margin, histogram_width, histogram_height;

function compute_histogram(){
    let bin_width = 1.0/num_bins
    let bin_counts = new Array(num_bins);
    for (i = 0; i < num_bins; i++) {
      bin_counts[i] = new Array(num_histograms).fill(0);
    }
    max_distance = marathon_distance / 60.0
    for (i = 0; i < runners_data.length; i++) {
      //let distance = circles._groups[0][i].getAttribute("distance");
      //var t =  circles._groups[0][i].getAttribute("t")

      var t = runners_data[i][0]
      if (change_speed == true) {
        var shift = speedup * marathon_distance/(t + 1)
        distances_all_runners[i] = distances_all_runners[i] + shift
      }
      if (change_time == true) {
        distances_all_runners[i] =  runners_datastep * speedup * marathon_distance/(t + 1)
      }
      let distance = distances_all_runners[i] / 10
      //distance = circles._groups[0][i].getAttribute("distance");

      let histogram_index = 0;
      if (gender_classifier) {
        if (runners_data[i][2] == 0)
          histogram_index = 1
      }
      if (age_classifier) {
        var age = runners_data[i][3]
        if (age < 20) histogram_index = 4
        if (age >= 20 && age < 33) histogram_index = 1
        if (age >= 33 && age < 47) histogram_index = 0
        if (age >= 47 && age < 60) histogram_index = 2
        if (age >= 60) histogram_index = 3
      }
      if (experience_classifier) {
        var experience = runners_data[i][4]
        if (experience == 1) histogram_index = 0
        if (experience >= 2 && experience <= 3) histogram_index = 1
        if (experience >= 4) histogram_index = 2
      }

      let normalized_distance = distance / max_distance
      let bin_index = Math.floor(normalized_distance / bin_width);
      if (bin_index > num_bins - 1) bin_index = num_bins - 1;
      bin_counts[bin_index][histogram_index] = bin_counts[bin_index][histogram_index] + 1.0;
    }

    histogram_data = new Array(num_bins * num_histograms);
    let max_value = 0;
    for (var j = 0; j < num_histograms; j++) {
      for (var i = 0; i < num_bins; i++) {
        let k = i + j * num_bins
        histogram_data[k] = new Array(3);
        histogram_data[k][0] = i;
        histogram_data[k][1] = bin_counts[i][j];
        histogram_data[k][2] = j;
        if (histogram_data[k][1] > max_value)
          max_value = histogram_data[k][1]
        }
    }
    for (var i = 0; i < num_bins * num_histograms; i++) {
      histogram_data[i][1] = histogram_data[i][1] / max_value
    }
}

function draw_histogram() {

  compute_histogram();
  var svg = d3.select("svg");

  histogram_margin = {top:  window.innerWidth * image_ratio + 5, right: -17, bottom: 20, left: 12};
  histogram_width = +svg.attr("width") - histogram_margin.left - histogram_margin.right;
  histogram_height = +svg.attr("height") - histogram_margin.top - histogram_margin.bottom;

  x_axis = d3.scaleBand().rangeRound([0, histogram_width]).padding(0.1);
  y_axis = d3.scaleLinear().rangeRound([histogram_height, 0]);

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("transform", "translate(" + histogram_margin.left + "," + histogram_margin.top + ")")
    .attr("fill", "#E7E5E6");

  var g = svg.append("g")
      .attr("transform", "translate(" + histogram_margin.left + "," + histogram_margin.top + ")");

  x_axis.domain(histogram_data.map(function(d) { return d[0]; }));
  let y_limit = d3.max(histogram_data, function(d) { return d[1]; })
  y_axis.domain([0, y_limit]);

  g.append("g")
      .attr("class", "axis_x")
      .attr("transform", "translate(0," + histogram_height + ")")
      .attr("stroke-width", "3px")
      .attr("stroke", "#B8B8B8")
      .attr("stroke-opacity", "0.45")
      .call(d3.axisBottom(x_axis).ticks());

  g.append("g")
      .attr("class", "axis_y")
      .attr("stroke-width", "3px")
      .attr("stroke-opacity", "0.45")
      .call(d3.axisLeft(y_axis).ticks(10, ""))

  bars = g.selectAll(".bar")
    .data(histogram_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x_axis(d[0]))
      .attr("y", d => histogram_height * d[1])
      .attr("bin_index", d => d[0])
      .attr("bin_count", d => d[1])
      .attr("width", x_axis.bandwidth())
      .attr("height", d => histogram_height * (1 - d[1]))
      .attr("fill", "#49ABD1")
      .attr("opacity", "1.0")
      .attr("hist_index", d => d[2]);

  timer = d3.timer(animate_histogram);
}

function animate_histogram() {
  compute_histogram();

  bars.attr("y", function() {
    let bar = d3.select(this)
    var bin_index = parseFloat(bar.attr("bin_index"))
    var hist_index = parseFloat(bar.attr("hist_index"))
    var bin_count = parseFloat(histogram_data[bin_index + hist_index * num_bins][1])
    return histogram_height * (1 - bin_count)
  });
  bars.attr("height", function() {
    let bar = d3.select(this)
    var bin_index = parseFloat(bar.attr("bin_index"))
    var hist_index = parseFloat(bar.attr("hist_index"))
    var bin_count = parseFloat(histogram_data[bin_index + hist_index * num_bins][1])
    return histogram_height * bin_count
  });
  bars.attr("fill", function() {
    let bar = d3.select(this)
    var hist_index = parseFloat(bar.attr("hist_index"))

    var color;
    if (gender_classifier && hist_index == 0) color = "#CA6FA8"
    if (gender_classifier && hist_index == 1) color = "#49ABD1"
    if (gender_classifier && hist_index == 2) color = "#FFFFFF"
    if (gender_classifier && hist_index == 3) color = "#FFFFFF"
    if (gender_classifier && hist_index == 4) color = "#FFFFFF"

    if (age_classifier && hist_index == 4) color = "#89D863"
    if (age_classifier && hist_index == 1) color = "#3CC46C"
    if (age_classifier && hist_index == 0) color = "#49ABD1"
    if (age_classifier && hist_index == 2) color = "#9267C4"
    if (age_classifier && hist_index == 3) color = "#CA6FA8"

    if (experience_classifier && hist_index == 0) color = "#79DA4A"
    if (experience_classifier && hist_index == 1) color = "#00B9A6"
    if (experience_classifier && hist_index == 2) color = "#CA6FA8"
    if (experience_classifier && hist_index == 3) color = "#FFFFFF"
    if (experience_classifier && hist_index == 4) color = "#FFFFFF"

    return color
  });
}
