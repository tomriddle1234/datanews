	    var width = $(".graphs").width() ;
	    var height = $(".graphs").height() ;
   
	    //albers is not working
	    var projection = d3.geo.mercator()
	        .center([107, 31])
            .scale(500 * (height/597))
            .translate([width/2, height/2]);
	           
	    var path = d3.geo.path()
	        .projection(projection) 
	        .pointRadius(2);
	        
   	        

        // draw svg
        var svg = d3.select("#seventh-slide").append("svg")
	        .attr("width", width)
	        .attr("height", height);
	        
	        
	    var tooltip_map = d3.select("#seventh-slide")
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

        var linkMap = {} ;
        var relatedPlaces = [] ;
        var linkTitles = {} ;

        d3.json("../json/thailand_china_prep_map_with_places.json", function(error, mapdata) {
          
            if (error) return console.error(error) ;
            svg.selectAll(".subunit")
                .data(topojson.feature(mapdata, mapdata.objects.china_thailand_subunits).features)
                .enter().append("path")
                .attr("class", function(d) { 
                    //console.log(d.id) ; 
                    return "subunit " + d.id ;})
                .attr("d", path) 
                ;
            
            //draw place dot
            svg.append("path")
                .datum(topojson.feature(mapdata,mapdata.objects.cn_places))
                .attr("d",path)
                .attr("class","place") ;
            svg.append("path")
                .datum(topojson.feature(mapdata,mapdata.objects.th_places))
                .attr("d",path)
                .attr("class","place") ;
            svg.append("path")
                .datum(topojson.feature(mapdata,mapdata.objects.tw_places))
                .attr("d",path)
                .attr("class","place") ;
            svg.append("path")
                .datum(topojson.feature(mapdata,mapdata.objects.hk_places))
                .attr("d",path)
                .attr("class","place") ;
                  
            
            var placeMarks = d3.merge([topojson.feature(mapdata,mapdata.objects.cn_places).features ,  topojson.feature(mapdata,mapdata.objects.tw_places).features , topojson.feature(mapdata,mapdata.objects.th_places).features]) ;
            
       
      
      
            //store place coordinates in linkMap
            
            var placeNames = [] ;
            for (i in placeMarks) {
                linkMap[placeMarks[i].properties.name] = placeMarks[i].geometry.coordinates ;
                placeNames.push(placeMarks[i].properties.name) ;
            }

            
            
            //load all linked places in the csv file
            d3.csv("../json/all_linked_places.csv")
                .row(function (d) {
                    //console.log(d) ;
                    if (d.d1 != "" && d.d2 != "") {
                        //fly d1 d2
                        //check if 
                        var linkedList = [] ;
                        linkedList.push(d.d1) ;
                        linkedList.push(d.d2) ;
                        if (d.d3 != "")
                        {
                            linkedList.push(d.d3) ;
                        }
                            
                        if (d.d4 != "")
                        {
                            linkedList.push(d.d4) ;
                        }
                        if (d.d5 != "")
                        {
                            linkedList.push(d.d5) ;
                        }   
                        
                        //console.log(linkedList) ;
                        var prepLinkedList = [] ;
                        
                        
                        for (i in placeNames) {
                            for (j in linkedList){
                                //check if place name in map data, if so, fly the map data name instead of prepared csv data
                                
                                //console.log(linkedList[j]) ;
                                if (placeNames[i].toLowerCase() == linkedList[j].toLowerCase() && prepLinkedList.indexOf(placeNames[i]) == -1)
                                {
                                    prepLinkedList.push(placeNames[i]) ;
                                    
                                    //title array for tooltip
                                    if (linkTitles[placeNames[i]] === undefined)
                                        linkTitles[placeNames[i]] = [] ;
                                    if ( linkTitles[placeNames[i]].indexOf(d.title) == -1 )
                                        linkTitles[placeNames[i]].push(d.title) ;
                                }
                            }
                        }
                        //console.log(prepLinkedList) ;
                        //draw the final prepared linke path
                        if (prepLinkedList.length > 1) {
                            for (var ii = 0 ; ii < prepLinkedList.length - 1 ; ++ii)
                                for (var jj = 1 ; jj < prepLinkedList.length ; ++jj)
                                    if (ii != jj)
                                    {
                                        fly(prepLinkedList[ii],prepLinkedList[jj]) ;
                                    }
                        }
                        
                        
                        //put prepLinkedList in the collection
                       
                        for (i in prepLinkedList){
                            if (relatedPlaces.indexOf(prepLinkedList[i]) == -1){
                                relatedPlaces.push(prepLinkedList[i]) ;
                            }
                        }
                        
                        svg.selectAll("circle")
                            .data(relatedPlaces).enter()
                            .append("circle")
                            .attr("cx", function (d){
                                //console.log(linkMap[d][0]) ;
                                return projection(linkMap[d])[0] ;
                            })
                            .attr("cy", function (d){
                                return projection(linkMap[d])[1] ;
                            }) 
                            .attr("r", "10px")
                            .attr("class","linked_places") 
                            .on("mouseover", function(d) {
                             
                             var titleTextCompose = "";
                             //compose a list of titles
                             for (titext in linkTitles[d]) {
                                titleTextCompose = titleTextCompose + linkTitles[d][titext] +"<br \\>"  ;
                             }
                             
                             tooltip_map.html(titleTextCompose);
                             tooltip_map.style("visibility", "visible");
                              })
                            .on("mousemove", function() {
                              return tooltip_map.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                             })
                            .on("mouseout", function(){return tooltip_map.style("visibility", "hidden");});
                            ;
                            
                        svg.selectAll(".scaled_labels")
                            .data(relatedPlaces).enter()
                            .append("text")
                            
                            .attr("transform", function(d) { return "translate(" + projection(linkMap[d]) + ")"; })
                            
                          .attr("x", function(d) { return projection(linkMap[d])[0] > -1 ? 6 : -6; })
                          .attr("dy", ".35em")
                          .attr("dx", ".35em")
                          .style("text-anchor", function(d) { return projection(linkMap[d])[0] > -1 ? "start" : "end"; })
      
                            .attr("class", "scaled_labels")
                            .text(function(d) {return d;})
                            ;
                    }
                           
                    
                })
                .get(function (error, rows) { 
                //console.log(error); 
                })
                ;
                
         
        
        
            
      
      function fly(origin, destination) {
                var route = svg.append("path")
                   .datum({type: "LineString", coordinates: [linkMap[origin], linkMap[destination]]})
                   .attr("class", "route")
                   .attr("d", path);
    
              }
              
     
              
        }) ;
        
