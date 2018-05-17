import * as d3 from 'd3';

const margin = {"top": 20, "left":20,"right":3,"bottom":20}


// props.wfmode
//  mono / color / bin


//------------------------------


/// {
///   "text" : {
///     mark : "",
///     color : "",
///     background : "",
///   }, ...
/// }
function legendCreate(code, canvas){
  let json = typeof (code) == "string"
    ? JSON.parse(code)
    : JSON.parse(JSON.stringify(code['legend'])); //deepcopy
  const offsetX = 10;
  const offsetY = 10;
  const marginY = 5;

  const note = json['note']
  console.log(json['note'])
  delete json['note'];

  let y_length = Object.keys(json).length + note.length;

  canvas
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('version',  '1.1')
    .attr("width", 200)
    .attr("height", y_length * 15 + offsetY * 2 - marginY);
  canvas
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('version',  '1.1')
    .attr("width", 200)
    .attr("height", y_length * 15 + offsetY * 2 - marginY);
  canvas.append("rect")
    .attr("x", 0)
    .attr("y",0)
    .attr("width", 200)
    .attr("height",y_length * 15 + offsetY * 2 - marginY)
    .attr("stroke-width",1)
    .attr("stroke","black")
    .attr("fill", "none");

  note.forEach((n, i) =>{
    let hoge = canvas.append("g");
    let y = i * (10 + marginY) + offsetY;
    canvas.append("text")
      .attr("x", offsetX)
      .attr("y", y + 10/2)
      .attr("text-anchor", "left")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",12)
      .text(n);
  });
  Object.keys(json).forEach((n, i) =>{
    let hoge = canvas.append("g");
    let y = (note.length + i)  * (10 + marginY) + offsetY;
    hoge.append("rect")
      .attr("x", offsetX)
      .attr("y", y)
      .attr("width", 10)
      .attr("height", 10)
      .attr("stroke-width",1)
      .attr("stroke","black")
      .attr("fill", json[n]["background"] || "white" );
    hoge.append("text")
      .attr("x", offsetX + 10 / 2)
      .attr("y", y  + 10/2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",10)
      .text(json[n]["mark"] || "");
    hoge.append("text")
      .attr("x", offsetX + 10 + 10)
      .attr("y", y  + 10/2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",12)
      .text(i);
  });
}


//------------------------------


function parse(code){
  let json = typeof (code) == "string" ? JSON.parse(code) : code;
  return {
    title : json["title"] || "",
    countX : json["config"]["countX"],
    countY : json["config"]["countY"],
    chipSizeX : json["config"]["chipSizeX"],
    chipSizeY : json["config"]["chipSizeY"],
    width : json["config"]["chipSizeX"] * json["config"]["countX"] + margin.left + margin.right,
    height : json["config"]["chipSizeY"] * json["config"]["countY"] + margin.top + margin.bottom,
    offsetX : json["config"]["offsetX"] + margin.left,
    offsetY : json["config"]["offsetY"] + margin.top,
    edge : json["config"]["edge"],
    notch : json["config"]["notch"],
    notchside : json["config"]["notchside"],
    wfsize : json["config"]["wfsize"],
    chip : json["chip"],
    mode : "BIN",
    f_x : ((i)=> i*json["config"]["chipSizeX"] + margin.left),
    f_y : ((i)=> i*json["config"]["chipSizeY"] + margin.top)
  }
}

function baseCreate(param, canvas){
  canvas
    .attr("version","1.1")
    .attr("xmlns","http://www.w3.org/2000/svg")
    .attr("height", param.height)
    .attr("width", param.width);
  canvas
    .append('svg:marker')
    .attr("id","arrow")
    .attr('markerHeight', 5)
    .attr('markerWidth', 5)
    .attr('orient', "auto")
    .attr('refX', 0)
    .attr('refY', 0)
    .attr('viewBox', '-5 -5 10 10')
    .append('svg:path')
      .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')
      .attr('fill', "black");
}

function axisCreate(param, canvas){
  let x_axis = canvas.append("g");
  let y_axis = canvas.append("g");
  let title_axis = canvas.append("g");

  title_axis.append("text")
    .attr("x", param.width / 2 + margin.left / 2)
    .attr("y", param.height -  margin.bottom / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-family","sans-serif")
    .attr("font-size",12)
    .text(param.title);
  x_axis.selectAll("text")
    .data([...Array(param.countX)])
    .enter()
    .append("text")
    .attr("x", (_, i) => param.f_x(i + 0.5))
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-family","sans-serif")
    .attr("font-size",12)
    .text((_, i) => i);
  y_axis.selectAll("text")
    .data([...Array(param.countY)])
    .enter()
    .append("text")
    .attr("x", margin.left / 2)
    .attr("y", (_, i) => param.f_y(i + 0.5))
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-family","sans-serif")
    .attr("font-size",12)
    .text((_, i) => i);

}

function gridCreate(param, canvas){
  let grid = canvas.append("g");
  let x = Array.from(new Array(param.countX+1),(v,i)=>{
    return {
      "x1" : param.f_x(i),
      "x2" : param.f_x(i),
      "y1" : margin.top,
      "y2" : param.f_y(param.countY)
    }
  });
  let y = Array.from(new Array(param.countY+1),(v,i)=>{
    return {
      "x1" : margin.left,
      "x2" : param.f_x(param.countX),
      "y1" : param.f_y(i),
      "y2" : param.f_y(i)
    }
  });
  grid.selectAll("line")
    .data(x.concat(y))
    .enter()
    .append("line")
    .attr("x1",(n) => n["x1"])
    .attr("x2",(n) => n["x2"])
    .attr("y1", (n) => n["y1"])
    .attr("y2", (n) => n["y2"])
    .attr("stroke-width",1)
    .attr("stroke","gray")
    .attr("stroke-dasharray", "1, 1");
}

function directionCreate(param, canvas){
  let direction = canvas.append("g");
  let size = 15

  direction.append("line")
    .attr("x1", margin.left)
    .attr("x2", margin.left + size)
    .attr("y1", margin.top)
    .attr("y2", margin.top)
    .attr("marker-end", "url(#arrow)")
    .attr("stroke-width",1)
    .attr("stroke","black");
  direction.append("line")
    .attr("x1", margin.left)
    .attr("x2", margin.left)
    .attr("y1", margin.top)
    .attr("y2", margin.top + size)
    .attr("marker-end", "url(#arrow)")
    .attr("stroke-width",1)
    .attr("stroke","black");
  direction.append("text")
    .attr("x", margin.left + size + 2)
    .attr("y", margin.top)
    .attr("dominant-baseline", "hanging")
    .attr("font-family","sans-serif")
    .attr("font-size",10)
    .text("x")
  direction.append("text")
    .attr("x", margin.left)
    .attr("y", margin.top + size + 2)
    .attr("dominant-baseline", "hanging")
    .attr("font-family","sans-serif")
    .attr("font-size",10)
    .text("y")
}

function wfCreate(param, canvas){
  const r = param.wfsize / 2
  const notch_w = 4
  const cx = r + param.offsetX;
  const cy = r + param.offsetY;
  const x_notch = (i) => Math.cos(i*Math.PI/180)
  const y_notch = (i) => Math.sin(i*Math.PI/180)
  let wf = canvas.append("g");

  wf.append("circle")
     .attr("cx",cx )
     .attr("cy",cy )
     .attr("r",100)
     .attr("fill","darkgray")
     .attr("stroke-width",2)
     .attr("stroke","black");
  wf.append("circle")
    .attr("cx",r + param.offsetX)
    .attr("cy",r + param.offsetY)
    .attr("r",r - param.edge)
    .attr("fill","none")
    .attr("stroke-width",1)
    .attr("stroke","black");
  wf.append('line')
    .attr("x1",cx + (r - param.notch) * x_notch(param.notchside))
    .attr("y1",cy + (r - param.notch) * y_notch(param.notchside))
    .attr("x2",cx + r * x_notch(param.notchside+notch_w))
    .attr("y2",cy + r * y_notch(param.notchside+notch_w))
    .attr("stroke-width",2)
    .attr("stroke","black");
  wf.append('line')
    .attr("x1",cx + (r - param.notch) * x_notch(param.notchside))
    .attr("y1",cy + (r - param.notch) * y_notch(param.notchside))
    .attr("x2",cx + r * x_notch(param.notchside-notch_w))
    .attr("y2",cy + r * y_notch(param.notchside-notch_w))
    .attr("stroke-width",2)
    .attr("stroke","black")
    .attr("fill","none");
}

function chipState(param, canvas){
  let chips = Object.keys(param.chip)
  let enableTXT = true;
  let chipmap = canvas.append("g");

  chipmap.selectAll("rect")
    .data(chips)
    .enter()
    .append("rect")
    .attr("x",(n)=> param.f_x(param.chip[n]["x"]))
    .attr("y",(n)=> param.f_y(param.chip[n]["y"]))
    .attr("width", param.chipSizeX)
    .attr("height", param.chipSizeY)
    .attr("stroke-width",1)
    .attr("stroke","black")
    .attr("fill",(n)=> param.chip[n]["background"] || "lightgray");

  if(enableTXT){
    chipmap.selectAll("TEXT")
    	.data(chips)
    	.enter()
      .append("text")
      .attr("x",(n)=> param.f_x(param.chip[n]["x"]+0.5))
      .attr("y",(n)=> param.f_y(param.chip[n]["y"]+0.5))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family","sans-serif")
      .attr("font-size",12)
      .text((n)=> param.chip[n]["text"] || "");
  }

  // const chipnos = null//this.props.state.get(mapconfig)["effective"]
  // const keys = null//Object.keys(wfmap)
  //
  //   const mode = this.props.wfmode.split("|")
  //   let selected = mode.some((e, i, a)=> e.trim() == "BIN") ? "bin"
  //     : mode.some((e, i, a)=> e.trim() == "RESULT") ? "result"
  //     : mode.some((e, i, a)=> e.trim() == "WT") ? "wt" : ""
  //   let enableTXT = mode.some((e, i, a)=> e.trim() == "TEXT")
  //
  //   let canvas = wf.append("g");
  //   canvas.selectAll("rect")
  //   	.data(keys)
  //   	.enter()
  //     .append("rect")
  //     .attr("x",(i)=> chipSizeX * chipnos[i]["x"] + margin.left)
  //     .attr("y",(i)=> chipSizeY * chipnos[i]["y"] + margin.top)
  //     .attr("width",chipSizeX)
  //     .attr("height",chipSizeY)
  //     .attr("stroke-width",1)
  //     .attr("stroke","black")
  //     .attr("fill",(i)=>{
  //       switch (wfmap[i]["bin"].trim()) {
  //         case "2":
  //           return "black";
  //         case "3":
  //           return "white";
  //         default:
  //           return "lightgray";
  //         }
  //     });
  //
  //   if(enableTXT){
  //     canvas.selectAll("TEXT")
  //     	.data(keys)
  //     	.enter()
  //       .append("text")
  //       .attr("x",(i)=> chipSizeX * (chipnos[i]["x"]+0.5) + margin.left)
  //       .attr("y",(i)=> chipSizeY * (chipnos[i]["y"]+0.5) + margin.top)
  //       .attr("text-anchor", "middle")
  //       .attr("dominant-baseline", "middle")
  //       .attr("font-family","sans-serif")
  //       .attr("font-size",12)
  //       .text((i)=>wfmap[i]["bin"].trim());
  //   }
  }

function cautionCreate(param, canvas, txt){
  const r = param.wfsize / 2
  const notch_w = 4
  const cx = r + param.offsetX;
  const cy = r + param.offsetY;
  let caution = canvas.append("g");
  caution.append("text")
    .attr("x", cx)
    .attr("y", cy)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-family","sans-serif")
    .attr("fill","red")
    .attr("font-size",32)
    .text(txt);
}
//------------------------------


function renderLegend(code, node) {
  let elem = node || document.createElement("svg");
  let canvas = d3.select(elem)
  canvas.selectAll("svg > *").remove();
  let json = typeof (code) == "string" ? JSON.parse(code) : code;
  legendCreate(json, canvas)

  return elem.outerHTML;
}

//notch reserve dist
function render(code, node) {
  let elem = node || document.createElement("svg");
  let canvas = d3.select(elem)
  canvas.selectAll("svg > *").remove();

  let param = parse(code);

  baseCreate(param, canvas);
  wfCreate(param,  canvas);
  axisCreate(param, canvas);

  if(param["chip"]){
    gridCreate(param, canvas);
    directionCreate(param, canvas);
    chipState(param, canvas);
  }else{
    cautionCreate(param, canvas, "No Wf")
    //cautionCreate(param, canvas, "")
  }

  return elem.outerHTML;
}


export default {
  render,
  renderLegend
}


//this.chipClickable(svg);
//.attr("r",10*this.props.state.get("count"))

// let innerarc = d3.arc()
//     .innerRadius(99 - edge)
//     .outerRadius(100 - edge)
//     .startAngle((notchside + 3) * (Math.PI/180))
//     .endAngle((notchside + 357) * (Math.PI/180));
// wf.append("path")
//   .attr("d", outerarc)
//   .attr("transform", `translate(${100 + offsetX},${100 + offsetY})`)
//   .style("fill", "red");



    // chipClickable(wf){
    //   const chipSizeY = this.props.state.get(mapconfig)["chipSizeY"]
    //   const chipSizeX = this.props.state.get(mapconfig)["chipSizeX"]
    //   this.props.state.get(mapconfig)["effective"].map((i)=>{
    //       wf.append("rect")
    //       .on("click",d=>console.log("aaa"))
    //       .attr("x",chipSizeX * i["y"])
    //       .attr("y",chipSizeY * i["x"])
    //       .attr("width",chipSizeX)
    //       .attr("height",chipSizeY)
    //       .attr("fill","red")
    //       .attr("stroke-width",1)
    //       .attr("stroke","red");
    //     });
    // }
    //
    // onChangeState(e){
    //   //this.setState({ world: e.target.value });
    // }
