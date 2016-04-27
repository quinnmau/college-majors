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
        places.forEach(function(d) {
            var li = $("<li></li>");
            li.text(d);
            li.attr('place', d);
            dropdown.append(li);
        });
        //margins for actual data points           
        var margin = {
            left: 70,
            bottom: 100,
            right: 50,
            top: 50
        };
        
        //height and width of data points container
        var width = 1000 - margin.left - margin.right;
        var height = 600 - margin.top - margin.bottom;
        
        var xScale;
        var yScale;
        var currentData;
        var colorScale = d3.scale.category10();
        
        //canvas for chart
        var svg = d3.select('#vis')
                    .append('svg')
                    .attr('width', 1000)
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
            xScale = d3.scale.linear().domain([xMin, xMax]).range([0, width]);
            
            var yMin = d3.min(data, function(d) {return +d["Growth Score"]});
            var yMax = d3.max(data, function(d) {return +d["Growth Score"]});
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
            currentData = data.filter(function(d) {
				return d.Location == place;
			});
            console.log(currentData);
        }
        
        var draw = function(data) {
            setScales(data);
            
            setAxes();
            
            var circles = g.selectAll('circle')
                            .data(data, function(d) {return d.Name});
                            
            circles.enter().append('circle')
                    .attr('r', 8)
                    .attr('cx', function(d) {
                        var amt = d["Total Funding"];
                        return xScale(parseFloat(amt.replace(/[^0-9.]/g, "")));})
                    .attr('cy', height)
                    .attr('fill', function(d) {return colorScale(d["Location"])})
                    .attr('title', function(d) {return d["Name"]})
                    .style('opacity', 0.4);
                    
            circles.exit()
                    .transition()
                    .duration(1000)
                    // .attr('cx', function(d) {
                    //     var amt = d["Total Funding"];
                    //     return xScale(parseFloat(amt.replace(/[^0-9.]/g, "")));
                    // })
                    // .attr('cy', function(d) {return yScale(d["Growth Score"])})
                    // .attr('r', 8)
                    .attr('fill', function(d) {return colorScale(d["Location"])})
                    .attr('title', function(d) {return d["Name"]})
                    .style('opacity', function(d, i) {return 0.4/(i*1.8)})
                    .remove();
            
            circles.transition().duration(1500)
                    .attr('r', 8)
                    .attr('cx', function(d) {
                        var amt = d["Total Funding"];
                        return xScale(parseFloat(amt.replace(/[^0-9.]/g, "")));
                    })
                    .attr('cy', function(d) {return yScale(d["Growth Score"])})
                    .attr('fill', function(d) {return colorScale(d["Location"])})
                    .attr('title', function(d) {return d["Name"]})
                    .style('opacity', 0.4);
        };          
        draw(data);
        
        $('li').on('click', function() {
            filter($(this).attr('place'));
            draw(currentData);
        });
        
        /*controls*/
        $(function() {
            $( "#slider" ).slider({
                range: true,
                values: [0, 3125]
            });
        });
                            
    });
});
