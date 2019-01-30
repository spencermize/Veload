var places = {
    local : {
        url : "http://localhost:3001",
        endpoints: ["status", "stats", "circ"],
        combined: []
    },
    remote : {
        url : "/api",
        endpoints: ["publish", "athlete", "athlete_routes", "athlete_activities", "user_layout", "user_modules","photos","photos_random"],
        combined: []
    }
}
var local = [];
var remote = [];
_.forEach(places, function (key, value) {
	_.forEach(key.endpoints,function(val){
        var k = val.replace("_", "/");
        var l = _.camelCase(val);
        places[value].combined[l] = `${key.url}/${k}`;
    })
});

var Options = {
    urls: {
        local : places.local.combined,
        remote : places.remote.combined
    },
    UPDATEFREQ : 1000,
    MPHFORM : '0,000.00',
    colors: {
        GOOD : "#28a745",
        GOODBG : "#53F377",
        BAD : "#dc3545",
        BADBG :  "#E27A84"
    },
    chart : {
        type: 'line',
        data: {
            datasets: [{
                data: [],
                pointRadius: 3,
                pointBackgroundColor: []
            }]
        },
        defaults : {
            global: {
                defaultFontFamily: 'Work Sans'
            }
        },
        options: {
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    type: 'realtime',   // x axis will auto-scroll from right to left
                    realtime: {         // per-axis options
                        duration: 1000*60*30,    // data in the past 30m will be displayed
                        delay: 2000,        // delay of 2000 ms, so upcoming values are known before plotting a line
                        pause: true,       // chart is  paused
                        ttl: 99999999999     // data will be automatically deleted as it disappears off the chart
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            plugins: {
                streaming: {            // per-chart option
                    frameRate: 30       // chart is drawn 5 times every second
                }
            },
            legend: {
                display: false
            },
            pan: {
                enabled: true,
                mode: 'x',
                rangeMax: {
                    x: 4000
                },
                rangeMin: {
                    x: 0
                }
            },
            zoom: {
                enabled: true,
                mode: 'x',
                rangeMax: {
                    x: 20000
                },
                rangeMin: {
                    x: 1000
                }
            },		
            responsive: true,
            maintainAspectRatio: false
        }
    }
}

export {Options};