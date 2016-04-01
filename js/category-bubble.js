          
        var diameter = $(".graphs").height(),
        format = d3.format(",d");

        var pack = d3.layout.pack()
          .size([diameter - 4, diameter - 4])
          .children(function(d) {
            return d.values;
          })
          .value(function(d) {
            return d.values;
          })
          .padding(1);
 
        var svg_bubble = d3.select("#sixth-slide").append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .attr("class","bubble-svg")
          .append("g")
          .attr("transform", "translate(2,2)")
          
          ; 
          
        var tooltip = d3.select("#sixth-slide")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("tooltip");
          
            //loading json files
            d3.json("../json/all.json",function(all_data) {
            
                //processing data
                
                var sortByBigCate = d3.nest()
                    .key(function (d) {return d.涉及领域 ;})
                    .key(function (d) {return d.具体分类 ;})
                    .key(function (d) {return d.报纸 ;})
                    .rollup(function (d) {return d.length ;})
                    .entries(all_data) ;
                
                var bigCateRoot = {
                    key:"" ,
                    values: sortByBigCate 
                } ;
                
                var node = svg_bubble.datum(bigCateRoot).selectAll(".node")
                    .data(pack.nodes)
                    .enter().append("g")
                    .attr("class", function (d) {
                        return d.children ? "node" : "leaf node";
                    })
                    .attr("transform", function(d) {
                      return "translate(" + d.x + "," + d.y + ")";
                    });
                    
                                      
                node.append("title")
                    .text(function(d) {
                      return d.name + (d.children ? "" : ": " + format(d.size));
                    })
                    .attr("z-index", "50")
                    ;

                node.append("circle")
                    .attr("r", function(d) {
                      return d.r;
                    })
                    .attr("z-index", "50")
                    .attr("class", function(d) {
                        //check if leaf node
                        if (typeof d.children == "undefined"){
                            if (d.key == "世界日报")
                                return "shijie" ;
                            else
                                return "xingxie" ;
                        }
                    })
                    .on("mouseover", function(d) {
                     var tipFirstText ;
                     if (typeof d.parent != "undefined"){
                        tipFirstText = d.parent.key ;
                     }
                     else{
                        tipFirstText = "" ;
                     }
                     
                     tooltip.text(tipFirstText + " " + d.key + " 文章数量" + ": " + format(d.value));
                     tooltip.style("visibility", "visible");
                      })
                    .on("mousemove", function() {
                      return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                     })
                    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                    ;
                
                
                node.append("text")
                    .attr("dy",function (d) {return d.children ? d.r : ".3em" ; })
                    .attr("font-size",function (d) {return d.children ? "1em" : ".3em" ; })
                    .attr("z-index",function (d) {return d.children ? "1000" : "100" ; })
                    .style("text-anchor", function (d) {return d.children ? "middle" : "middle" ; })
                    .text (function(d) {
                        if (d.depth == 1){
                                return d.key.substring(0, d.r/2) ;
                        }
                    })
                    
                    ;
                    
                
                
               
            }) ;
