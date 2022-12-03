function TreeMap() {
   // variables for svg (canvas)
   let width = 900;
   let height = 600;
   let padding = 60;
   let svg = d3.select('body').append('svg');    // appends svg element to body
   // variables for tooltip
   let tooltip = d3.select('body').append('div')  // appends tooltip element to body
   // variables for chart
   let legend = d3.select('svg').append('svg').attr('id', 'legend')  // appends svg#legend element to svg canvas
   // variables for chart legend
   let legendKeys = []
   // variables for JSON data
   let videoGameSalesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
   let videoGamesSalesData = [];

   // STRATEGY (Courtesy: https://d3-graph-gallery.com/graph/treemap_json.html)
   // 1. set the dimensions and margins of the graph
   // 2. append the svg object to the body of the page
   // 3. Read json data
   // 4. Give the data to this cluster layout:
   // 5. Then d3.treemap computes the position of each element of the hierarchy
   // 6. Use this information to add rectangles:
   // 7. And to add the text labels


   let getDataClickHandler = () => {
      d3.json(videoGameSalesURL).then(
         (data, error) => {
            if(error){
               console.log(log)
            }else {
               videoGamesSalesData = data
            }
         }
      ); 
   }

   let generateMapClickHandler = () => {
      drawCanvas();
      drawTreeMap();
      generateLegend();
      generateTooltip();
   }


   let drawCanvas = () => {
      svg.attr('id', 'canvas')
         .attr('width', width)
         .attr('height', height);
   }

   // Create hierarchy due to the hierarchies in the children objects/fields at different nodes in the data
   let drawTreeMap = () => {
      let hierarchy = d3.hierarchy(videoGamesSalesData, (node) => node['children'])
                        .sum((node) => node['value'])
                        .sort((node1, node2) => node2['value'] - node1['value'])
      // Then d3.treemap computes the position of each element of the hierarchy
      let generateTreeMap = d3.treemap()
                              .size([width, height - padding])
      generateTreeMap(hierarchy)      
      //console.log(hierarchy.leaves())

      let block = svg.selectAll('g')
            .data(hierarchy.leaves())
            .enter()
            .append('g')
      block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (item) => colorScale(item['data']['category']))
            .attr('data-name', (item) => item['data']['name'])
            .attr('data-category', (item) => item['data']['category'])
            .attr('data-value', (item) => item['data']['value'])
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('stroke', 'wheat')
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave)
      // and to add the text labels
      block.append("text")
            .text((item) => item['data']['name'])
            .attr("x", (d) => d.x0+5)    // +10 to adjust position (more right)
            .attr("y", (d) => d.y0+20)    // +20 to adjust position (lower)
            .attr("font-size", "12px");
   }

   legendKeys = ['2600', 'Wii', 'NES', 'GB', 'DS', 'X360', 'PS3', 'PS2', 'SNES', 'GBA', 'PS4', '3DS', 'N64', 'PS', 'XB', 'PC', 'PSP', 'XOne']
   let generateLegend = () => {
      // // Add one bar in the legend for each legend item.
      let size = padding /2.5
      legend.selectAll('mybars')
         .data(legendKeys)
         .enter()
         .append('rect')
            .attr('id', 'legend-item')
            .attr('class', 'legend-item')
            .attr('x', (d, i) => width /5 + i*(size + 10)) // size+3 is the distance between symbols
            .attr('y', height - (padding / 2)) 
            .attr('width', size)
            .attr('height', size)
            .attr("fill", (d) => colorScale(d));
      // Add one label in the legend for each item.
      legend.selectAll("mylabels")
         .data(legendKeys)
         .enter()
         .append("text")
            .attr("x", (d, i) => width /5 + i*(size + 10))
            .attr("y", height - (padding / 2) - padding/5)
            .text((d) => d)
            .attr("text-anchor", "right")
            .style("alignment-baseline", "middle")
   }

   // Generate-Tooltip function (https://d3-graph-gallery.com/graph/interactivity_tooltip.html)
   let generateTooltip = () => {
      tooltip
         .attr('id', 'tooltip')
         .style('opacity', 0)
         .style('width', 'auto')
         .style('height', 'auto');
   }
   let mouseover = (event, item) => {
      tooltip
         .style('opacity', 0.7)
         .attr('data-value', item['data']['value'])
   }
   let mousemove = (event, item) => {
      tooltip
         .html( () => {
            let name = item['data']['name']
            let category = item['data']['category']
            let value = item['data']['value']
            return name + '<br>' + category + '<br>' + value})
         .style('left', event.pageX + 10 + 'px')
         .style('top', event.pageY - 20 + 'px');
   }
   let mouseleave = () => {
      tooltip
         .style('opacity', 0);
   }

   let colorScale = (item) => {
      if(item === '2600' | item === 'Wii') {
         return 'rgb(236, 112, 99)'
      } else if(item === 'NES' | item === 'GB') {
         return 'rgb(165, 105, 189)'
      } else if(item === 'DS' | item === 'X360') {
         return 'rgb(93, 173, 226)'
      } else if(item === 'PS3' | item === 'PS2') {
         return 'rgb(69, 179, 157)'
      } else if(item === 'SNES' | item === 'GBA') {
         return 'rgb(88, 214, 141)'
      } else if(item === 'PS4' | item === '3DS') {
         return 'rgb(245, 176, 65)'
      } else if(item === 'N64' | item === 'PS') {
         return 'rgb(220, 118, 51)'
      } else if(item === 'XB' | item === 'PC') {
         return 'rgb(153, 163, 164)'
      } else {
         return 'rgb(128, 139, 150)'
      }
   }

   return (
      <div>
         <button className={"button"} onClick={getDataClickHandler}>Get Data</button>
         <button className={"button"} onClick={generateMapClickHandler}>Generate Map</button>
      </div>
   )

}