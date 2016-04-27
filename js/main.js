'use strict';

$(function() {
    d3.csv('https://raw.githubusercontent.com/curran/data/gh-pages/mattermark/2015-top-100-analytics-startups.csv', function(error, data) {
        console.log(data);
        
        //populate dropdown
        var places = [];
        data.forEach(function(d) {
            var location = d.Location;
            if ($.inArray(location, places) == -1) {
                places.push(location);
            }
        });
        var dropdown = $('#dropdown');
        var li = $("<li></li>");
        li.text('All');
        li.attr('place', 'all');
        li.on('mouseover', function() {
            $(this).animate({backgroundColor: '#337ab7'}, 'fast');
        }).on('mouseout', function() {
            $(this).animate({backgroundColor: '#fff'}, 150);
        });
        dropdown.append(li);
        places.forEach(function(d) {
            var li = $("<li></li>");
            li.text(d);
            li.attr('place', d);
            li.on('mouseover', function() {
                $(this).animate({backgroundColor: '#337ab7'}, 'fast');
            }).on('mouseout', function() {
                $(this).animate({backgroundColor: '#fff'}, 150);
            });
            dropdown.append(li);
        });
        //margins for actual data points           
        var margin = {
            left: 70,
            bottom: 100,
            right: 175,
            top: 50
        };
        
        //height and width of data points container
        var width = 1125 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;
        
        var xScale;
        var yScale;
        var currentData;
        var colorScale = d3.scale.category20();
        var currRange;
        var currPlace;
        
        //canvas for chart
        var svg = d3.select('#vis')
                    .append('svg')
                    .attr('width', 1125)
                    .attr('height', 600);
        
        //container for data points
        var g = svg.append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    .attr('width', width)
                    .attr('height', height);
        
        //x and y axes. Haven't called axis function yet, just a placeholder          
        var xAxisLabel = svg.append('g')
                            .attr('transform', 'translate(' + margin.left + ', ' + (margin.top + height) + ')')
                            .attr('class', 'axis');
                            
        var yAxisLabel = svg.append('g')
                            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                            .attr('class', 'axis');
        
        //x and y axis text. Haven't appended any text yet, just a placeholder                    
        var xAxisText = svg.append('text')
                            .attr('transform', 'translate(' + (margin.left + width/2) + ', ' + (margin.top + height + 40) + ')')
                            .attr('class', 'title');
                            
        var yAxisText = svg.append('text')
                            .attr('transform', 'translate(' + (margin.left - 40) + ', ' + (margin.top + height/2) + ') rotate(-90)')
                            .attr('class', 'title');
        
        var setScales = function(data) {
            var xMin = d3.min(data, function(d) {
                var amt = d["Total Funding"];
                return parseFloat(amt.replace(/[^0-9.]/g, ""));
            });
            var xMax = d3.max(data, function(d) {
                var amt = d["Total Funding"];
                return parseFloat(amt.replace(/[^0-9.]/g, ""));
            });
            if (xMax == xMin) {
                xMin = 0;
                xMax = 2*xMax;
            }
            xScale = d3.scale.linear().domain([xMin, xMax]).range([0, width]);
            
            var yMin = d3.min(data, function(d) {return +d["Growth Score"]});
            var yMax = d3.max(data, function(d) {return +d["Growth Score"]});
            console.log(yMin);
            if (yMax == yMin) {
                yMin = 0;
                yMax = 2*yMax;
            }
            yScale = d3.scale.linear().domain([yMin, yMax]).range([height, 0]);
        };
        
        var setAxes = function() {
            var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient('bottom');
                            
            var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient('left');
                            
            xAxisLabel.transition().duration(1500).call(xAxis);
            
            yAxisLabel.transition().duration(1500).call(yAxis);
            
            xAxisText.text('Total Funding (Millions)');
            
            yAxisText.text('Growth Score');
        };
  
        var filter = function(place) {
            if (typeof place == 'string' && place == 'all') {
                currPlace = undefined;
                currRange = undefined;
                currentData = data;
            } else if (currRange == undefined && currPlace == undefined) {
                if (Array.isArray(place)) {
                    console.log(place);
                    currentData = data.filter(function(d) {
                        var amt = d["Total Funding"];
                        var num = parseFloat(amt.replace(/[^0-9.]/g, ""));
                        currRange = place;
                        var score = d["Growth Score"];
                        return num >= place[0][0] && num <= place[1][0] && score >= place[0][1] && score <= place[1][1];
                    });
                }
                if (typeof place == 'string') {
                    currentData = data.filter(function(d) {
                        currPlace = place;
                        return d.Location == place;
                    });
                }
            } else if (currRange != undefined && currPlace == undefined) {
                if (Array.isArray(place)) {
                    currentData = currentData.filter(function(d) {
                        var amt = d["Total Funding"];
                        var num = parseFloat(amt.replace(/[^0-9.]/g, ""));
                        currRange = place;
                        var score = d["Growth Score"];
                        return num >= place[0][0] && num <= place[1][0] && score >= place[0][1] && score <= place[1][1];
                    });
                }
                if (typeof place == 'string') {
                    currentData = currentData.filter(function(d) {
                        currPlace = place;
                        return d.Location == place;
                    });
                }
            } else if (currRange == undefined && currPlace != undefined) {
                if (Array.isArray(place)) {
                    currentData = currentData.filter(function(d) {
                        var amt = d["Total Funding"];
                        var num = parseFloat(amt.replace(/[^0-9.]/g, ""));
                        currRange = place;
                        var score = d["Growth Score"];
                        return num >= place[0][0] && num <= place[1][0] && score >= place[0][1] && score <= place[1][1];
                    });
                }
                if (typeof place == 'string') {
                    currentData = data.filter(function(d) {
                        currPlace = place;
                        return d.Location == place;
                    });
                }
            } else {
                if (Array.isArray(place)) {
                    currentData = currentData.filter(function(d) {
                        var amt = d["Total Funding"];
                        var num = parseFloat(amt.replace(/[^0-9.]/g, ""));
                        currRange = place;
                        var score = d["Growth Score"];
                        return num >= place[0][0] && num <= place[1][0] && score >= place[0][1] && score <= place[1][1];
                    });
                }
                if (typeof place == 'string') {
                    currentData = data.filter(function(d) {
                        currPlace = place;
                        var amt = d["Total Funding"];
                        var num = parseFloat(amt.replace(/[^0-9.]/g, ""));
                        var score = d["Growth Score"];
                        return d.Location == place && num >= currRange[0][0] && num <= currRange[1][0] && score >= currRange[0][1] && score <= currRange[1][1];
                    });
                }
            }  
            console.log(currentData);
        };
        
        var tooltip = d3.select('body').append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0);
        
        var slider = g.append('g');
                        
        var setBrush = function() {
            var brush = d3.svg.brush()
                            .x(xScale)
                            .y(yScale)
                            .on('brushend', function() {
                                console.log(brush.extent());
                                filter(brush.extent());
                                draw(currentData);
                            });
                            
            slider.call(brush);
            
            slider.selectAll('rect.background')
                .attr('height', height);    
        };

        var draw = function(data) {
            setScales(data);
            
            setAxes();
            
            setBrush();
            
            var circles = g.selectAll('circle')
                            .data(data, function(d) {return d.Name});
                            
            circles.enter().append('circle')
                    .attr('r', 10)
                    .attr('cx', function(d) {
                        var amt = d["Total Funding"];
                        return xScale(parseFloat(amt.replace(/[^0-9.]/g, "")));})
                    .attr('cy', height)
                    .attr('fill', function(d) {return colorScale(d["Location"])})
                    .attr('title', function(d) {return d["Name"]})
                    .style('opacity', 0.5);
            
            circles.on('mouseover', function(d) {
                d3.select(this).style('opacity', 1);
                tooltip.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                tooltip.html("<strong>"+d.Name+"</strong><br/><strong>Growth Score:</strong> "+d["Growth Score"]+"<br/><strong>Total Funding:</strong> "+d["Total Funding"])  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");    
            })
            .on('mouseout', function(d) {
                d3.select(this).style('opacity', 0.5);
                tooltip.transition()        
                    .duration(500)      
                    .style("opacity", 0);
            });
                    
            circles.exit()
                    .transition()
                    .duration(1000)
                    .attr('fill', function(d) {return colorScale(d["Location"])})
                    .attr('title', function(d) {return d["Name"]})
                    .style('opacity', function(d, i) {return 0.4/(i*1.8)})
                    .remove();
            
            circles.transition().duration(1500)
                    .attr('r', 10)
                    .attr('cx', function(d) {
                        var amt = d["Total Funding"];
                        return xScale(parseFloat(amt.replace(/[^0-9.]/g, "")));
                    })
                    .attr('cy', function(d) {return yScale(d["Growth Score"])})
                    .attr('fill', function(d) {return colorScale(d["Location"])})
                    .attr('title', function(d) {return d["Name"]})
                    .style('opacity', 0.5);
            circles.on('mouseover', function(d) {
                        d3.select(this).style('opacity', 1);
                        tooltip.transition()        
                            .duration(200)      
                            .style("opacity", .9);      
                        tooltip.html("<strong>"+d.Name+"</strong><br/><strong>Growth Score:</strong> "+d["Growth Score"]+"<br/><strong>Total Funding:</strong> "+d["Total Funding"])  
                            .style("left", (d3.event.pageX) + "px")     
                            .style("top", (d3.event.pageY - 28) + "px");    
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).style('opacity', 0.5);
                        tooltip.transition()        
                            .duration(500)      
                            .style("opacity", 0);
                    });
                    
        };
        
        var legendLabel = svg.append('g')
                            .attr('class', 'legendLinear')
                            .attr('transform', 'translate(' + (margin.left + width + 50) + ', ' + margin.top + ')');
        
        var setLegend = function() {
            var legend = d3.legend.color()
                            .shapeWidth(30)
                            .orient('vertical')
                            .scale(colorScale);
                            
            legendLabel.call(legend);
        };
    
        /*----------------------------*/          
        draw(data);
        setLegend();
        
        $('li').on('click', function() {
            filter($(this).attr('place'));
            draw(currentData);
        });
        
        /*controls*/
        $('#zoom-out').on('click', function() {
            filter('all');
            draw(currentData);
        });
                            
    });
});
