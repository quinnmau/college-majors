'use strict';

$(function() {
    d3.csv('https://raw.githubusercontent.com/fivethirtyeight/data/master/college-majors/all-ages.csv', function(error, data) {
        console.log(data);
    })
})