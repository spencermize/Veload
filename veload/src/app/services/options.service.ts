import { Injectable } from '@angular/core';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private options = {
    urlComponents: {
      local: {
        url: 'http://127.0.0.1:3001',
        endpoints: ['stats', 'circ']
      },
      remote: {
        url: '/api',
        endpoints: ['publish', 'athlete', 'rwgpsRouteSearch', 'rwgpsRouteGPX', 'workoutTemplate', 'athlete_routes', 'athlete_activities', 'modules', 'user_all', 'user_workoutTemplates', 'user_layout', 'user_hr', 'user_speed', 'user_modes', 'user_cadence', 'user_circ', 'user_url', 'user_units', 'user_circ', 'photos', 'photos_random', 'weather']
      }
    },

    urls: {
      local: [],
      remote: []
    },
    UPDATEFREQ: 1000,

    colors: {
      GOOD: '#28a745',
      GOODBG: '#53F377',
      BAD: '#dc3545',
      BADBG: '#E27A84',
      MAINBG: 'rgba(255,255,255,.95)',
      MAINTXT: '#000'
    },

    chart: {
      line: {
        type: 'line',
        data: {
          datasets: [{
            data: [],
            pointRadius: 3,
            pointBackgroundColor: []
          }]
        },
        defaults: {
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
              type: 'realtime', //x axis will auto-scroll from right to left
              realtime: {
                duration: 1000 * 60, //data in the past 1m will be displayed
                delay: 2000, //delay of 2000 ms, so upcoming values are known before plotting a line
                pause: true,
                ttl: 99999999999 //data will not be automatically deleted as it disappears off the chart
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
          annotation: {
            annotations: [{
              drawTime: 'afterDatasetsDraw', //overrides annotation.drawTime if set
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: '0',
              borderColor: 'transparent',
              borderWidth: 2
            }]
          },
          plugins: {
            streaming: {
              frameRate: 15
            }
          },
          legend: {
            display: false
          },
          pan: {
            enabled: true,
            mode: 'x',
            rangeMax: {
              x: null
            },
            rangeMin: {
              x: null
            }
          },
          zoom: {
            enabled: true,
            mode: 'x',
            rangeMax: {
              x: null
            },
            rangeMin: {
              x: null
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      },
      gauge: {
        type: 'tsgauge',
        data: {
          datasets: [{
            backgroundColor: [],
            borderWidth: 0,
            gaugeData: {
              value: 0
            },
            gaugeLimits: []
          }]
        },
        options: {
          events: [],
          showMarkers: false,
          plugins: {
            streaming: false
          },
          animation: {
            animateRotate: false,
            duration: 0
          }
        }
      }
    }
  };

  options$:BehaviorSubject<any> = new BehaviorSubject(this.options);

  constructor() {
    this.generateUrls();
  }
  public get(key:string){
    return this.options[key];
  }

  public set(key:string,value:any){
    this.options[key] = value;
    this.options$.next(this.options);
  }
  
  private generateUrls() {
    _.forEach(this.options.urlComponents, function (key, value) {
      _.forEach(key.endpoints, function (val) {
        let k = val.replace('_', '/');
        let l = _.camelCase(val);
        this.options.urls[value][l] = `${key.url}/${k}`;
      });
    });
    this.options$.next(this.options);
  };

  public updateLocal(server) {
    this.options.urlComponents.local.url = server;
    this.generateUrls();
    this.options$.next(this.options);
  }

  public toBarbarianph = function (mps) {
    return mps * 2.23694;
  };
  public toKph(mps) {
    return mps * 3.6;
  };
  public toBarbarian(m) {
    return m / 1609.344;
  };
  public toK(m) {
    return m / 1000;
  };
  public toM(km) {
    return km * 1000;
  };
  public toMFromBarb(mi) {
    return mi * 1609.34;
  };

}
