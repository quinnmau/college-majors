'use strict';

$(function() {
    d3.csv('https://raw.githubusercontent.com/fivethirtyeight/data/master/college-majors/all-ages.csv', function(error, data) {
        console.log(data);
         
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
        var colorScale = d3.scale.category20();
        var level = 'Median';
        
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
        
        //sets x and y scales. y scale varies on type of measure (i.e. salary or unemployment)                    
        var setScales = function(data) {
            var majors = data.map(function(d) {return d.Major});
            
            xScale = d3.scale.ordinal().domain(majors).rangeBands([0, width], 0.2);
            
            var yMin = d3.min(data, function(d) {return d[level];});
            var yMax = d3.max(data, function(d) {return d[level];});
            
            yScale = d3.scale.linear().domain([0, yMax]).range([height, 0]);
        };
        
        //sets x and y axes.
        var setAxes = function() {
            var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient('bottom');
                            
            var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient('left');
                            
           xAxisLabel.transition().duration(1500).call(xAxis);
           
           yAxisLabel.transition().duration(1500).call(yAxis);   
           
           xAxisText.text('Major');
           
           yAxisText.text(level);             
        };
        
        var filterData = function() {
            currentData = data.sort(function(a, b) {
                if (a["Major_category"] == b["Major_category"]) {
                    return a["Major"].localeCompare(b["Major"]);
                } else {
                    return a["Major_category"].localeCompare(b["Major_category"]);
                }
            });
        };
        
        var draw = function(data) {
            setScales(data);
            
            setAxes();
            
            var rects = g.selectAll('rect')
                            .data(data, function(d) {return d.Major;});
                            
            rects.enter().append('rect')
                    .attr('x', function(d) {return xScale(d.Major);})
                    .attr('y', height)
                    .attr('width', xScale.rangeBand())
                    .attr('height', 0)
                    .attr('title', function(d) {return d[level];});
                    
            rects.exit().remove();
            
            rects.transition()
                    .duration(1000)
                    .attr('x', function(d) {return xScale(d.Major);})
                    .attr('y', function(d) {return yScale(d[level]);})
                    .attr('width', xScale.rangeBand())
                    .attr('height', function(d) {return height - yScale(d[level]);})
                    .style('fill', function(d) {return colorScale(d.Major_category);})
                    .attr('title', function(d) {return d[level]});
        };
        
        filterData();
        draw(currentData);
        
        $('input').on('change', function() {
            
        });
        
        // $("rect").tooltip({
		// 	'container': 'body',
		// 	'placement': 'top'
		// });
        
                            
    });
});