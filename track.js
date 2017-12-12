let global_x = 6.63338
let global_y = 46.45131
let theta = -0.1
let distance_map = []
let tx = window.innerWidth * 0.05
let ty = window.innerWidth * 0.173
let s = window.innerWidth * 3.8
let track_width = window.innerHeight * 0.025

function project(string_x, string_y){
  x = parseFloat(string_x) - global_x
  y = parseFloat(string_y) - global_y

  x = x * Math.cos(theta) - y * Math.sin(theta)
  y = x * Math.sin(theta) + y * Math.cos(theta)

  x = tx + s * x
  y = ty + s * y
  return [x, y]
}

function parse_track(data) {
  for (i = 0; i < data.length - 1; i++) {
    p1 = project(data[i].X, data[i].Y)
    p2 = project(data[i + 1].X, data[i + 1].Y)
    var segment = {
      x1:p1[0],
      x2:p2[0],
      y1:window.innerWidth * image_ratio - p1[1],
      y2:window.innerWidth * image_ratio - p2[1],
    };
    track_segments.push(segment);
  }

  let distance = 0.0;
  let distance_previous = 0.0;

  for (i = 0; i < track_segments.length - 1; i++) {
    dx = track_segments[i].x2 - track_segments[i].x1
    dy = track_segments[i].y2 - track_segments[i].y1
    dx2 = Math.pow(dx, 2);
    dy2 = Math.pow(dy, 2);
    D = Math.sqrt(dx2 + dy2)
    distance_previous = distance;
    distance += D

    index = Math.floor(distance_previous);
    while(index < Math.floor(distance)) {
      fraction = (index - Math.floor(distance_previous)) / D
      x = track_segments[i].x1 + fraction * dx
      y = track_segments[i].y1 + fraction * dy
      dx = track_segments[i].x2 - track_segments[i].x1
      dy = track_segments[i].y2 - track_segments[i].y1
      denom = Math.sqrt(dx * dx + dy * dy)
      u = dx / denom
      v = dy / denom
      if (isNaN(u)) u = 0
      if (isNaN(v)) v = 0
      var point = {x:x, y:y, u:u, v:v};
      distance_map.push(point);
      index = index + 1;
    }
  }
  draw_track();
}

function draw_track(){
  var svg = d3.select("svg");
  lines = svg.selectAll("foo")
  .data(track_segments)
  .enter()
  .append("line")
  .attr("stroke-width", track_width)
  .attr("stroke", "white")
  .attr("x1", d => d.x1)
  .attr("y1", d => d.y1)
  .attr("x2", d => d.x2 - 7)
  .attr("y2", d => d.y2)
}
