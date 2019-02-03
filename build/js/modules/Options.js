var Options = {
    generateUrls: function(){
        var self = this;
        _.forEach(self.urlComponents, function (key, value) {
            _.forEach(key.endpoints,function(val){
                var k = val.replace("_", "/");
                var l = _.camelCase(val);
                self.urls[value][l] = `${key.url}/${k}`;
            })
        });
    },
    updateLocal: function(server,el){
        this.urlComponents.local.url = server;
        this.generateUrls()
        $(document).trigger("urlsUpdated.veload");
    },
    urlComponents:{
        local : {
            url : "http://127.0.0.1:3001",
            endpoints: [ "stats", "circ"]
        },
        remote : {
            url : "/api",
            endpoints: ["publish", "athlete", "athlete_routes", "athlete_activities","modules","user_all", "user_layout","user_circ","user_url","user_units","user_circ","photos","photos_random","weather"]
        }
    },
    resetConnection: `Trouble connecting? <a href="#" onclick="V.opts.updateLocal('http://127.0.0.1:3001')">Try resetting your connection settings!</a></p>`,
    urls: {
        local: [],
        remote : []
    },
    UPDATEFREQ : 1000,
    MPHFORM : '0,000.00',
    colors: {
        GOOD : "#28a745",
        GOODBG : "#53F377",
        BAD : "#dc3545",
        BADBG :  "#E27A84",
        MAINBG : "rgba(255,255,255,.95)",
        MAINTXT: "#000"
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
                    },
                    gridLines: {
                        drawOnChartArea: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    gridLines: {
                        drawOnChartArea: false
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
Options.generateUrls();
export {Options};