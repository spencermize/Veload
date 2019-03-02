export default {
	'opts': {
		'urlComponents': {
			'local': {
				'url': 'http://127.0.0.1:3001',
				'endpoints': [
					'stats',
					'circ'
				]
			},
			'remote': {
				'url': '/api',
				'endpoints': [
					'publish',
					'athlete',
					'rwgpsRouteSearch',
					'rwgpsRouteGPX',
					'workoutTemplate',
					'athlete_routes',
					'athlete_activities',
					'modules',
					'user_all',
					'user_workoutTemplates',
					'user_layout',
					'user_hr',
					'user_speed',
					'user_modes',
					'user_cadence',
					'user_circ',
					'user_url',
					'user_units',
					'user_circ',
					'photos',
					'photos_random',
					'weather'
				]
			}
		},
		'resetConnection': "Trouble connecting? <a href=\"#\" onclick=\"V.opts.updateLocal('http://127.0.0.1:3001')\">Try resetting your connection settings!</a></p>",
		'urls': {
			'local': [],
			'remote': []
		},
		'UPDATEFREQ': 1000,
		'colors': {
			'GOOD': '#28a745',
			'GOODBG': '#53F377',
			'BAD': '#dc3545',
			'BADBG': '#E27A84',
			'MAINBG': 'rgba(201, 203, 204, 0.9)',
			'MAINTXT': 'rgb(0, 0, 0)',
			'DARK': 'rgb(102, 124, 147)',
			'DARKER': 'rgb(36, 56, 76)'
		},
		'chart': {
			'line': {
				'type': 'line',
				'data': {
					'datasets': [
						{
							'data': [],
							'pointRadius': 3,
							'pointBackgroundColor': []
						}
					]
				},
				'defaults': {
					'global': {
						'defaultFontFamily': 'Work Sans'
					}
				},
				'options': {
					'tooltips': {
						'enabled': false
					},
					'scales': {
						'xAxes': [
							{
								'type': 'realtime',
								'realtime': {
									'duration': 60000,
									'delay': 2000,
									'pause': true,
									'ttl': 99999999999
								},
								'gridLines': {
									'drawOnChartArea': false
								}
							}
						],
						'yAxes': [
							{
								'ticks': {
									'beginAtZero': true
								},
								'gridLines': {
									'drawOnChartArea': false
								}
							}
						]
					},
					'annotation': {
						'annotations': [
							{
								'drawTime': 'afterDatasetsDraw',
								'type': 'line',
								'mode': 'horizontal',
								'scaleID': 'y-axis-0',
								'value': '0',
								'borderColor': 'transparent',
								'borderWidth': 2
							}
						]
					},
					'plugins': {
						'streaming': {
							'frameRate': 15
						}
					},
					'legend': {
						'display': false
					},
					'pan': {
						'enabled': true,
						'mode': 'x',
						'rangeMax': {
							'x': null
						},
						'rangeMin': {
							'x': null
						}
					},
					'zoom': {
						'enabled': true,
						'mode': 'x',
						'rangeMax': {
							'x': null
						},
						'rangeMin': {
							'x': null
						}
					},
					'responsive': true,
					'maintainAspectRatio': false
				}
			},
			'gauge': {
				'type': 'tsgauge',
				'data': {
					'datasets': [
						{
							'backgroundColor': [],
							'borderWidth': 0,
							'gaugeData': {
								'value': 0
							},
							'gaugeLimits': []
						}
					]
				},
				'options': {
					'events': [],
					'showMarkers': false,
					'plugins': {
						'streaming': false
					},
					'animation': {
						'animateRotate': false,
						'duration': 0
					}
				}
			}
		}
	},
	'status': {
		'speed': -1,
		'cadence': -1,
		'hr': -1,
		'status': 'Ant+',
		'sensors': {
			'hr': false,
			'speed': false,
			'cadence': false
		},
		'stick': 'GarminStick2',
		'circ': 2.12
	},
	'rTrail': [
		{
			'distance': 6.979669502675636,
			'bearing': 354.5607312151284,
			'latitude': 48.19976,
			'longitude': 16.33834,
			'latlng': {
				'lat': 48.19976,
				'lng': 16.33834
			}
		},
		{
			'distance': 96.7437379083901,
			'bearing': 346.25944698551797,
			'latitude': 48.200605,
			'longitude': 16.33803,
			'latlng': {
				'lat': 48.200605,
				'lng': 16.33803
			}
		},
		{
			'distance': 96.74366111612906,
			'bearing': 346.2596650482131,
			'latitude': 48.20145,
			'longitude': 16.33772,
			'latlng': {
				'lat': 48.20145,
				'lng': 16.33772
			}
		},
		{
			'distance': 18.91763094721369,
			'bearing': 2.2452200359869607,
			'latitude': 48.20162,
			'longitude': 16.33773,
			'latlng': {
				'lat': 48.20162,
				'lng': 16.33773
			}
		},
		{
			'distance': 75.03225297835239,
			'bearing': 353.19260967498224,
			'latitude': 48.20229,
			'longitude': 16.33761,
			'latlng': {
				'lat': 48.20229,
				'lng': 16.33761
			}
		},
		{
			'distance': 15.138434609418807,
			'bearing': 323.97940539149295,
			'latitude': 48.2024,
			'longitude': 16.33749,
			'latlng': {
				'lat': 48.2024,
				'lng': 16.33749
			}
		},
		{
			'distance': 84.47936739402971,
			'bearing': 356.1267421834704,
			'latitude': 48.203158,
			'longitude': 16.337413,
			'latlng': {
				'lat': 48.203158,
				'lng': 16.337413
			}
		},
		{
			'distance': 84.37350955191923,
			'bearing': 356.07148749616874,
			'latitude': 48.203915,
			'longitude': 16.337335,
			'latlng': {
				'lat': 48.203915,
				'lng': 16.337335
			}
		},
		{
			'distance': 84.47937822976142,
			'bearing': 356.1268563943476,
			'latitude': 48.204673,
			'longitude': 16.337258,
			'latlng': {
				'lat': 48.204673,
				'lng': 16.337258
			}
		},
		{
			'distance': 84.37352004224482,
			'bearing': 356.0716033294645,
			'latitude': 48.20543,
			'longitude': 16.33718,
			'latlng': {
				'lat': 48.20543,
				'lng': 16.33718
			}
		},
		{
			'distance': 21.583958477019756,
			'bearing': 267.0382637794843,
			'latitude': 48.20542,
			'longitude': 16.33689,
			'latlng': {
				'lat': 48.20542,
				'lng': 16.33689
			}
		},
		{
			'distance': 12.922813498435044,
			'bearing': 320.83502458508826,
			'latitude': 48.20551,
			'longitude': 16.33678,
			'latlng': {
				'lat': 48.20551,
				'lng': 16.33678
			}
		},
		{
			'distance': 74.55949932336374,
			'bearing': 357.72150693992256,
			'latitude': 48.20618,
			'longitude': 16.33674,
			'latlng': {
				'lat': 48.20618,
				'lng': 16.33674
			}
		},
		{
			'distance': 99.71993678962986,
			'bearing': 23.345374470862453,
			'latitude': 48.207003,
			'longitude': 16.337273,
			'latlng': {
				'lat': 48.207003,
				'lng': 16.337273
			}
		},
		{
			'distance': 99.85127010385398,
			'bearing': 23.358802096094223,
			'latitude': 48.207827,
			'longitude': 16.337807,
			'latlng': {
				'lat': 48.207827,
				'lng': 16.337807
			}
		},
		{
			'distance': 99.71945636423555,
			'bearing': 23.34470409242897,
			'latitude': 48.20865,
			'longitude': 16.33834,
			'latlng': {
				'lat': 48.20865,
				'lng': 16.33834
			}
		},
		{
			'distance': 67.20106757970488,
			'bearing': 22.02861560174,
			'latitude': 48.20921,
			'longitude': 16.33868,
			'latlng': {
				'lat': 48.20921,
				'lng': 16.33868
			}
		},
		{
			'distance': 54.894319136851635,
			'bearing': 6.978356869817503,
			'latitude': 48.2097,
			'longitude': 16.33877,
			'latlng': {
				'lat': 48.2097,
				'lng': 16.33877
			}
		},
		{
			'distance': 51.31250541924873,
			'bearing': 4.555605421209805,
			'latitude': 48.21016,
			'longitude': 16.338825,
			'latlng': {
				'lat': 48.21016,
				'lng': 16.338825
			}
		},
		{
			'distance': 51.31250660282529,
			'bearing': 4.555564672376363,
			'latitude': 48.21062,
			'longitude': 16.33888,
			'latlng': {
				'lat': 48.21062,
				'lng': 16.33888
			}
		},
		{
			'distance': 53.37332294050332,
			'bearing': 0,
			'latitude': 48.2111,
			'longitude': 16.33888,
			'latlng': {
				'lat': 48.2111,
				'lng': 16.33888
			}
		},
		{
			'distance': 53.37332741675925,
			'bearing': 0,
			'latitude': 48.21158,
			'longitude': 16.33888,
			'latlng': {
				'lat': 48.21158,
				'lng': 16.33888
			}
		},
		{
			'distance': 27.957112403295575,
			'bearing': 6.0859162998201555,
			'latitude': 48.21183,
			'longitude': 16.33892,
			'latlng': {
				'lat': 48.21183,
				'lng': 16.33892
			}
		},
		{
			'distance': 26.4349288905353,
			'bearing': 14.61476053833303,
			'latitude': 48.21206,
			'longitude': 16.33901,
			'latlng': {
				'lat': 48.21206,
				'lng': 16.33901
			}
		},
		{
			'distance': 14.905334433935614,
			'bearing': 85.70890486364732,
			'latitude': 48.21207,
			'longitude': 16.33921,
			'latlng': {
				'lat': 48.21207,
				'lng': 16.33921
			}
		},
		{
			'distance': 24.251878231018775,
			'bearing': 117.35996287041479,
			'latitude': 48.21197,
			'longitude': 16.3395,
			'latlng': {
				'lat': 48.21197,
				'lng': 16.3395
			}
		},
		{
			'distance': 14.90536040623635,
			'bearing': 85.70891237191643,
			'latitude': 48.21198,
			'longitude': 16.3397,
			'latlng': {
				'lat': 48.21198,
				'lng': 16.3397
			}
		},
		{
			'distance': 19.26955264605462,
			'bearing': 117.56293518450951,
			'latitude': 48.2119,
			'longitude': 16.33993,
			'latlng': {
				'lat': 48.2119,
				'lng': 16.33993
			}
		},
		{
			'distance': 16.944411084880695,
			'bearing': 105.26133941989303,
			'latitude': 48.21186,
			'longitude': 16.34015,
			'latlng': {
				'lat': 48.21186,
				'lng': 16.34015
			}
		},
		{
			'distance': 6.780533350006011,
			'bearing': 99.46631051980859,
			'latitude': 48.21185,
			'longitude': 16.34024,
			'latlng': {
				'lat': 48.21185,
				'lng': 16.34024
			}
		},
		{
			'distance': 6.780533349940066,
			'bearing': 279.46637762256927,
			'latitude': 48.21186,
			'longitude': 16.34015,
			'latlng': {
				'lat': 48.21186,
				'lng': 16.34015
			}
		},
		{
			'distance': 16.944411084725488,
			'bearing': 285.2615034553199,
			'latitude': 48.2119,
			'longitude': 16.33993,
			'latlng': {
				'lat': 48.2119,
				'lng': 16.33993
			}
		},
		{
			'distance': 7.474415788363266,
			'bearing': 296.57503141325986,
			'latitude': 48.21193,
			'longitude': 16.33984,
			'latlng': {
				'lat': 48.21193,
				'lng': 16.33984
			}
		},
		{
			'distance': 9.950626788841612,
			'bearing': 206.55514063187522,
			'latitude': 48.21185,
			'longitude': 16.33978,
			'latlng': {
				'lat': 48.21185,
				'lng': 16.33978
			}
		},
		{
			'distance': 75.03217928591724,
			'bearing': 186.80622115703787,
			'latitude': 48.21118,
			'longitude': 16.33966,
			'latlng': {
				'lat': 48.21118,
				'lng': 16.33966
			}
		},
		{
			'distance': 4.975327088284326,
			'bearing': 153.44454391575277,
			'latitude': 48.21114,
			'longitude': 16.33969,
			'latlng': {
				'lat': 48.21114,
				'lng': 16.33969
			}
		},
		{
			'distance': 77.52105934630151,
			'bearing': 99.10447932505139,
			'latitude': 48.21103,
			'longitude': 16.34072,
			'latlng': {
				'lat': 48.21103,
				'lng': 16.34072
			}
		},
		{
			'distance': 77.52122120071785,
			'bearing': 99.10446009372032,
			'latitude': 48.21092,
			'longitude': 16.34175,
			'latlng': {
				'lat': 48.21092,
				'lng': 16.34175
			}
		},
		{
			'distance': 77.5213830549736,
			'bearing': 99.104440865036,
			'latitude': 48.21081,
			'longitude': 16.34278,
			'latlng': {
				'lat': 48.21081,
				'lng': 16.34278
			}
		},
		{
			'distance': 77.52154490901297,
			'bearing': 99.1044216351986,
			'latitude': 48.2107,
			'longitude': 16.34381,
			'latlng': {
				'lat': 48.2107,
				'lng': 16.34381
			}
		},
		{
			'distance': 4.012358827720893,
			'bearing': 33.67920143956405,
			'latitude': 48.21073,
			'longitude': 16.34384,
			'latlng': {
				'lat': 48.21073,
				'lng': 16.34384
			}
		},
		{
			'distance': 62.82485055360104,
			'bearing': 0,
			'latitude': 48.211295,
			'longitude': 16.34384,
			'latlng': {
				'lat': 48.211295,
				'lng': 16.34384
			}
		},
		{
			'distance': 62.82485675788159,
			'bearing': 0,
			'latitude': 48.21186,
			'longitude': 16.34384,
			'latlng': {
				'lat': 48.21186,
				'lng': 16.34384
			}
		},
		{
			'distance': 12.58746303414295,
			'bearing': 13.621288106465443,
			'latitude': 48.21197,
			'longitude': 16.34388,
			'latlng': {
				'lat': 48.21197,
				'lng': 16.34388
			}
		},
		{
			'distance': 12.587463033838082,
			'bearing': 193.62131793088346,
			'latitude': 48.21186,
			'longitude': 16.34384,
			'latlng': {
				'lat': 48.21186,
				'lng': 16.34384
			}
		},
		{
			'distance': 62.82485675788159,
			'bearing': 180,
			'latitude': 48.211295,
			'longitude': 16.34384,
			'latlng': {
				'lat': 48.211295,
				'lng': 16.34384
			}
		},
		{
			'distance': 62.82485055360104,
			'bearing': 180,
			'latitude': 48.21073,
			'longitude': 16.34384,
			'latlng': {
				'lat': 48.21073,
				'lng': 16.34384
			}
		},
		{
			'distance': 4.012358827761282,
			'bearing': 213.6792238079129,
			'latitude': 48.2107,
			'longitude': 16.34381,
			'latlng': {
				'lat': 48.2107,
				'lng': 16.34381
			}
		},
		{
			'distance': 4.595802934631839,
			'bearing': 75.95820149260982,
			'latitude': 48.21071,
			'longitude': 16.34387,
			'latlng': {
				'lat': 48.21071,
				'lng': 16.34387
			}
		},
		{
			'distance': 8.829691282907229,
			'bearing': 112.25721870752614,
			'latitude': 48.21068,
			'longitude': 16.34398,
			'latlng': {
				'lat': 48.21068,
				'lng': 16.34398
			}
		},
		{
			'distance': 182.51426904898867,
			'bearing': 74.76867452750935,
			'latitude': 48.21111,
			'longitude': 16.34635,
			'latlng': {
				'lat': 48.21111,
				'lng': 16.34635
			}
		},
		{
			'distance': 8.140085635226109,
			'bearing': 313.1643901554836,
			'latitude': 48.21116,
			'longitude': 16.34627,
			'latlng': {
				'lat': 48.21116,
				'lng': 16.34627
			}
		},
		{
			'distance': 5.349798376000449,
			'bearing': 146.32099190137438,
			'latitude': 48.21112,
			'longitude': 16.34631,
			'latlng': {
				'lat': 48.21112,
				'lng': 16.34631
			}
		},
		{
			'distance': 6.844558310565589,
			'bearing': 130.61310382645217,
			'latitude': 48.21108,
			'longitude': 16.34638,
			'latlng': {
				'lat': 48.21108,
				'lng': 16.34638
			}
		},
		{
			'distance': 57.45278275702884,
			'bearing': 109.2622270451555,
			'latitude': 48.21091,
			'longitude': 16.34711,
			'latlng': {
				'lat': 48.21091,
				'lng': 16.34711
			}
		},
		{
			'distance': 25.585513546277248,
			'bearing': 181.65960245481745,
			'latitude': 48.21068,
			'longitude': 16.3471,
			'latlng': {
				'lat': 48.21068,
				'lng': 16.3471
			}
		},
		{
			'distance': 1.111944192263126,
			'bearing': 180,
			'latitude': 48.21067,
			'longitude': 16.3471,
			'latlng': {
				'lat': 48.21067,
				'lng': 16.3471
			}
		},
		{
			'distance': 26.697008060735406,
			'bearing': 1.5904814964629281,
			'latitude': 48.21091,
			'longitude': 16.34711,
			'latlng': {
				'lat': 48.21091,
				'lng': 16.34711
			}
		},
		{
			'distance': 69.19645455189469,
			'bearing': 355.0855200748607,
			'latitude': 48.21153,
			'longitude': 16.34703,
			'latlng': {
				'lat': 48.21153,
				'lng': 16.34703
			}
		},
		{
			'distance': 69.19645582890524,
			'bearing': 355.0855792861133,
			'latitude': 48.21215,
			'longitude': 16.34695,
			'latlng': {
				'lat': 48.21215,
				'lng': 16.34695
			}
		},
		{
			'distance': 8.032520889069264,
			'bearing': 303.70170919885965,
			'latitude': 48.21219,
			'longitude': 16.34686,
			'latlng': {
				'lat': 48.21219,
				'lng': 16.34686
			}
		},
		{
			'distance': 50.6897943699906,
			'bearing': 284.65379641532746,
			'latitude': 48.212305,
			'longitude': 16.3462,
			'latlng': {
				'lat': 48.212305,
				'lng': 16.3462
			}
		},
		{
			'distance': 50.68968815782215,
			'bearing': 284.6538279094792,
			'latitude': 48.21242,
			'longitude': 16.34554,
			'latlng': {
				'lat': 48.21242,
				'lng': 16.34554
			}
		},
		{
			'distance': 13.670469489758617,
			'bearing': 12.523394802623557,
			'latitude': 48.21254,
			'longitude': 16.34558,
			'latlng': {
				'lat': 48.21254,
				'lng': 16.34558
			}
		},
		{
			'distance': 11.741095448136575,
			'bearing': 304.7071820475928,
			'latitude': 48.2126,
			'longitude': 16.34545,
			'latlng': {
				'lat': 48.2126,
				'lng': 16.34545
			}
		},
		{
			'distance': 7.614076987061312,
			'bearing': 43.012241610193485,
			'latitude': 48.21265,
			'longitude': 16.34552,
			'latlng': {
				'lat': 48.21265,
				'lng': 16.34552
			}
		},
		{
			'distance': 1.856255878996457,
			'bearing': 306.8822378044902,
			'latitude': 48.21266,
			'longitude': 16.3455,
			'latlng': {
				'lat': 48.21266,
				'lng': 16.3455
			}
		},
		{
			'distance': 39.516648958485135,
			'bearing': 29.200176649643936,
			'latitude': 48.21297,
			'longitude': 16.34576,
			'latlng': {
				'lat': 48.21297,
				'lng': 16.34576
			}
		},
		{
			'distance': 26.586304723131956,
			'bearing': 305.92224117930033,
			'latitude': 48.21311,
			'longitude': 16.34547,
			'latlng': {
				'lat': 48.21311,
				'lng': 16.34547
			}
		},
		{
			'distance': 29.72699673046538,
			'bearing': 89.99985087418031,
			'latitude': 48.21311,
			'longitude': 16.34587,
			'latlng': {
				'lat': 48.21311,
				'lng': 16.34587
			}
		},
		{
			'distance': 52.46751279337264,
			'bearing': 86.95356794558279,
			'latitude': 48.213135,
			'longitude': 16.346575,
			'latlng': {
				'lat': 48.213135,
				'lng': 16.346575
			}
		},
		{
			'distance': 52.467487325586426,
			'bearing': 86.95356646140522,
			'latitude': 48.21316,
			'longitude': 16.34728,
			'latlng': {
				'lat': 48.21316,
				'lng': 16.34728
			}
		},
		{
			'distance': 97.8298449758803,
			'bearing': 85.8810006703082,
			'latitude': 48.213223,
			'longitude': 16.348593,
			'latlng': {
				'lat': 48.213223,
				'lng': 16.348593
			}
		},
		{
			'distance': 97.9118703364843,
			'bearing': 85.81902488843735,
			'latitude': 48.213287,
			'longitude': 16.349907,
			'latlng': {
				'lat': 48.213287,
				'lng': 16.349907
			}
		},
		{
			'distance': 97.82960430918301,
			'bearing': 85.88099048971912,
			'latitude': 48.21335,
			'longitude': 16.35122,
			'latlng': {
				'lat': 48.21335,
				'lng': 16.35122
			}
		},
		{
			'distance': 62.17671335211144,
			'bearing': 86.40033594417667,
			'latitude': 48.213385,
			'longitude': 16.352055,
			'latlng': {
				'lat': 48.213385,
				'lng': 16.352055
			}
		},
		{
			'distance': 62.176671146228614,
			'bearing': 86.40033349145921,
			'latitude': 48.21342,
			'longitude': 16.35289,
			'latlng': {
				'lat': 48.21342,
				'lng': 16.35289
			}
		},
		{
			'distance': 22.322822104903054,
			'bearing': 87.13615827999661,
			'latitude': 48.21343,
			'longitude': 16.35319,
			'latlng': {
				'lat': 48.21343,
				'lng': 16.35319
			}
		},
		{
			'distance': 75.76639224104325,
			'bearing': 356.35546239113177,
			'latitude': 48.21411,
			'longitude': 16.353125,
			'latlng': {
				'lat': 48.21411,
				'lng': 16.353125
			}
		},
		{
			'distance': 75.76639713284156,
			'bearing': 356.35551066253186,
			'latitude': 48.21479,
			'longitude': 16.35306,
			'latlng': {
				'lat': 48.21479,
				'lng': 16.35306
			}
		},
		{
			'distance': 69.03352077993199,
			'bearing': 93.70476234363741,
			'latitude': 48.21475,
			'longitude': 16.353987,
			'latlng': {
				'lat': 48.21475,
				'lng': 16.353987
			}
		},
		{
			'distance': 68.95941374920723,
			'bearing': 93.70874986094213,
			'latitude': 48.21471,
			'longitude': 16.354913,
			'latlng': {
				'lat': 48.21471,
				'lng': 16.354913
			}
		},
		{
			'distance': 69.03362786876559,
			'bearing': 93.70475657157738,
			'latitude': 48.21467,
			'longitude': 16.35584,
			'latlng': {
				'lat': 48.21467,
				'lng': 16.35584
			}
		},
		{
			'distance': 31.737746140014963,
			'bearing': 110.56506717564804,
			'latitude': 48.21457,
			'longitude': 16.35624,
			'latlng': {
				'lat': 48.21457,
				'lng': 16.35624
			}
		},
		{
			'distance': 24.719047694317418,
			'bearing': 122.74775371197234,
			'latitude': 48.21445,
			'longitude': 16.35652,
			'latlng': {
				'lat': 48.21445,
				'lng': 16.35652
			}
		},
		{
			'distance': 64.80115223543766,
			'bearing': 102.9264558817373,
			'latitude': 48.21432,
			'longitude': 16.35737,
			'latlng': {
				'lat': 48.21432,
				'lng': 16.35737
			}
		},
		{
			'distance': 71.01760112614885,
			'bearing': 100.40321702455384,
			'latitude': 48.214205,
			'longitude': 16.35831,
			'latlng': {
				'lat': 48.214205,
				'lng': 16.35831
			}
		},
		{
			'distance': 71.0177549519355,
			'bearing': 100.40319417089586,
			'latitude': 48.21409,
			'longitude': 16.35925,
			'latlng': {
				'lat': 48.21409,
				'lng': 16.35925
			}
		},
		{
			'distance': 19.268931218963235,
			'bearing': 117.56390368245411,
			'latitude': 48.21401,
			'longitude': 16.35948,
			'latlng': {
				'lat': 48.21401,
				'lng': 16.35948
			}
		},
		{
			'distance': 47.15034544576895,
			'bearing': 102.28937113118832,
			'latitude': 48.21392,
			'longitude': 16.3601,
			'latlng': {
				'lat': 48.21392,
				'lng': 16.3601
			}
		},
		{
			'distance': 4.689552057961194,
			'bearing': 198.4268324344708,
			'latitude': 48.21388,
			'longitude': 16.36008,
			'latlng': {
				'lat': 48.21388,
				'lng': 16.36008
			}
		},
		{
			'distance': 46.197486657990105,
			'bearing': 281.1345516766356,
			'latitude': 48.21396,
			'longitude': 16.35947,
			'latlng': {
				'lat': 48.21396,
				'lng': 16.35947
			}
		},
		{
			'distance': 11.21834574855582,
			'bearing': 7.591072403251758,
			'latitude': 48.21406,
			'longitude': 16.35949,
			'latlng': {
				'lat': 48.21406,
				'lng': 16.35949
			}
		},
		{
			'distance': 5.754969689434991,
			'bearing': 345.075383465989,
			'latitude': 48.21411,
			'longitude': 16.35947,
			'latlng': {
				'lat': 48.21411,
				'lng': 16.35947
			}
		},
		{
			'distance': 18.75820264658789,
			'bearing': 341.57330215968426,
			'latitude': 48.21427,
			'longitude': 16.35939,
			'latlng': {
				'lat': 48.21427,
				'lng': 16.35939
			}
		},
		{
			'distance': 17.471596055837274,
			'bearing': 17.27364986891564,
			'latitude': 48.21442,
			'longitude': 16.35946,
			'latlng': {
				'lat': 48.21442,
				'lng': 16.35946
			}
		},
		{
			'distance': 72.61720586693536,
			'bearing': 31.728998984181374,
			'latitude': 48.214975,
			'longitude': 16.359975,
			'latlng': {
				'lat': 48.214975,
				'lng': 16.359975
			}
		},
		{
			'distance': 72.61699296281677,
			'bearing': 31.728721180257708,
			'latitude': 48.21553,
			'longitude': 16.36049,
			'latlng': {
				'lat': 48.21553,
				'lng': 16.36049
			}
		},
		{
			'distance': 24.07345731657871,
			'bearing': 326.3233871902886,
			'latitude': 48.21571,
			'longitude': 16.36031,
			'latlng': {
				'lat': 48.21571,
				'lng': 16.36031
			}
		},
		{
			'distance': 10.439646629822635,
			'bearing': 16.49640536212638,
			'latitude': 48.2158,
			'longitude': 16.36035,
			'latlng': {
				'lat': 48.2158,
				'lng': 16.36035
			}
		},
		{
			'distance': 8.032126630650122,
			'bearing': 56.29640539293973,
			'latitude': 48.21584,
			'longitude': 16.36044,
			'latlng': {
				'lat': 48.21584,
				'lng': 16.36044
			}
		},
		{
			'distance': 13.018760492493165,
			'bearing': 160.02624543648085,
			'latitude': 48.21573,
			'longitude': 16.3605,
			'latlng': {
				'lat': 48.21573,
				'lng': 16.3605
			}
		},
		{
			'distance': 31.522466263368386,
			'bearing': 151.93947521851828,
			'latitude': 48.21548,
			'longitude': 16.3607,
			'latlng': {
				'lat': 48.21548,
				'lng': 16.3607
			}
		},
		{
			'distance': 59.472973909115595,
			'bearing': 145.43105277888333,
			'latitude': 48.21504,
			'longitude': 16.361155,
			'latlng': {
				'lat': 48.21504,
				'lng': 16.361155
			}
		},
		{
			'distance': 59.473135526264514,
			'bearing': 145.43082273400375,
			'latitude': 48.2146,
			'longitude': 16.36161,
			'latlng': {
				'lat': 48.2146,
				'lng': 16.36161
			}
		},
		{
			'distance': 13.909892462487472,
			'bearing': 136.09477446137544,
			'latitude': 48.21451,
			'longitude': 16.36174,
			'latlng': {
				'lat': 48.21451,
				'lng': 16.36174
			}
		},
		{
			'distance': 23.481611358424654,
			'bearing': 124.70802131893072,
			'latitude': 48.21439,
			'longitude': 16.362,
			'latlng': {
				'lat': 48.21439,
				'lng': 16.362
			}
		},
		{
			'distance': 38.7311211933663,
			'bearing': 143.5821534740096,
			'latitude': 48.21411,
			'longitude': 16.36231,
			'latlng': {
				'lat': 48.21411,
				'lng': 16.36231
			}
		},
		{
			'distance': 21.017014442401727,
			'bearing': 137.87588676107896,
			'latitude': 48.21397,
			'longitude': 16.3625,
			'latlng': {
				'lat': 48.21397,
				'lng': 16.3625
			}
		},
		{
			'distance': 22.909960311251517,
			'bearing': 150.95682721999708,
			'latitude': 48.21379,
			'longitude': 16.36265,
			'latlng': {
				'lat': 48.21379,
				'lng': 16.36265
			}
		},
		{
			'distance': 58.136328559519505,
			'bearing': 145.40965672933078,
			'latitude': 48.21336,
			'longitude': 16.363095,
			'latlng': {
				'lat': 48.21336,
				'lng': 16.363095
			}
		},
		{
			'distance': 58.13648311587868,
			'bearing': 145.40943186166436,
			'latitude': 48.21293,
			'longitude': 16.36354,
			'latlng': {
				'lat': 48.21293,
				'lng': 16.36354
			}
		},
		{
			'distance': 42.79789535685226,
			'bearing': 326.32213297190526,
			'latitude': 48.21325,
			'longitude': 16.36322,
			'latlng': {
				'lat': 48.21325,
				'lng': 16.36322
			}
		},
		{
			'distance': 55.964450675176536,
			'bearing': 49.69454660999082,
			'latitude': 48.213575,
			'longitude': 16.363795,
			'latlng': {
				'lat': 48.213575,
				'lng': 16.363795
			}
		},
		{
			'distance': 55.964245520215925,
			'bearing': 49.69436721125106,
			'latitude': 48.2139,
			'longitude': 16.36437,
			'latlng': {
				'lat': 48.2139,
				'lng': 16.36437
			}
		},
		{
			'distance': 47.002848305364004,
			'bearing': 53.65998984250706,
			'latitude': 48.21415,
			'longitude': 16.36488,
			'latlng': {
				'lat': 48.21415,
				'lng': 16.36488
			}
		},
		{
			'distance': 47.002848305668145,
			'bearing': 233.66037011854405,
			'latitude': 48.2139,
			'longitude': 16.36437,
			'latlng': {
				'lat': 48.2139,
				'lng': 16.36437
			}
		},
		{
			'distance': 50.83168806794244,
			'bearing': 140.0468597459079,
			'latitude': 48.21355,
			'longitude': 16.36481,
			'latlng': {
				'lat': 48.21355,
				'lng': 16.36481
			}
		},
		{
			'distance': 22.27483809998948,
			'bearing': 53.11716719660245,
			'latitude': 48.21367,
			'longitude': 16.36505,
			'latlng': {
				'lat': 48.21367,
				'lng': 16.36505
			}
		},
		{
			'distance': 64.37455808732852,
			'bearing': 52.72031785433148,
			'latitude': 48.21402,
			'longitude': 16.36574,
			'latlng': {
				'lat': 48.21402,
				'lng': 16.36574
			}
		},
		{
			'distance': 64.12480487761964,
			'bearing': 144.66750942912347,
			'latitude': 48.21355,
			'longitude': 16.36624,
			'latlng': {
				'lat': 48.21355,
				'lng': 16.36624
			}
		},
		{
			'distance': 58.09461759323656,
			'bearing': 54.87511089976152,
			'latitude': 48.21385,
			'longitude': 16.36688,
			'latlng': {
				'lat': 48.21385,
				'lng': 16.36688
			}
		},
		{
			'distance': 14.925826506475943,
			'bearing': 333.44581915233823,
			'latitude': 48.21397,
			'longitude': 16.36679,
			'latlng': {
				'lat': 48.21397,
				'lng': 16.36679
			}
		},
		{
			'distance': 52.977070504313,
			'bearing': 322.98293136258525,
			'latitude': 48.21435,
			'longitude': 16.36636,
			'latlng': {
				'lat': 48.21435,
				'lng': 16.36636
			}
		},
		{
			'distance': 56.840461675863715,
			'bearing': 326.32293246038637,
			'latitude': 48.214775,
			'longitude': 16.365935,
			'latlng': {
				'lat': 48.214775,
				'lng': 16.365935
			}
		},
		{
			'distance': 56.84031935649501,
			'bearing': 326.3231519203744,
			'latitude': 48.2152,
			'longitude': 16.36551,
			'latlng': {
				'lat': 48.2152,
				'lng': 16.36551
			}
		},
		{
			'distance': 84.03948810283107,
			'bearing': 55.24299446060775,
			'latitude': 48.21563,
			'longitude': 16.36644,
			'latlng': {
				'lat': 48.21563,
				'lng': 16.36644
			}
		},
		{
			'distance': 84.03901424122581,
			'bearing': 55.242769078150786,
			'latitude': 48.21606,
			'longitude': 16.36737,
			'latlng': {
				'lat': 48.21606,
				'lng': 16.36737
			}
		},
		{
			'distance': 84.03854037649853,
			'bearing': 55.242543691825404,
			'latitude': 48.21649,
			'longitude': 16.3683,
			'latlng': {
				'lat': 48.21649,
				'lng': 16.3683
			}
		},
		{
			'distance': 84.03806651045953,
			'bearing': 55.2423183014331,
			'latitude': 48.21692,
			'longitude': 16.36923,
			'latlng': {
				'lat': 48.21692,
				'lng': 16.36923
			}
		},
		{
			'distance': 84.03759264188608,
			'bearing': 55.242092906881965,
			'latitude': 48.21735,
			'longitude': 16.37016,
			'latlng': {
				'lat': 48.21735,
				'lng': 16.37016
			}
		},
		{
			'distance': 15.513543834441641,
			'bearing': 106.70768248583954,
			'latitude': 48.21731,
			'longitude': 16.37036,
			'latlng': {
				'lat': 48.21731,
				'lng': 16.37036
			}
		},
		{
			'distance': 56.34157499163695,
			'bearing': 145.0685715254529,
			'latitude': 48.216895,
			'longitude': 16.370795,
			'latlng': {
				'lat': 48.216895,
				'lng': 16.370795
			}
		},
		{
			'distance': 56.34172213783204,
			'bearing': 145.06835350881806,
			'latitude': 48.21648,
			'longitude': 16.37123,
			'latlng': {
				'lat': 48.21648,
				'lng': 16.37123
			}
		},
		{
			'distance': 15.362780866842524,
			'bearing': 160.2626431470718,
			'latitude': 48.21635,
			'longitude': 16.3713,
			'latlng': {
				'lat': 48.21635,
				'lng': 16.3713
			}
		},
		{
			'distance': 5.609170666947095,
			'bearing': 172.40925562582834,
			'latitude': 48.2163,
			'longitude': 16.37131,
			'latlng': {
				'lat': 48.2163,
				'lng': 16.37131
			}
		},
		{
			'distance': 57.87571980007707,
			'bearing': 143.87851704234163,
			'latitude': 48.21588,
			'longitude': 16.37177,
			'latlng': {
				'lat': 48.21588,
				'lng': 16.37177
			}
		},
		{
			'distance': 16.943189280262455,
			'bearing': 105.26247039457218,
			'latitude': 48.21584,
			'longitude': 16.37199,
			'latlng': {
				'lat': 48.21584,
				'lng': 16.37199
			}
		},
		{
			'distance': 15.51395110177759,
			'bearing': 73.29262134756777,
			'latitude': 48.21588,
			'longitude': 16.37219,
			'latlng': {
				'lat': 48.21588,
				'lng': 16.37219
			}
		},
		{
			'distance': 94.18085998637032,
			'bearing': 144.6331022952059,
			'latitude': 48.21519,
			'longitude': 16.372925,
			'latlng': {
				'lat': 48.21519,
				'lng': 16.372925
			}
		},
		{
			'distance': 94.18127807604318,
			'bearing': 144.63273785230177,
			'latitude': 48.2145,
			'longitude': 16.37366,
			'latlng': {
				'lat': 48.2145,
				'lng': 16.37366
			}
		},
		{
			'distance': 8.895559422072566,
			'bearing': 180,
			'latitude': 48.21442,
			'longitude': 16.37366,
			'latlng': {
				'lat': 48.21442,
				'lng': 16.37366
			}
		},
		{
			'distance': 46.79441437733155,
			'bearing': 151.61835393867017,
			'latitude': 48.21405,
			'longitude': 16.37396,
			'latlng': {
				'lat': 48.21405,
				'lng': 16.37396
			}
		},
		{
			'distance': 10.69941584769819,
			'bearing': 146.32245889181206,
			'latitude': 48.21397,
			'longitude': 16.37404,
			'latlng': {
				'lat': 48.21397,
				'lng': 16.37404
			}
		},
		{
			'distance': 8.460108212753983,
			'bearing': 142.13813678742645,
			'latitude': 48.21391,
			'longitude': 16.37411,
			'latlng': {
				'lat': 48.21391,
				'lng': 16.37411
			}
		},
		{
			'distance': 4.458980050620062,
			'bearing': 89.99997762951273,
			'latitude': 48.21391,
			'longitude': 16.37417,
			'latlng': {
				'lat': 48.21391,
				'lng': 16.37417
			}
		},
		{
			'distance': 21.102887623926147,
			'bearing': 61.61950960438355,
			'latitude': 48.214,
			'longitude': 16.37442,
			'latlng': {
				'lat': 48.214,
				'lng': 16.37442
			}
		},
		{
			'distance': 39.802214523433385,
			'bearing': 153.4456647996601,
			'latitude': 48.21368,
			'longitude': 16.37466,
			'latlng': {
				'lat': 48.21368,
				'lng': 16.37466
			}
		},
		{
			'distance': 76.57169825690119,
			'bearing': 143.0870931485655,
			'latitude': 48.21313,
			'longitude': 16.37528,
			'latlng': {
				'lat': 48.21313,
				'lng': 16.37528
			}
		},
		{
			'distance': 39.3905572391638,
			'bearing': 137.30347269601577,
			'latitude': 48.21287,
			'longitude': 16.37564,
			'latlng': {
				'lat': 48.21287,
				'lng': 16.37564
			}
		},
		{
			'distance': 85.1223092432802,
			'bearing': 129.8818491645967,
			'latitude': 48.21238,
			'longitude': 16.37652,
			'latlng': {
				'lat': 48.21238,
				'lng': 16.37652
			}
		},
		{
			'distance': 38.97514112728804,
			'bearing': 120.97474422403639,
			'latitude': 48.2122,
			'longitude': 16.37697,
			'latlng': {
				'lat': 48.2122,
				'lng': 16.37697
			}
		},
		{
			'distance': 44.36125399742063,
			'bearing': 115.28720895901085,
			'latitude': 48.21203,
			'longitude': 16.37751,
			'latlng': {
				'lat': 48.21203,
				'lng': 16.37751
			}
		},
		{
			'distance': 82.4722316309824,
			'bearing': 108.93188050790297,
			'latitude': 48.21179,
			'longitude': 16.37856,
			'latlng': {
				'lat': 48.21179,
				'lng': 16.37856
			}
		},
		{
			'distance': 28.28880707623883,
			'bearing': 113.20739275830834,
			'latitude': 48.21169,
			'longitude': 16.37891,
			'latlng': {
				'lat': 48.21169,
				'lng': 16.37891
			}
		},
		{
			'distance': 13.561111652277207,
			'bearing': 99.46624519128136,
			'latitude': 48.21167,
			'longitude': 16.37909,
			'latlng': {
				'lat': 48.21167,
				'lng': 16.37909
			}
		},
		{
			'distance': 60.56746363965626,
			'bearing': 96.3425854838527,
			'latitude': 48.21161,
			'longitude': 16.3799,
			'latlng': {
				'lat': 48.21161,
				'lng': 16.3799
			}
		},
		{
			'distance': 6.817451238281226,
			'bearing': 119.36819605297183,
			'latitude': 48.21158,
			'longitude': 16.37998,
			'latlng': {
				'lat': 48.21158,
				'lng': 16.37998
			}
		},
		{
			'distance': 739.7725094837165,
			'bearing': 191.4417493182042,
			'latitude': 48.20506,
			'longitude': 16.378,
			'latlng': {
				'lat': 48.20506,
				'lng': 16.378
			}
		},
		{
			'distance': 4.689626796416322,
			'bearing': 161.570194683679,
			'latitude': 48.20502,
			'longitude': 16.37802,
			'latlng': {
				'lat': 48.20502,
				'lng': 16.37802
			}
		},
		{
			'distance': 5.569304732281355,
			'bearing': 233.12190064659367,
			'latitude': 48.20499,
			'longitude': 16.37796,
			'latlng': {
				'lat': 48.20499,
				'lng': 16.37796
			}
		},
		{
			'distance': 51.241784047044,
			'bearing': 214.37261287665396,
			'latitude': 48.20461,
			'longitude': 16.37757,
			'latlng': {
				'lat': 48.20461,
				'lng': 16.37757
			}
		},
		{
			'distance': 18.53631550187585,
			'bearing': 196.25576888292082,
			'latitude': 48.20445,
			'longitude': 16.3775,
			'latlng': {
				'lat': 48.20445,
				'lng': 16.3775
			}
		},
		{
			'distance': 83.73365880613117,
			'bearing': 214.2319300882287,
			'latitude': 48.203828,
			'longitude': 16.376865,
			'latlng': {
				'lat': 48.203828,
				'lng': 16.376865
			}
		},
		{
			'distance': 83.8258429973669,
			'bearing': 214.189458687985,
			'latitude': 48.203205,
			'longitude': 16.37623,
			'latlng': {
				'lat': 48.203205,
				'lng': 16.37623
			}
		},
		{
			'distance': 83.73429114147001,
			'bearing': 214.23257778606757,
			'latitude': 48.202583,
			'longitude': 16.375595,
			'latlng': {
				'lat': 48.202583,
				'lng': 16.375595
			}
		},
		{
			'distance': 83.82647459828527,
			'bearing': 214.19010599295834,
			'latitude': 48.20196,
			'longitude': 16.37496,
			'latlng': {
				'lat': 48.20196,
				'lng': 16.37496
			}
		},
		{
			'distance': 37.57038672643383,
			'bearing': 245.45728639932045,
			'latitude': 48.20182,
			'longitude': 16.3745,
			'latlng': {
				'lat': 48.20182,
				'lng': 16.3745
			}
		},
		{
			'distance': 25.806272978323932,
			'bearing': 247.12161178566797,
			'latitude': 48.20173,
			'longitude': 16.37418,
			'latlng': {
				'lat': 48.20173,
				'lng': 16.37418
			}
		},
		{
			'distance': 12.783591367331825,
			'bearing': 163.14530352485076,
			'latitude': 48.20162,
			'longitude': 16.37423,
			'latlng': {
				'lat': 48.20162,
				'lng': 16.37423
			}
		},
		{
			'distance': 10.700199350303839,
			'bearing': 213.68395838440378,
			'latitude': 48.20154,
			'longitude': 16.37415,
			'latlng': {
				'lat': 48.20154,
				'lng': 16.37415
			}
		},
		{
			'distance': 5.609184794017929,
			'bearing': 187.59291423515202,
			'latitude': 48.20149,
			'longitude': 16.37414,
			'latlng': {
				'lat': 48.20149,
				'lng': 16.37414
			}
		},
		{
			'distance': 6.712937475127153,
			'bearing': 173.66124957436875,
			'latitude': 48.20143,
			'longitude': 16.37415,
			'latlng': {
				'lat': 48.20143,
				'lng': 16.37415
			}
		},
		{
			'distance': 91.91257321565558,
			'bearing': 159.70491724591875,
			'latitude': 48.200655,
			'longitude': 16.37458,
			'latlng': {
				'lat': 48.200655,
				'lng': 16.37458
			}
		},
		{
			'distance': 91.91272993862694,
			'bearing': 159.7046352556447,
			'latitude': 48.19988,
			'longitude': 16.37501,
			'latlng': {
				'lat': 48.19988,
				'lng': 16.37501
			}
		},
		{
			'distance': 40.893192374704185,
			'bearing': 70.90276915544456,
			'latitude': 48.2,
			'longitude': 16.37553,
			'latlng': {
				'lat': 48.2,
				'lng': 16.37553
			}
		},
		{
			'distance': 50.778486761358906,
			'bearing': 160.37780428426788,
			'latitude': 48.19957,
			'longitude': 16.37576,
			'latlng': {
				'lat': 48.19957,
				'lng': 16.37576
			}
		},
		{
			'distance': 14.313153374868419,
			'bearing': 148.78643197960236,
			'latitude': 48.19946,
			'longitude': 16.37586,
			'latlng': {
				'lat': 48.19946,
				'lng': 16.37586
			}
		},
		{
			'distance': 8.141067099401466,
			'bearing': 133.15779990644603,
			'latitude': 48.19941,
			'longitude': 16.37594,
			'latlng': {
				'lat': 48.19941,
				'lng': 16.37594
			}
		},
		{
			'distance': 9.91643633982977,
			'bearing': 102.99694872689383,
			'latitude': 48.19939,
			'longitude': 16.37607,
			'latlng': {
				'lat': 48.19939,
				'lng': 16.37607
			}
		},
		{
			'distance': 10.466460219108866,
			'bearing': 83.88329401237127,
			'latitude': 48.1994,
			'longitude': 16.37621,
			'latlng': {
				'lat': 48.1994,
				'lng': 16.37621
			}
		},
		{
			'distance': 14.255406253249731,
			'bearing': 141.34541886437262,
			'latitude': 48.1993,
			'longitude': 16.37633,
			'latlng': {
				'lat': 48.1993,
				'lng': 16.37633
			}
		},
		{
			'distance': 9.523814592671277,
			'bearing': 110.55952999923875,
			'latitude': 48.19927,
			'longitude': 16.37645,
			'latlng': {
				'lat': 48.19927,
				'lng': 16.37645
			}
		},
		{
			'distance': 55.44527494345681,
			'bearing': 137.9893228062731,
			'latitude': 48.1989,
			'longitude': 16.37695,
			'latlng': {
				'lat': 48.1989,
				'lng': 16.37695
			}
		},
		{
			'distance': 15.84863248797847,
			'bearing': 169.21756667283125,
			'latitude': 48.19876,
			'longitude': 16.37699,
			'latlng': {
				'lat': 48.19876,
				'lng': 16.37699
			}
		},
		{
			'distance': 26.821291085713234,
			'bearing': 228.3615668390545,
			'latitude': 48.1986,
			'longitude': 16.37672,
			'latlng': {
				'lat': 48.1986,
				'lng': 16.37672
			}
		},
		{
			'distance': 38.77044618118796,
			'bearing': 320.8314205085179,
			'latitude': 48.19887,
			'longitude': 16.37639,
			'latlng': {
				'lat': 48.19887,
				'lng': 16.37639
			}
		},
		{
			'distance': 16.28222059716397,
			'bearing': 313.157601967085,
			'latitude': 48.19897,
			'longitude': 16.37623,
			'latlng': {
				'lat': 48.19897,
				'lng': 16.37623
			}
		},
		{
			'distance': 15.480010511660124,
			'bearing': 300.2610403132554,
			'latitude': 48.19904,
			'longitude': 16.37605,
			'latlng': {
				'lat': 48.19904,
				'lng': 16.37605
			}
		},
		{
			'distance': 9.88819691717916,
			'bearing': 235.70830795384362,
			'latitude': 48.19899,
			'longitude': 16.37594,
			'latlng': {
				'lat': 48.19899,
				'lng': 16.37594
			}
		},
		{
			'distance': 12.831632049084352,
			'bearing': 259.99030462110164,
			'latitude': 48.19897,
			'longitude': 16.37577,
			'latlng': {
				'lat': 48.19897,
				'lng': 16.37577
			}
		},
		{
			'distance': 35.30908330238814,
			'bearing': 211.681887857275,
			'latitude': 48.1987,
			'longitude': 16.37552,
			'latlng': {
				'lat': 48.1987,
				'lng': 16.37552
			}
		},
		{
			'distance': 29.194805505905794,
			'bearing': 197.74183099552909,
			'latitude': 48.19845,
			'longitude': 16.3754,
			'latlng': {
				'lat': 48.19845,
				'lng': 16.3754
			}
		},
		{
			'distance': 6.687746916260479,
			'bearing': 326.3144873862949,
			'latitude': 48.1985,
			'longitude': 16.37535,
			'latlng': {
				'lat': 48.1985,
				'lng': 16.37535
			}
		},
		{
			'distance': 2.67509637323467,
			'bearing': 33.6855057205446,
			'latitude': 48.19852,
			'longitude': 16.37537,
			'latlng': {
				'lat': 48.19852,
				'lng': 16.37537
			}
		},
		{
			'distance': 30.470062070238296,
			'bearing': 9.804383475381826,
			'latitude': 48.19879,
			'longitude': 16.37544,
			'latlng': {
				'lat': 48.19879,
				'lng': 16.37544
			}
		},
		{
			'distance': 19.902230517967183,
			'bearing': 26.560898395900438,
			'latitude': 48.19895,
			'longitude': 16.37556,
			'latlng': {
				'lat': 48.19895,
				'lng': 16.37556
			}
		},
		{
			'distance': 20.395427642910068,
			'bearing': 56.883806163381564,
			'latitude': 48.19905,
			'longitude': 16.37579,
			'latlng': {
				'lat': 48.19905,
				'lng': 16.37579
			}
		},
		{
			'distance': 14.124188663046642,
			'bearing': 89.9999291797148,
			'latitude': 48.19905,
			'longitude': 16.37598,
			'latlng': {
				'lat': 48.19905,
				'lng': 16.37598
			}
		},
		{
			'distance': 7.42628697252768,
			'bearing': 53.12503511329618,
			'latitude': 48.19909,
			'longitude': 16.37606,
			'latlng': {
				'lat': 48.19909,
				'lng': 16.37606
			}
		},
		{
			'distance': 3.879649515369751,
			'bearing': 106.70211878529926,
			'latitude': 48.19908,
			'longitude': 16.37611,
			'latlng': {
				'lat': 48.19908,
				'lng': 16.37611
			}
		},
		{
			'distance': 22.87851063890594,
			'bearing': 125.75874395049942,
			'latitude': 48.19896,
			'longitude': 16.37636,
			'latlng': {
				'lat': 48.19896,
				'lng': 16.37636
			}
		},
		{
			'distance': 94.92926222879139,
			'bearing': 140.71519324278466,
			'latitude': 48.1983,
			'longitude': 16.37717,
			'latlng': {
				'lat': 48.1983,
				'lng': 16.37717
			}
		},
		{
			'distance': 23.88585494758792,
			'bearing': 134.37508918373612,
			'latitude': 48.19815,
			'longitude': 16.3774,
			'latlng': {
				'lat': 48.19815,
				'lng': 16.3774
			}
		},
		{
			'distance': 15.544236406744874,
			'bearing': 130.1605804798051,
			'latitude': 48.19806,
			'longitude': 16.37756,
			'latlng': {
				'lat': 48.19806,
				'lng': 16.37756
			}
		},
		{
			'distance': 76.3073298294264,
			'bearing': 118.81433495912745,
			'latitude': 48.19773,
			'longitude': 16.37846,
			'latlng': {
				'lat': 48.19773,
				'lng': 16.37846
			}
		},
		{
			'distance': 17.273918586211956,
			'bearing': 108.82736707619188,
			'latitude': 48.19768,
			'longitude': 16.37868,
			'latlng': {
				'lat': 48.19768,
				'lng': 16.37868
			}
		},
		{
			'distance': 56.44541823901594,
			'bearing': 118.92990473203344,
			'latitude': 48.197435,
			'longitude': 16.379345,
			'latlng': {
				'lat': 48.197435,
				'lng': 16.379345
			}
		},
		{
			'distance': 56.44562410927991,
			'bearing': 118.929788731509,
			'latitude': 48.19719,
			'longitude': 16.38001,
			'latlng': {
				'lat': 48.19719,
				'lng': 16.38001
			}
		},
		{
			'distance': 50.131732188898496,
			'bearing': 120.74876384083194,
			'latitude': 48.19696,
			'longitude': 16.38059,
			'latlng': {
				'lat': 48.19696,
				'lng': 16.38059
			}
		},
		{
			'distance': 51.297224955719315,
			'bearing': 124.38385565361841,
			'latitude': 48.1967,
			'longitude': 16.38116,
			'latlng': {
				'lat': 48.1967,
				'lng': 16.38116
			}
		},
		{
			'distance': 84.71813750517455,
			'bearing': 125.81829030461995,
			'latitude': 48.196255,
			'longitude': 16.382085,
			'latlng': {
				'lat': 48.196255,
				'lng': 16.382085
			}
		},
		{
			'distance': 84.71861861223374,
			'bearing': 125.81805415632255,
			'latitude': 48.19581,
			'longitude': 16.38301,
			'latlng': {
				'lat': 48.19581,
				'lng': 16.38301
			}
		},
		{
			'distance': 68.03396090952225,
			'bearing': 121.6101886213196,
			'latitude': 48.19549,
			'longitude': 16.38379,
			'latlng': {
				'lat': 48.19549,
				'lng': 16.38379
			}
		},
		{
			'distance': 8.025435992851188,
			'bearing': 33.687034024368245,
			'latitude': 48.19555,
			'longitude': 16.38385,
			'latlng': {
				'lat': 48.19555,
				'lng': 16.38385
			}
		},
		{
			'distance': 21.76617359414986,
			'bearing': 117.44229251657839,
			'latitude': 48.19546,
			'longitude': 16.38411,
			'latlng': {
				'lat': 48.19546,
				'lng': 16.38411
			}
		},
		{
			'distance': 16.986500608061693,
			'bearing': 211.60469731105084,
			'latitude': 48.19533,
			'longitude': 16.38399,
			'latlng': {
				'lat': 48.19533,
				'lng': 16.38399
			}
		},
		{
			'distance': 11.289818315852468,
			'bearing': 133.67087210361876,
			'latitude': 48.19526,
			'longitude': 16.3841,
			'latlng': {
				'lat': 48.19526,
				'lng': 16.3841
			}
		},
		{
			'distance': 4.68970946478068,
			'bearing': 198.43309300836586,
			'latitude': 48.19522,
			'longitude': 16.38408,
			'latlng': {
				'lat': 48.19522,
				'lng': 16.38408
			}
		},
		{
			'distance': 50.82642167877277,
			'bearing': 190.07961959795003,
			'latitude': 48.19477,
			'longitude': 16.38396,
			'latlng': {
				'lat': 48.19477,
				'lng': 16.38396
			}
		},
		{
			'distance': 1.111941101307717,
			'bearing': 0,
			'latitude': 48.19478,
			'longitude': 16.38396,
			'latlng': {
				'lat': 48.19478,
				'lng': 16.38396
			}
		},
		{
			'distance': 64.35421577607073,
			'bearing': 189.94976728441026,
			'latitude': 48.19421,
			'longitude': 16.38381,
			'latlng': {
				'lat': 48.19421,
				'lng': 16.38381
			}
		},
		{
			'distance': 4.975645418499872,
			'bearing': 153.43695239812678,
			'latitude': 48.19417,
			'longitude': 16.38384,
			'latlng': {
				'lat': 48.19417,
				'lng': 16.38384
			}
		},
		{
			'distance': 8.474925014012982,
			'bearing': 105.256347866142,
			'latitude': 48.19415,
			'longitude': 16.38395,
			'latlng': {
				'lat': 48.19415,
				'lng': 16.38395
			}
		},
		{
			'distance': 8.474925013992848,
			'bearing': 285.2564298628208,
			'latitude': 48.19417,
			'longitude': 16.38384,
			'latlng': {
				'lat': 48.19417,
				'lng': 16.38384
			}
		},
		{
			'distance': 4.975645418406062,
			'bearing': 333.4369747603039,
			'latitude': 48.19421,
			'longitude': 16.38381,
			'latlng': {
				'lat': 48.19421,
				'lng': 16.38381
			}
		},
		{
			'distance': 57.04290794790129,
			'bearing': 10.104063402911834,
			'latitude': 48.194715,
			'longitude': 16.383945,
			'latlng': {
				'lat': 48.194715,
				'lng': 16.383945
			}
		},
		{
			'distance': 57.04289547400215,
			'bearing': 10.103965869253898,
			'latitude': 48.19522,
			'longitude': 16.38408,
			'latlng': {
				'lat': 48.19522,
				'lng': 16.38408
			}
		},
		{
			'distance': 14.069130532548545,
			'bearing': 18.43304977140832,
			'latitude': 48.19534,
			'longitude': 16.38414,
			'latlng': {
				'lat': 48.19534,
				'lng': 16.38414
			}
		},
		{
			'distance': 22.963117303093497,
			'bearing': 129.09682844266376,
			'latitude': 48.19521,
			'longitude': 16.38438,
			'latlng': {
				'lat': 48.19521,
				'lng': 16.38438
			}
		},
		{
			'distance': 8.461255730556847,
			'bearing': 37.87194757784414,
			'latitude': 48.19527,
			'longitude': 16.38445,
			'latlng': {
				'lat': 48.19527,
				'lng': 16.38445
			}
		},
		{
			'distance': 9.888684438248612,
			'bearing': 304.28983761782274,
			'latitude': 48.19532,
			'longitude': 16.38434,
			'latlng': {
				'lat': 48.19532,
				'lng': 16.38434
			}
		},
		{
			'distance': 15.034034987421865,
			'bearing': 278.53176613719575,
			'latitude': 48.19534,
			'longitude': 16.38414,
			'latlng': {
				'lat': 48.19534,
				'lng': 16.38414
			}
		},
		{
			'distance': 44.528666398621546,
			'bearing': 301.7044992567449,
			'latitude': 48.19555,
			'longitude': 16.38363,
			'latlng': {
				'lat': 48.19555,
				'lng': 16.38363
			}
		},
		{
			'distance': 21.179139783568758,
			'bearing': 4.013702905872606,
			'latitude': 48.19574,
			'longitude': 16.38365,
			'latlng': {
				'lat': 48.19574,
				'lng': 16.38365
			}
		},
		{
			'distance': 12.253926040767453,
			'bearing': 183.46782790445104,
			'latitude': 48.19563,
			'longitude': 16.38364,
			'latlng': {
				'lat': 48.19563,
				'lng': 16.38364
			}
		},
		{
			'distance': 55.003809620882,
			'bearing': 303.85438583749766,
			'latitude': 48.195905,
			'longitude': 16.383025,
			'latlng': {
				'lat': 48.195905,
				'lng': 16.383025
			}
		},
		{
			'distance': 55.00360706613849,
			'bearing': 303.85452811038823,
			'latitude': 48.19618,
			'longitude': 16.38241,
			'latlng': {
				'lat': 48.19618,
				'lng': 16.38241
			}
		},
		{
			'distance': 61.21210446657273,
			'bearing': 2.4289397304095246,
			'latitude': 48.19673,
			'longitude': 16.382445,
			'latlng': {
				'lat': 48.19673,
				'lng': 16.382445
			}
		},
		{
			'distance': 61.21210915821989,
			'bearing': 2.4289136868576406,
			'latitude': 48.19728,
			'longitude': 16.38248,
			'latlng': {
				'lat': 48.19728,
				'lng': 16.38248
			}
		},
		{
			'distance': 8.474444706658822,
			'bearing': 74.74268153036877,
			'latitude': 48.1973,
			'longitude': 16.38259,
			'latlng': {
				'lat': 48.1973,
				'lng': 16.38259
			}
		},
		{
			'distance': 79.63936802823362,
			'bearing': 92.80900587011683,
			'latitude': 48.197265,
			'longitude': 16.38366,
			'latlng': {
				'lat': 48.197265,
				'lng': 16.38366
			}
		},
		{
			'distance': 79.63942214100263,
			'bearing': 92.80900395445803,
			'latitude': 48.19723,
			'longitude': 16.38473,
			'latlng': {
				'lat': 48.19723,
				'lng': 16.38473
			}
		},
		{
			'distance': 66.98950902996384,
			'bearing': 272.86316231972404,
			'latitude': 48.19726,
			'longitude': 16.38383,
			'latlng': {
				'lat': 48.19726,
				'lng': 16.38383
			}
		},
		{
			'distance': 5.203829727254622,
			'bearing': 270.0000260891171,
			'latitude': 48.19726,
			'longitude': 16.38376,
			'latlng': {
				'lat': 48.19726,
				'lng': 16.38376
			}
		},
		{
			'distance': 70.49609586821443,
			'bearing': 3.1943585225896527,
			'latitude': 48.197893,
			'longitude': 16.383813,
			'latlng': {
				'lat': 48.197893,
				'lng': 16.383813
			}
		},
		{
			'distance': 70.6113088137794,
			'bearing': 3.249338675350259,
			'latitude': 48.198527,
			'longitude': 16.383867,
			'latlng': {
				'lat': 48.198527,
				'lng': 16.383867
			}
		},
		{
			'distance': 70.49610600441977,
			'bearing': 3.194279687098742,
			'latitude': 48.19916,
			'longitude': 16.38392,
			'latlng': {
				'lat': 48.19916,
				'lng': 16.38392
			}
		},
		{
			'distance': 78.676887779039,
			'bearing': 355.1364475513765,
			'latitude': 48.199865,
			'longitude': 16.38383,
			'latlng': {
				'lat': 48.199865,
				'lng': 16.38383
			}
		},
		{
			'distance': 78.67688959924952,
			'bearing': 355.13651416203976,
			'latitude': 48.20057,
			'longitude': 16.38374,
			'latlng': {
				'lat': 48.20057,
				'lng': 16.38374
			}
		},
		{
			'distance': 84.17940888154905,
			'bearing': 344.68180744407056,
			'latitude': 48.2013,
			'longitude': 16.38344,
			'latlng': {
				'lat': 48.2013,
				'lng': 16.38344
			}
		},
		{
			'distance': 60.96554362168435,
			'bearing': 341.56913151368576,
			'latitude': 48.20182,
			'longitude': 16.38318,
			'latlng': {
				'lat': 48.20182,
				'lng': 16.38318
			}
		},
		{
			'distance': 12.92317112663058,
			'bearing': 320.83305273699983,
			'latitude': 48.20191,
			'longitude': 16.38307,
			'latlng': {
				'lat': 48.20191,
				'lng': 16.38307
			}
		},
		{
			'distance': 23.184947353736273,
			'bearing': 320.2012706549807,
			'latitude': 48.20207,
			'longitude': 16.38287,
			'latlng': {
				'lat': 48.20207,
				'lng': 16.38287
			}
		},
		{
			'distance': 47.777825799783024,
			'bearing': 230.9860135869159,
			'latitude': 48.2018,
			'longitude': 16.38237,
			'latlng': {
				'lat': 48.2018,
				'lng': 16.38237
			}
		},
		{
			'distance': 31.51826580922283,
			'bearing': 235.55486385062375,
			'latitude': 48.20164,
			'longitude': 16.38202,
			'latlng': {
				'lat': 48.20164,
				'lng': 16.38202
			}
		},
		{
			'distance': 72.31734203732303,
			'bearing': 249.2331861026056,
			'latitude': 48.20141,
			'longitude': 16.38111,
			'latlng': {
				'lat': 48.20141,
				'lng': 16.38111
			}
		},
		{
			'distance': 24.70493264826555,
			'bearing': 254.2880725585182,
			'latitude': 48.20135,
			'longitude': 16.38079,
			'latlng': {
				'lat': 48.20135,
				'lng': 16.38079
			}
		},
		{
			'distance': 54.06860740226224,
			'bearing': 314.45055765167757,
			'latitude': 48.20169,
			'longitude': 16.38027,
			'latlng': {
				'lat': 48.20169,
				'lng': 16.38027
			}
		},
		{
			'distance': 14.28982386060755,
			'bearing': 297.90289993781266,
			'latitude': 48.20175,
			'longitude': 16.3801,
			'latlng': {
				'lat': 48.20175,
				'lng': 16.3801
			}
		},
		{
			'distance': 13.941415406617939,
			'bearing': 28.604728897479617,
			'latitude': 48.20186,
			'longitude': 16.38019,
			'latlng': {
				'lat': 48.20186,
				'lng': 16.38019
			}
		},
		{
			'distance': 10.510835306446673,
			'bearing': 302.0115598584371,
			'latitude': 48.20191,
			'longitude': 16.38007,
			'latlng': {
				'lat': 48.20191,
				'lng': 16.38007
			}
		},
		{
			'distance': 17.978160571781636,
			'bearing': 277.12678993700865,
			'latitude': 48.20193,
			'longitude': 16.37983,
			'latlng': {
				'lat': 48.20193,
				'lng': 16.37983
			}
		},
		{
			'distance': 57.479203853060426,
			'bearing': 302.87523474374217,
			'latitude': 48.20221,
			'longitude': 16.37918,
			'latlng': {
				'lat': 48.20221,
				'lng': 16.37918
			}
		},
		{
			'distance': 57.478983334277856,
			'bearing': 302.87537751965243,
			'latitude': 48.20249,
			'longitude': 16.37853,
			'latlng': {
				'lat': 48.20249,
				'lng': 16.37853
			}
		},
		{
			'distance': 5.350071626515093,
			'bearing': 213.68348406595413,
			'latitude': 48.20245,
			'longitude': 16.37849,
			'latlng': {
				'lat': 48.20245,
				'lng': 16.37849
			}
		},
		{
			'distance': 77.55505939995102,
			'bearing': 304.07756019926705,
			'latitude': 48.20284,
			'longitude': 16.377625,
			'latlng': {
				'lat': 48.20284,
				'lng': 16.377625
			}
		},
		{
			'distance': 77.55465640270452,
			'bearing': 304.07776265566247,
			'latitude': 48.20323,
			'longitude': 16.37676,
			'latlng': {
				'lat': 48.20323,
				'lng': 16.37676
			}
		},
		{
			'distance': 6.818291803525467,
			'bearing': 299.3642633962425,
			'latitude': 48.20326,
			'longitude': 16.37668,
			'latlng': {
				'lat': 48.20326,
				'lng': 16.37668
			}
		},
		{
			'distance': 7.127495042606302,
			'bearing': 218.65243920269128,
			'latitude': 48.20321,
			'longitude': 16.37662,
			'latlng': {
				'lat': 48.20321,
				'lng': 16.37662
			}
		},
		{
			'distance': 23.48505760525165,
			'bearing': 304.7023606359825,
			'latitude': 48.20333,
			'longitude': 16.37636,
			'latlng': {
				'lat': 48.20333,
				'lng': 16.37636
			}
		},
		{
			'distance': 93.33399190501208,
			'bearing': 214.63085235845116,
			'latitude': 48.20264,
			'longitude': 16.375645,
			'latlng': {
				'lat': 48.20264,
				'lng': 16.375645
			}
		},
		{
			'distance': 93.33439075235148,
			'bearing': 214.63121324862885,
			'latitude': 48.20195,
			'longitude': 16.37493,
			'latlng': {
				'lat': 48.20195,
				'lng': 16.37493
			}
		},
		{
			'distance': 80.59075787395892,
			'bearing': 247.21312578818126,
			'latitude': 48.20167,
			'longitude': 16.37393,
			'latlng': {
				'lat': 48.20167,
				'lng': 16.37393
			}
		},
		{
			'distance': 4.012572983278666,
			'bearing': 213.6839010362239,
			'latitude': 48.20164,
			'longitude': 16.3739,
			'latlng': {
				'lat': 48.20164,
				'lng': 16.3739
			}
		},
		{
			'distance': 4.975505294242279,
			'bearing': 333.44031609484296,
			'latitude': 48.20168,
			'longitude': 16.37387,
			'latlng': {
				'lat': 48.20168,
				'lng': 16.37387
			}
		},
		{
			'distance': 17.97810265123384,
			'bearing': 251.93566808436174,
			'latitude': 48.20163,
			'longitude': 16.37364,
			'latlng': {
				'lat': 48.20163,
				'lng': 16.37364
			}
		},
		{
			'distance': 9.727195961325737,
			'bearing': 276.5835149279891,
			'latitude': 48.20164,
			'longitude': 16.37351,
			'latlng': {
				'lat': 48.20164,
				'lng': 16.37351
			}
		},
		{
			'distance': 75.61116486890431,
			'bearing': 288.4838828503683,
			'latitude': 48.201855,
			'longitude': 16.372545,
			'latlng': {
				'lat': 48.201855,
				'lng': 16.372545
			}
		},
		{
			'distance': 75.61088037887701,
			'bearing': 288.48395515782886,
			'latitude': 48.20207,
			'longitude': 16.37158,
			'latlng': {
				'lat': 48.20207,
				'lng': 16.37158
			}
		},
		{
			'distance': 66.8199648800769,
			'bearing': 290.0015188203223,
			'latitude': 48.202275,
			'longitude': 16.370735,
			'latlng': {
				'lat': 48.202275,
				'lng': 16.370735
			}
		},
		{
			'distance': 66.81972957074123,
			'bearing': 290.00159252027737,
			'latitude': 48.20248,
			'longitude': 16.36989,
			'latlng': {
				'lat': 48.20248,
				'lng': 16.36989
			}
		},
		{
			'distance': 4.994116037928962,
			'bearing': 228.0056997472249,
			'latitude': 48.20245,
			'longitude': 16.36984,
			'latlng': {
				'lat': 48.20245,
				'lng': 16.36984
			}
		},
		{
			'distance': 34.83791815022687,
			'bearing': 281.073070603243,
			'latitude': 48.20251,
			'longitude': 16.36938,
			'latlng': {
				'lat': 48.20251,
				'lng': 16.36938
			}
		},
		{
			'distance': 22.56532787310131,
			'bearing': 287.2456373268592,
			'latitude': 48.20257,
			'longitude': 16.36909,
			'latlng': {
				'lat': 48.20257,
				'lng': 16.36909
			}
		},
		{
			'distance': 3.652106103441813,
			'bearing': 336.0428719306253,
			'latitude': 48.2026,
			'longitude': 16.36907,
			'latlng': {
				'lat': 48.2026,
				'lng': 16.36907
			}
		},
		{
			'distance': 40.542050610187296,
			'bearing': 287.6090088711642,
			'latitude': 48.20271,
			'longitude': 16.36855,
			'latlng': {
				'lat': 48.20271,
				'lng': 16.36855
			}
		},
		{
			'distance': 12.59742953872622,
			'bearing': 315.0073499059958,
			'latitude': 48.20279,
			'longitude': 16.36843,
			'latlng': {
				'lat': 48.20279,
				'lng': 16.36843
			}
		},
		{
			'distance': 9.192936885522723,
			'bearing': 284.03973948189537,
			'latitude': 48.20281,
			'longitude': 16.36831,
			'latlng': {
				'lat': 48.20281,
				'lng': 16.36831
			}
		},
		{
			'distance': 19.744420776508576,
			'bearing': 289.8036583605197,
			'latitude': 48.20287,
			'longitude': 16.36806,
			'latlng': {
				'lat': 48.20287,
				'lng': 16.36806
			}
		},
		{
			'distance': 11.205153455095155,
			'bearing': 275.71210964756506,
			'latitude': 48.20288,
			'longitude': 16.36791,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36791
			}
		},
		{
			'distance': 17.839750544367828,
			'bearing': 270.00008946153986,
			'latitude': 48.20288,
			'longitude': 16.36767,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36767
			}
		},
		{
			'distance': 69.08932249318279,
			'bearing': 288.8295792901419,
			'latitude': 48.20308,
			'longitude': 16.36679,
			'latlng': {
				'lat': 48.20308,
				'lng': 16.36679
			}
		},
		{
			'distance': 69.08908165604525,
			'bearing': 288.8296476298043,
			'latitude': 48.20328,
			'longitude': 16.36591,
			'latlng': {
				'lat': 48.20328,
				'lng': 16.36591
			}
		},
		{
			'distance': 7.819011170315559,
			'bearing': 354.5611101097695,
			'latitude': 48.20335,
			'longitude': 16.3659,
			'latlng': {
				'lat': 48.20335,
				'lng': 16.3659
			}
		},
		{
			'distance': 56.75113234981675,
			'bearing': 288.32118072667794,
			'latitude': 48.20351,
			'longitude': 16.365175,
			'latlng': {
				'lat': 48.20351,
				'lng': 16.365175
			}
		},
		{
			'distance': 56.75097313378009,
			'bearing': 288.3212341324377,
			'latitude': 48.20367,
			'longitude': 16.36445,
			'latlng': {
				'lat': 48.20367,
				'lng': 16.36445
			}
		},
		{
			'distance': 4.994050832490196,
			'bearing': 311.99501609412675,
			'latitude': 48.2037,
			'longitude': 16.3644,
			'latlng': {
				'lat': 48.2037,
				'lng': 16.3644
			}
		},
		{
			'distance': 5.559714203657111,
			'bearing': 0,
			'latitude': 48.20375,
			'longitude': 16.3644,
			'latlng': {
				'lat': 48.20375,
				'lng': 16.3644
			}
		},
		{
			'distance': 37.56939401367626,
			'bearing': 317.81047458769996,
			'latitude': 48.204,
			'longitude': 16.36406,
			'latlng': {
				'lat': 48.204,
				'lng': 16.36406
			}
		},
		{
			'distance': 7.433067348844813,
			'bearing': 270.00003727601995,
			'latitude': 48.204,
			'longitude': 16.36396,
			'latlng': {
				'lat': 48.204,
				'lng': 16.36396
			}
		},
		{
			'distance': 19.148150509151993,
			'bearing': 215.53019946222648,
			'latitude': 48.20386,
			'longitude': 16.36381,
			'latlng': {
				'lat': 48.20386,
				'lng': 16.36381
			}
		},
		{
			'distance': 18.683207184224432,
			'bearing': 229.02051704341787,
			'latitude': 48.20375,
			'longitude': 16.36362,
			'latlng': {
				'lat': 48.20375,
				'lng': 16.36362
			}
		},
		{
			'distance': 17.87419902099959,
			'bearing': 138.37417779142828,
			'latitude': 48.20363,
			'longitude': 16.36378,
			'latlng': {
				'lat': 48.20363,
				'lng': 16.36378
			}
		},
		{
			'distance': 17.87419902098334,
			'bearing': 318.374297075026,
			'latitude': 48.20375,
			'longitude': 16.36362,
			'latlng': {
				'lat': 48.20375,
				'lng': 16.36362
			}
		},
		{
			'distance': 5.609182639640826,
			'bearing': 352.40742430709344,
			'latitude': 48.2038,
			'longitude': 16.36361,
			'latlng': {
				'lat': 48.2038,
				'lng': 16.36361
			}
		},
		{
			'distance': 5.796153042962671,
			'bearing': 320.2022213926859,
			'latitude': 48.20384,
			'longitude': 16.36356,
			'latlng': {
				'lat': 48.20384,
				'lng': 16.36356
			}
		},
		{
			'distance': 76.14661603522558,
			'bearing': 316.98323035296124,
			'latitude': 48.20434,
			'longitude': 16.36286,
			'latlng': {
				'lat': 48.20434,
				'lng': 16.36286
			}
		},
		{
			'distance': 8.895543747191535,
			'bearing': 0,
			'latitude': 48.20442,
			'longitude': 16.36286,
			'latlng': {
				'lat': 48.20442,
				'lng': 16.36286
			}
		},
		{
			'distance': 97.47993156949077,
			'bearing': 317.94042873503486,
			'latitude': 48.20507,
			'longitude': 16.36198,
			'latlng': {
				'lat': 48.20507,
				'lng': 16.36198
			}
		},
		{
			'distance': 11.640815906452406,
			'bearing': 329.3569293528595,
			'latitude': 48.20516,
			'longitude': 16.3619,
			'latlng': {
				'lat': 48.20516,
				'lng': 16.3619
			}
		},
		{
			'distance': 9.282153802873324,
			'bearing': 306.8782556566983,
			'latitude': 48.20521,
			'longitude': 16.3618,
			'latlng': {
				'lat': 48.20521,
				'lng': 16.3618
			}
		},
		{
			'distance': 70.58637017665292,
			'bearing': 318.52552974369513,
			'latitude': 48.205685,
			'longitude': 16.36117,
			'latlng': {
				'lat': 48.205685,
				'lng': 16.36117
			}
		},
		{
			'distance': 70.58608621961953,
			'bearing': 318.5257934182491,
			'latitude': 48.20616,
			'longitude': 16.36054,
			'latlng': {
				'lat': 48.20616,
				'lng': 16.36054
			}
		},
		{
			'distance': 11.79797432104686,
			'bearing': 298.18632402828075,
			'latitude': 48.20621,
			'longitude': 16.3604,
			'latlng': {
				'lat': 48.20621,
				'lng': 16.3604
			}
		},
		{
			'distance': 14.731154439316313,
			'bearing': 319.0948392835339,
			'latitude': 48.20631,
			'longitude': 16.36027,
			'latlng': {
				'lat': 48.20631,
				'lng': 16.36027
			}
		},
		{
			'distance': 3.417632876748352,
			'bearing': 347.47513625275917,
			'latitude': 48.20634,
			'longitude': 16.36026,
			'latlng': {
				'lat': 48.20634,
				'lng': 16.36026
			}
		},
		{
			'distance': 20.453927158852323,
			'bearing': 299.36582415938307,
			'latitude': 48.20643,
			'longitude': 16.36002,
			'latlng': {
				'lat': 48.20643,
				'lng': 16.36002
			}
		},
		{
			'distance': 8.698222316943239,
			'bearing': 309.8148286035043,
			'latitude': 48.20648,
			'longitude': 16.35993,
			'latlng': {
				'lat': 48.20648,
				'lng': 16.35993
			}
		},
		{
			'distance': 11.980404833669889,
			'bearing': 158.20502492461947,
			'latitude': 48.20638,
			'longitude': 16.35999,
			'latlng': {
				'lat': 48.20638,
				'lng': 16.35999
			}
		},
		{
			'distance': 14.254647825568288,
			'bearing': 38.650628790868666,
			'latitude': 48.20648,
			'longitude': 16.36011,
			'latlng': {
				'lat': 48.20648,
				'lng': 16.36011
			}
		},
		{
			'distance': 14.437111260947312,
			'bearing': 46.03216408311073,
			'latitude': 48.20657,
			'longitude': 16.36025,
			'latlng': {
				'lat': 48.20657,
				'lng': 16.36025
			}
		},
		{
			'distance': 6.712935200644385,
			'bearing': 6.338112091641392,
			'latitude': 48.20663,
			'longitude': 16.36026,
			'latlng': {
				'lat': 48.20663,
				'lng': 16.36026
			}
		},
		{
			'distance': 3.149238897873122,
			'bearing': 44.990507912903695,
			'latitude': 48.20665,
			'longitude': 16.36029,
			'latlng': {
				'lat': 48.20665,
				'lng': 16.36029
			}
		},
		{
			'distance': 8.69820042068929,
			'bearing': 50.18505035519968,
			'latitude': 48.2067,
			'longitude': 16.36038,
			'latlng': {
				'lat': 48.2067,
				'lng': 16.36038
			}
		},
		{
			'distance': 8.251210298226455,
			'bearing': 82.2322443261969,
			'latitude': 48.20671,
			'longitude': 16.36049,
			'latlng': {
				'lat': 48.20671,
				'lng': 16.36049
			}
		},
		{
			'distance': 49.65034412906033,
			'bearing': 317.73604744173304,
			'latitude': 48.20704,
			'longitude': 16.36004,
			'latlng': {
				'lat': 48.20704,
				'lng': 16.36004
			}
		},
		{
			'distance': 7.432627498828024,
			'bearing': 270.00003727823247,
			'latitude': 48.20704,
			'longitude': 16.35994,
			'latlng': {
				'lat': 48.20704,
				'lng': 16.35994
			}
		},
		{
			'distance': 9.17075357616229,
			'bearing': 345.96834444784383,
			'latitude': 48.20712,
			'longitude': 16.35991,
			'latlng': {
				'lat': 48.20712,
				'lng': 16.35991
			}
		},
		{
			'distance': 94.90644302959542,
			'bearing': 11.257738843815616,
			'latitude': 48.207957,
			'longitude': 16.36016,
			'latlng': {
				'lat': 48.207957,
				'lng': 16.36016
			}
		},
		{
			'distance': 94.79735718349488,
			'bearing': 11.27068124350103,
			'latitude': 48.208793,
			'longitude': 16.36041,
			'latlng': {
				'lat': 48.208793,
				'lng': 16.36041
			}
		},
		{
			'distance': 94.90635123692124,
			'bearing': 11.25738047629244,
			'latitude': 48.20963,
			'longitude': 16.36066,
			'latlng': {
				'lat': 48.20963,
				'lng': 16.36066
			}
		},
		{
			'distance': 13.291858525067425,
			'bearing': 22.980649612038007,
			'latitude': 48.20974,
			'longitude': 16.36073,
			'latlng': {
				'lat': 48.20974,
				'lng': 16.36073
			}
		},
		{
			'distance': 13.67049712166192,
			'bearing': 347.4759704440205,
			'latitude': 48.20986,
			'longitude': 16.36069,
			'latlng': {
				'lat': 48.20986,
				'lng': 16.36069
			}
		},
		{
			'distance': 18.903048850914317,
			'bearing': 0,
			'latitude': 48.21003,
			'longitude': 16.36069,
			'latlng': {
				'lat': 48.21003,
				'lng': 16.36069
			}
		},
		{
			'distance': 74.878512760006,
			'bearing': 11.416624284988643,
			'latitude': 48.21069,
			'longitude': 16.36089,
			'latlng': {
				'lat': 48.21069,
				'lng': 16.36089
			}
		},
		{
			'distance': 20.051594779523928,
			'bearing': 19.432599474020776,
			'latitude': 48.21086,
			'longitude': 16.36098,
			'latlng': {
				'lat': 48.21086,
				'lng': 16.36098
			}
		},
		{
			'distance': 39.48867168901838,
			'bearing': 9.723569126131963,
			'latitude': 48.21121,
			'longitude': 16.36107,
			'latlng': {
				'lat': 48.21121,
				'lng': 16.36107
			}
		},
		{
			'distance': 12.253945620092502,
			'bearing': 356.53323161066,
			'latitude': 48.21132,
			'longitude': 16.36106,
			'latlng': {
				'lat': 48.21132,
				'lng': 16.36106
			}
		},
		{
			'distance': 80.47593855776779,
			'bearing': 11.149914173845389,
			'latitude': 48.21203,
			'longitude': 16.36127,
			'latlng': {
				'lat': 48.21203,
				'lng': 16.36127
			}
		},
		{
			'distance': 80.47590632829412,
			'bearing': 11.14976344866227,
			'latitude': 48.21274,
			'longitude': 16.36148,
			'latlng': {
				'lat': 48.21274,
				'lng': 16.36148
			}
		},
		{
			'distance': 65.8655340930604,
			'bearing': 11.684122616798902,
			'latitude': 48.21332,
			'longitude': 16.36166,
			'latlng': {
				'lat': 48.21332,
				'lng': 16.36166
			}
		},
		{
			'distance': 5.202203156224889,
			'bearing': 89.99997390270119,
			'latitude': 48.21332,
			'longitude': 16.36173,
			'latlng': {
				'lat': 48.21332,
				'lng': 16.36173
			}
		},
		{
			'distance': 20.207339205176865,
			'bearing': 44.242620351758035,
			'latitude': 48.21345,
			'longitude': 16.36192,
			'latlng': {
				'lat': 48.21345,
				'lng': 16.36192
			}
		},
		{
			'distance': 66.1248731436344,
			'bearing': 55.047847969380655,
			'latitude': 48.21379,
			'longitude': 16.36265,
			'latlng': {
				'lat': 48.21379,
				'lng': 16.36265
			}
		},
		{
			'distance': 58.136328559519505,
			'bearing': 145.40965672933078,
			'latitude': 48.21336,
			'longitude': 16.363095,
			'latlng': {
				'lat': 48.21336,
				'lng': 16.363095
			}
		},
		{
			'distance': 58.13648311587868,
			'bearing': 145.40943186166436,
			'latitude': 48.21293,
			'longitude': 16.36354,
			'latlng': {
				'lat': 48.21293,
				'lng': 16.36354
			}
		},
		{
			'distance': 7.034342314599956,
			'bearing': 161.5728282670949,
			'latitude': 48.21287,
			'longitude': 16.36357,
			'latlng': {
				'lat': 48.21287,
				'lng': 16.36357
			}
		},
		{
			'distance': 50.58733512946172,
			'bearing': 154.3840511831786,
			'latitude': 48.21246,
			'longitude': 16.363865,
			'latlng': {
				'lat': 48.21246,
				'lng': 16.363865
			}
		},
		{
			'distance': 50.58740803394987,
			'bearing': 154.3838723388318,
			'latitude': 48.21205,
			'longitude': 16.36416,
			'latlng': {
				'lat': 48.21205,
				'lng': 16.36416
			}
		},
		{
			'distance': 30.18046562491832,
			'bearing': 134.51413255548744,
			'latitude': 48.21186,
			'longitude': 16.36445,
			'latlng': {
				'lat': 48.21186,
				'lng': 16.36445
			}
		},
		{
			'distance': 16.292505325091373,
			'bearing': 114.23694092017035,
			'latitude': 48.2118,
			'longitude': 16.36465,
			'latlng': {
				'lat': 48.2118,
				'lng': 16.36465
			}
		},
		{
			'distance': 58.18161251006091,
			'bearing': 106.70575049646789,
			'latitude': 48.21165,
			'longitude': 16.3654,
			'latlng': {
				'lat': 48.21165,
				'lng': 16.3654
			}
		},
		{
			'distance': 32.16132342909258,
			'bearing': 121.31485565388738,
			'latitude': 48.2115,
			'longitude': 16.36577,
			'latlng': {
				'lat': 48.2115,
				'lng': 16.36577
			}
		},
		{
			'distance': 42.63644140559245,
			'bearing': 123.2858480495006,
			'latitude': 48.21129,
			'longitude': 16.36625,
			'latlng': {
				'lat': 48.21129,
				'lng': 16.36625
			}
		},
		{
			'distance': 12.321372602192765,
			'bearing': 173.09164406551395,
			'latitude': 48.21118,
			'longitude': 16.36627,
			'latlng': {
				'lat': 48.21118,
				'lng': 16.36627
			}
		},
		{
			'distance': 97.9448582364838,
			'bearing': 208.9816172273182,
			'latitude': 48.21041,
			'longitude': 16.36563,
			'latlng': {
				'lat': 48.21041,
				'lng': 16.36563
			}
		},
		{
			'distance': 42.920276111866315,
			'bearing': 130.45126047806423,
			'latitude': 48.21016,
			'longitude': 16.36607,
			'latlng': {
				'lat': 48.21016,
				'lng': 16.36607
			}
		},
		{
			'distance': 55.940945596184946,
			'bearing': 137.43062489783972,
			'latitude': 48.20979,
			'longitude': 16.36658,
			'latlng': {
				'lat': 48.20979,
				'lng': 16.36658
			}
		},
		{
			'distance': 61.84168416319796,
			'bearing': 238.4955152944654,
			'latitude': 48.2095,
			'longitude': 16.36587,
			'latlng': {
				'lat': 48.2095,
				'lng': 16.36587
			}
		},
		{
			'distance': 66.5408077792434,
			'bearing': 160.8145535729018,
			'latitude': 48.208935,
			'longitude': 16.366165,
			'latlng': {
				'lat': 48.208935,
				'lng': 16.366165
			}
		},
		{
			'distance': 66.54088138759334,
			'bearing': 160.81435738040216,
			'latitude': 48.20837,
			'longitude': 16.36646,
			'latlng': {
				'lat': 48.20837,
				'lng': 16.36646
			}
		},
		{
			'distance': 20.234582110328077,
			'bearing': 171.5760303406836,
			'latitude': 48.20819,
			'longitude': 16.3665,
			'latlng': {
				'lat': 48.20819,
				'lng': 16.3665
			}
		},
		{
			'distance': 7.432461102697145,
			'bearing': 89.99996272093045,
			'latitude': 48.20819,
			'longitude': 16.3666,
			'latlng': {
				'lat': 48.20819,
				'lng': 16.3666
			}
		},
		{
			'distance': 11.797621470792603,
			'bearing': 118.18714185175361,
			'latitude': 48.20814,
			'longitude': 16.36674,
			'latlng': {
				'lat': 48.20814,
				'lng': 16.36674
			}
		},
		{
			'distance': 8.93676295176665,
			'bearing': 138.37666273224136,
			'latitude': 48.20808,
			'longitude': 16.36682,
			'latlng': {
				'lat': 48.20808,
				'lng': 16.36682
			}
		},
		{
			'distance': 9.17074489326283,
			'bearing': 165.96857470781526,
			'latitude': 48.208,
			'longitude': 16.36685,
			'latlng': {
				'lat': 48.208,
				'lng': 16.36685
			}
		},
		{
			'distance': 5.559718335226204,
			'bearing': 180,
			'latitude': 48.20795,
			'longitude': 16.36685,
			'latlng': {
				'lat': 48.20795,
				'lng': 16.36685
			}
		},
		{
			'distance': 11.72400930015181,
			'bearing': 198.42885691561685,
			'latitude': 48.20785,
			'longitude': 16.3668,
			'latlng': {
				'lat': 48.20785,
				'lng': 16.3668
			}
		},
		{
			'distance': 7.61440577345793,
			'bearing': 223.01497256027434,
			'latitude': 48.2078,
			'longitude': 16.36673,
			'latlng': {
				'lat': 48.2078,
				'lng': 16.36673
			}
		},
		{
			'distance': 10.26308191639426,
			'bearing': 139.40866277381144,
			'latitude': 48.20773,
			'longitude': 16.36682,
			'latlng': {
				'lat': 48.20773,
				'lng': 16.36682
			}
		},
		{
			'distance': 94.35810761497572,
			'bearing': 156.8674859422557,
			'latitude': 48.20695,
			'longitude': 16.36732,
			'latlng': {
				'lat': 48.20695,
				'lng': 16.36732
			}
		},
		{
			'distance': 82.4529661039537,
			'bearing': 163.28117236098387,
			'latitude': 48.20624,
			'longitude': 16.36764,
			'latlng': {
				'lat': 48.20624,
				'lng': 16.36764
			}
		},
		{
			'distance': 25.875926551501117,
			'bearing': 154.54373940956668,
			'latitude': 48.20603,
			'longitude': 16.36779,
			'latlng': {
				'lat': 48.20603,
				'lng': 16.36779
			}
		},
		{
			'distance': 74.35719704658563,
			'bearing': 163.19616066954586,
			'latitude': 48.20539,
			'longitude': 16.36808,
			'latlng': {
				'lat': 48.20539,
				'lng': 16.36808
			}
		},
		{
			'distance': 13.801860877951832,
			'bearing': 143.75446983690205,
			'latitude': 48.20529,
			'longitude': 16.36819,
			'latlng': {
				'lat': 48.20529,
				'lng': 16.36819
			}
		},
		{
			'distance': 9.987933306177464,
			'bearing': 131.99583624886805,
			'latitude': 48.20523,
			'longitude': 16.36829,
			'latlng': {
				'lat': 48.20523,
				'lng': 16.36829
			}
		},
		{
			'distance': 17.388273682929423,
			'bearing': 140.20288949213466,
			'latitude': 48.20511,
			'longitude': 16.36844,
			'latlng': {
				'lat': 48.20511,
				'lng': 16.36844
			}
		},
		{
			'distance': 90.08960743515584,
			'bearing': 159.7804413116703,
			'latitude': 48.20435,
			'longitude': 16.36886,
			'latlng': {
				'lat': 48.20435,
				'lng': 16.36886
			}
		},
		{
			'distance': 49.231399511474955,
			'bearing': 202.11639444997004,
			'latitude': 48.20394,
			'longitude': 16.36861,
			'latlng': {
				'lat': 48.20394,
				'lng': 16.36861
			}
		},
		{
			'distance': 62.90287206567513,
			'bearing': 198.9108233149197,
			'latitude': 48.203405,
			'longitude': 16.368335,
			'latlng': {
				'lat': 48.203405,
				'lng': 16.368335
			}
		},
		{
			'distance': 62.90293597538971,
			'bearing': 198.9110067962419,
			'latitude': 48.20287,
			'longitude': 16.36806,
			'latlng': {
				'lat': 48.20287,
				'lng': 16.36806
			}
		},
		{
			'distance': 11.205153455095155,
			'bearing': 275.71210964756506,
			'latitude': 48.20288,
			'longitude': 16.36791,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36791
			}
		},
		{
			'distance': 17.839750544367828,
			'bearing': 270.00008946153986,
			'latitude': 48.20288,
			'longitude': 16.36767,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36767
			}
		},
		{
			'distance': 69.08932249318279,
			'bearing': 288.8295792901419,
			'latitude': 48.20308,
			'longitude': 16.36679,
			'latlng': {
				'lat': 48.20308,
				'lng': 16.36679
			}
		},
		{
			'distance': 69.08908165604525,
			'bearing': 288.8296476298043,
			'latitude': 48.20328,
			'longitude': 16.36591,
			'latlng': {
				'lat': 48.20328,
				'lng': 16.36591
			}
		},
		{
			'distance': 7.819011170315559,
			'bearing': 354.5611101097695,
			'latitude': 48.20335,
			'longitude': 16.3659,
			'latlng': {
				'lat': 48.20335,
				'lng': 16.3659
			}
		},
		{
			'distance': 41.25080175117397,
			'bearing': 287.297001993274,
			'latitude': 48.20346,
			'longitude': 16.36537,
			'latlng': {
				'lat': 48.20346,
				'lng': 16.36537
			}
		},
		{
			'distance': 2.229943643552387,
			'bearing': 89.99998881703846,
			'latitude': 48.20346,
			'longitude': 16.3654,
			'latlng': {
				'lat': 48.20346,
				'lng': 16.3654
			}
		},
		{
			'distance': 39.12672585103384,
			'bearing': 108.26727001428367,
			'latitude': 48.20335,
			'longitude': 16.3659,
			'latlng': {
				'lat': 48.20335,
				'lng': 16.3659
			}
		},
		{
			'distance': 7.819011170166885,
			'bearing': 174.5611026547864,
			'latitude': 48.20328,
			'longitude': 16.36591,
			'latlng': {
				'lat': 48.20328,
				'lng': 16.36591
			}
		},
		{
			'distance': 69.0890816561702,
			'bearing': 108.82899157833339,
			'latitude': 48.20308,
			'longitude': 16.36679,
			'latlng': {
				'lat': 48.20308,
				'lng': 16.36679
			}
		},
		{
			'distance': 69.08932249326912,
			'bearing': 108.82892324062232,
			'latitude': 48.20288,
			'longitude': 16.36767,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36767
			}
		},
		{
			'distance': 17.839750544367828,
			'bearing': 89.99991053846014,
			'latitude': 48.20288,
			'longitude': 16.36791,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36791
			}
		},
		{
			'distance': 11.20515345507161,
			'bearing': 95.71199782285561,
			'latitude': 48.20287,
			'longitude': 16.36806,
			'latlng': {
				'lat': 48.20287,
				'lng': 16.36806
			}
		},
		{
			'distance': 7.758776209079205,
			'bearing': 106.70326245004543,
			'latitude': 48.20285,
			'longitude': 16.36816,
			'latlng': {
				'lat': 48.20285,
				'lng': 16.36816
			}
		},
		{
			'distance': 57.975706283117795,
			'bearing': 18.2565961378383,
			'latitude': 48.203345,
			'longitude': 16.368405,
			'latlng': {
				'lat': 48.203345,
				'lng': 16.368405
			}
		},
		{
			'distance': 57.97565568899477,
			'bearing': 18.25643141104564,
			'latitude': 48.20384,
			'longitude': 16.36865,
			'latlng': {
				'lat': 48.20384,
				'lng': 16.36865
			}
		},
		{
			'distance': 11.510074352667022,
			'bearing': 14.92744784296923,
			'latitude': 48.20394,
			'longitude': 16.36869,
			'latlng': {
				'lat': 48.20394,
				'lng': 16.36869
			}
		},
		{
			'distance': 14.474355799332562,
			'bearing': 2.934850748278791,
			'latitude': 48.20407,
			'longitude': 16.3687,
			'latlng': {
				'lat': 48.20407,
				'lng': 16.3687
			}
		},
		{
			'distance': 22.396354574864695,
			'bearing': 19.329712852521652,
			'latitude': 48.20426,
			'longitude': 16.3688,
			'latlng': {
				'lat': 48.20426,
				'lng': 16.3688
			}
		},
		{
			'distance': 10.95626432868783,
			'bearing': 23.95639924636663,
			'latitude': 48.20435,
			'longitude': 16.36886,
			'latlng': {
				'lat': 48.20435,
				'lng': 16.36886
			}
		},
		{
			'distance': 12.351808152667248,
			'bearing': 105.71284873724358,
			'latitude': 48.20432,
			'longitude': 16.36902,
			'latlng': {
				'lat': 48.20432,
				'lng': 16.36902
			}
		},
		{
			'distance': 74.43478441648848,
			'bearing': 29.87913029340666,
			'latitude': 48.2049,
			'longitude': 16.36952,
			'latlng': {
				'lat': 48.2049,
				'lng': 16.36952
			}
		},
		{
			'distance': 69.7059832559024,
			'bearing': 293.56604748069464,
			'latitude': 48.20515,
			'longitude': 16.36866,
			'latlng': {
				'lat': 48.20515,
				'lng': 16.36866
			}
		},
		{
			'distance': 16.946483081207802,
			'bearing': 254.7405781510738,
			'latitude': 48.20511,
			'longitude': 16.36844,
			'latlng': {
				'lat': 48.20511,
				'lng': 16.36844
			}
		},
		{
			'distance': 17.388273683261737,
			'bearing': 320.20300132226146,
			'latitude': 48.20523,
			'longitude': 16.36829,
			'latlng': {
				'lat': 48.20523,
				'lng': 16.36829
			}
		},
		{
			'distance': 9.987933306255835,
			'bearing': 311.9959108026724,
			'latitude': 48.20529,
			'longitude': 16.36819,
			'latlng': {
				'lat': 48.20529,
				'lng': 16.36819
			}
		},
		{
			'distance': 13.801860877733072,
			'bearing': 323.7545518462853,
			'latitude': 48.20539,
			'longitude': 16.36808,
			'latlng': {
				'lat': 48.20539,
				'lng': 16.36808
			}
		},
		{
			'distance': 74.35719704638836,
			'bearing': 343.19637687691284,
			'latitude': 48.20603,
			'longitude': 16.36779,
			'latlng': {
				'lat': 48.20603,
				'lng': 16.36779
			}
		},
		{
			'distance': 8.033181916899908,
			'bearing': 303.6985485629031,
			'latitude': 48.20607,
			'longitude': 16.3677,
			'latlng': {
				'lat': 48.20607,
				'lng': 16.3677
			}
		},
		{
			'distance': 16.985544510341967,
			'bearing': 328.4007533657654,
			'latitude': 48.2062,
			'longitude': 16.36758,
			'latlng': {
				'lat': 48.2062,
				'lng': 16.36758
			}
		},
		{
			'distance': 11.21836055217021,
			'bearing': 352.4077906303225,
			'latitude': 48.2063,
			'longitude': 16.36756,
			'latlng': {
				'lat': 48.2063,
				'lng': 16.36756
			}
		},
		{
			'distance': 73.29360737592134,
			'bearing': 342.94530362491116,
			'latitude': 48.20693,
			'longitude': 16.36727,
			'latlng': {
				'lat': 48.20693,
				'lng': 16.36727
			}
		},
		{
			'distance': 7.127295792836967,
			'bearing': 321.3496353222022,
			'latitude': 48.20698,
			'longitude': 16.36721,
			'latlng': {
				'lat': 48.20698,
				'lng': 16.36721
			}
		},
		{
			'distance': 14.321793657483973,
			'bearing': 338.7560762523086,
			'latitude': 48.2071,
			'longitude': 16.36714,
			'latlng': {
				'lat': 48.2071,
				'lng': 16.36714
			}
		},
		{
			'distance': 35.426581991378164,
			'bearing': 346.69526363933784,
			'latitude': 48.20741,
			'longitude': 16.36703,
			'latlng': {
				'lat': 48.20741,
				'lng': 16.36703
			}
		},
		{
			'distance': 38.85503040569456,
			'bearing': 336.3780447548422,
			'latitude': 48.20773,
			'longitude': 16.36682,
			'latlng': {
				'lat': 48.20773,
				'lng': 16.36682
			}
		},
		{
			'distance': 10.263081915993848,
			'bearing': 319.408729873241,
			'latitude': 48.2078,
			'longitude': 16.36673,
			'latlng': {
				'lat': 48.2078,
				'lng': 16.36673
			}
		},
		{
			'distance': 7.614405773168182,
			'bearing': 43.014920370905884,
			'latitude': 48.20785,
			'longitude': 16.3668,
			'latlng': {
				'lat': 48.20785,
				'lng': 16.3668
			}
		},
		{
			'distance': 11.724009300371032,
			'bearing': 18.428819636355968,
			'latitude': 48.20795,
			'longitude': 16.36685,
			'latlng': {
				'lat': 48.20795,
				'lng': 16.36685
			}
		},
		{
			'distance': 5.559718335226204,
			'bearing': 0,
			'latitude': 48.208,
			'longitude': 16.36685,
			'latlng': {
				'lat': 48.208,
				'lng': 16.36685
			}
		},
		{
			'distance': 9.17074489320684,
			'bearing': 345.9685970749502,
			'latitude': 48.20808,
			'longitude': 16.36682,
			'latlng': {
				'lat': 48.20808,
				'lng': 16.36682
			}
		},
		{
			'distance': 8.936762951578782,
			'bearing': 318.37672237785546,
			'latitude': 48.20814,
			'longitude': 16.36674,
			'latlng': {
				'lat': 48.20814,
				'lng': 16.36674
			}
		},
		{
			'distance': 61.070464122208875,
			'bearing': 42.403608183879726,
			'latitude': 48.208545,
			'longitude': 16.367295,
			'latlng': {
				'lat': 48.208545,
				'lng': 16.367295
			}
		},
		{
			'distance': 61.07024679361909,
			'bearing': 42.40338256025382,
			'latitude': 48.20895,
			'longitude': 16.36785,
			'latlng': {
				'lat': 48.20895,
				'lng': 16.36785
			}
		},
		{
			'distance': 65.47383407844542,
			'bearing': 311.56366287080687,
			'latitude': 48.20934,
			'longitude': 16.36719,
			'latlng': {
				'lat': 48.20934,
				'lng': 16.36719
			}
		},
		{
			'distance': 67.52166059751342,
			'bearing': 317.90704949554345,
			'latitude': 48.20979,
			'longitude': 16.36658,
			'latlng': {
				'lat': 48.20979,
				'lng': 16.36658
			}
		},
		{
			'distance': 48.85016354126419,
			'bearing': 238.35418768522547,
			'latitude': 48.20956,
			'longitude': 16.36602,
			'latlng': {
				'lat': 48.20956,
				'lng': 16.36602
			}
		},
		{
			'distance': 12.99222609399586,
			'bearing': 239.02650657830657,
			'latitude': 48.2095,
			'longitude': 16.36587,
			'latlng': {
				'lat': 48.2095,
				'lng': 16.36587
			}
		},
		{
			'distance': 56.388011106049895,
			'bearing': 333.86522408185647,
			'latitude': 48.209955,
			'longitude': 16.365535,
			'latlng': {
				'lat': 48.209955,
				'lng': 16.365535
			}
		},
		{
			'distance': 56.38791732962557,
			'bearing': 333.86542539295954,
			'latitude': 48.21041,
			'longitude': 16.3652,
			'latlng': {
				'lat': 48.21041,
				'lng': 16.3652
			}
		},
		{
			'distance': 55.7250644480661,
			'bearing': 153.95542740826022,
			'latitude': 48.20996,
			'longitude': 16.36553,
			'latlng': {
				'lat': 48.20996,
				'lng': 16.36553
			}
		},
		{
			'distance': 8.697875961608206,
			'bearing': 230.18332363903036,
			'latitude': 48.20991,
			'longitude': 16.36544,
			'latlng': {
				'lat': 48.20991,
				'lng': 16.36544
			}
		},
		{
			'distance': 45.154143147093166,
			'bearing': 238.78402945559313,
			'latitude': 48.2097,
			'longitude': 16.36492,
			'latlng': {
				'lat': 48.2097,
				'lng': 16.36492
			}
		},
		{
			'distance': 45.154143146882674,
			'bearing': 58.78364174874844,
			'latitude': 48.20991,
			'longitude': 16.36544,
			'latlng': {
				'lat': 48.20991,
				'lng': 16.36544
			}
		},
		{
			'distance': 8.697875961313391,
			'bearing': 50.18325653759797,
			'latitude': 48.20996,
			'longitude': 16.36553,
			'latlng': {
				'lat': 48.20996,
				'lng': 16.36553
			}
		},
		{
			'distance': 57.05100183561887,
			'bearing': 153.77682095505247,
			'latitude': 48.2095,
			'longitude': 16.36587,
			'latlng': {
				'lat': 48.2095,
				'lng': 16.36587
			}
		},
		{
			'distance': 16.94348338005025,
			'bearing': 156.80937048470696,
			'latitude': 48.20936,
			'longitude': 16.36596,
			'latlng': {
				'lat': 48.20936,
				'lng': 16.36596
			}
		},
		{
			'distance': 58.09288258795648,
			'bearing': 161.39808001384336,
			'latitude': 48.208865,
			'longitude': 16.36621,
			'latlng': {
				'lat': 48.208865,
				'lng': 16.36621
			}
		},
		{
			'distance': 58.092935349065854,
			'bearing': 161.39791258688535,
			'latitude': 48.20837,
			'longitude': 16.36646,
			'latlng': {
				'lat': 48.20837,
				'lng': 16.36646
			}
		},
		{
			'distance': 20.234582110328077,
			'bearing': 171.5760303406836,
			'latitude': 48.20819,
			'longitude': 16.3665,
			'latlng': {
				'lat': 48.20819,
				'lng': 16.3665
			}
		},
		{
			'distance': 7.432461102697145,
			'bearing': 89.99996272093045,
			'latitude': 48.20819,
			'longitude': 16.3666,
			'latlng': {
				'lat': 48.20819,
				'lng': 16.3666
			}
		},
		{
			'distance': 11.797621470792603,
			'bearing': 118.18714185175361,
			'latitude': 48.20814,
			'longitude': 16.36674,
			'latlng': {
				'lat': 48.20814,
				'lng': 16.36674
			}
		},
		{
			'distance': 8.93676295176665,
			'bearing': 138.37666273224136,
			'latitude': 48.20808,
			'longitude': 16.36682,
			'latlng': {
				'lat': 48.20808,
				'lng': 16.36682
			}
		},
		{
			'distance': 9.17074489326283,
			'bearing': 165.96857470781526,
			'latitude': 48.208,
			'longitude': 16.36685,
			'latlng': {
				'lat': 48.208,
				'lng': 16.36685
			}
		},
		{
			'distance': 5.559718335226204,
			'bearing': 180,
			'latitude': 48.20795,
			'longitude': 16.36685,
			'latlng': {
				'lat': 48.20795,
				'lng': 16.36685
			}
		},
		{
			'distance': 11.72400930015181,
			'bearing': 198.42885691561685,
			'latitude': 48.20785,
			'longitude': 16.3668,
			'latlng': {
				'lat': 48.20785,
				'lng': 16.3668
			}
		},
		{
			'distance': 55.61897423631093,
			'bearing': 102.74048419730042,
			'latitude': 48.20774,
			'longitude': 16.36753,
			'latlng': {
				'lat': 48.20774,
				'lng': 16.36753
			}
		},
		{
			'distance': 20.901539541670047,
			'bearing': 154.80657362189436,
			'latitude': 48.20757,
			'longitude': 16.36765,
			'latlng': {
				'lat': 48.20757,
				'lng': 16.36765
			}
		},
		{
			'distance': 9.91493769057273,
			'bearing': 77.00094910072289,
			'latitude': 48.20759,
			'longitude': 16.36778,
			'latlng': {
				'lat': 48.20759,
				'lng': 16.36778
			}
		},
		{
			'distance': 89.05975394775838,
			'bearing': 32.489161083219585,
			'latitude': 48.208265,
			'longitude': 16.368425,
			'latlng': {
				'lat': 48.208265,
				'lng': 16.368425
			}
		},
		{
			'distance': 89.05942231460863,
			'bearing': 32.4888189345246,
			'latitude': 48.20894,
			'longitude': 16.36907,
			'latlng': {
				'lat': 48.20894,
				'lng': 16.36907
			}
		},
		{
			'distance': 8.661554606399344,
			'bearing': 59.026694781604306,
			'latitude': 48.20898,
			'longitude': 16.36917,
			'latlng': {
				'lat': 48.20898,
				'lng': 16.36917
			}
		},
		{
			'distance': 60.84986515575651,
			'bearing': 131.91967518719548,
			'latitude': 48.208615,
			'longitude': 16.36978,
			'latlng': {
				'lat': 48.208615,
				'lng': 16.36978
			}
		},
		{
			'distance': 60.850103463773394,
			'bearing': 131.9194721912445,
			'latitude': 48.20825,
			'longitude': 16.37039,
			'latlng': {
				'lat': 48.20825,
				'lng': 16.37039
			}
		},
		{
			'distance': 17.660110960278942,
			'bearing': 112.25620704021628,
			'latitude': 48.20819,
			'longitude': 16.37061,
			'latlng': {
				'lat': 48.20819,
				'lng': 16.37061
			}
		},
		{
			'distance': 82.30668714140079,
			'bearing': 198.9185502782084,
			'latitude': 48.20749,
			'longitude': 16.37025,
			'latlng': {
				'lat': 48.20749,
				'lng': 16.37025
			}
		},
		{
			'distance': 78.72970322724312,
			'bearing': 203.2979448458739,
			'latitude': 48.20684,
			'longitude': 16.36983,
			'latlng': {
				'lat': 48.20684,
				'lng': 16.36983
			}
		},
		{
			'distance': 36.49756301962178,
			'bearing': 207.85922957535348,
			'latitude': 48.20655,
			'longitude': 16.3696,
			'latlng': {
				'lat': 48.20655,
				'lng': 16.3696
			}
		},
		{
			'distance': 50.61893181528095,
			'bearing': 213.33228503359092,
			'latitude': 48.20617,
			'longitude': 16.369225,
			'latlng': {
				'lat': 48.20617,
				'lng': 16.369225
			}
		},
		{
			'distance': 50.61904300410995,
			'bearing': 213.3324801969718,
			'latitude': 48.20579,
			'longitude': 16.36885,
			'latlng': {
				'lat': 48.20579,
				'lng': 16.36885
			}
		},
		{
			'distance': 8.92654475367035,
			'bearing': 175.23784120457583,
			'latitude': 48.20571,
			'longitude': 16.36886,
			'latlng': {
				'lat': 48.20571,
				'lng': 16.36886
			}
		},
		{
			'distance': 68.14463980056752,
			'bearing': 218.35910719418,
			'latitude': 48.20523,
			'longitude': 16.36829,
			'latlng': {
				'lat': 48.20523,
				'lng': 16.36829
			}
		},
		{
			'distance': 17.388273682929423,
			'bearing': 140.20288949213466,
			'latitude': 48.20511,
			'longitude': 16.36844,
			'latlng': {
				'lat': 48.20511,
				'lng': 16.36844
			}
		},
		{
			'distance': 90.08960743515584,
			'bearing': 159.7804413116703,
			'latitude': 48.20435,
			'longitude': 16.36886,
			'latlng': {
				'lat': 48.20435,
				'lng': 16.36886
			}
		},
		{
			'distance': 49.231399511474955,
			'bearing': 202.11639444997004,
			'latitude': 48.20394,
			'longitude': 16.36861,
			'latlng': {
				'lat': 48.20394,
				'lng': 16.36861
			}
		},
		{
			'distance': 62.90287206567513,
			'bearing': 198.9108233149197,
			'latitude': 48.203405,
			'longitude': 16.368335,
			'latlng': {
				'lat': 48.203405,
				'lng': 16.368335
			}
		},
		{
			'distance': 62.90293597538971,
			'bearing': 198.9110067962419,
			'latitude': 48.20287,
			'longitude': 16.36806,
			'latlng': {
				'lat': 48.20287,
				'lng': 16.36806
			}
		},
		{
			'distance': 11.205153455095155,
			'bearing': 275.71210964756506,
			'latitude': 48.20288,
			'longitude': 16.36791,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36791
			}
		},
		{
			'distance': 17.839750544367828,
			'bearing': 270.00008946153986,
			'latitude': 48.20288,
			'longitude': 16.36767,
			'latlng': {
				'lat': 48.20288,
				'lng': 16.36767
			}
		},
		{
			'distance': 69.08932249318279,
			'bearing': 288.8295792901419,
			'latitude': 48.20308,
			'longitude': 16.36679,
			'latlng': {
				'lat': 48.20308,
				'lng': 16.36679
			}
		},
		{
			'distance': 69.08908165604525,
			'bearing': 288.8296476298043,
			'latitude': 48.20328,
			'longitude': 16.36591,
			'latlng': {
				'lat': 48.20328,
				'lng': 16.36591
			}
		},
		{
			'distance': 7.819011170315559,
			'bearing': 354.5611101097695,
			'latitude': 48.20335,
			'longitude': 16.3659,
			'latlng': {
				'lat': 48.20335,
				'lng': 16.3659
			}
		},
		{
			'distance': 56.75113234981675,
			'bearing': 288.32118072667794,
			'latitude': 48.20351,
			'longitude': 16.365175,
			'latlng': {
				'lat': 48.20351,
				'lng': 16.365175
			}
		},
		{
			'distance': 56.75097313378009,
			'bearing': 288.3212341324377,
			'latitude': 48.20367,
			'longitude': 16.36445,
			'latlng': {
				'lat': 48.20367,
				'lng': 16.36445
			}
		},
		{
			'distance': 4.994050832490196,
			'bearing': 311.99501609412675,
			'latitude': 48.2037,
			'longitude': 16.3644,
			'latlng': {
				'lat': 48.2037,
				'lng': 16.3644
			}
		},
		{
			'distance': 5.559714203657111,
			'bearing': 0,
			'latitude': 48.20375,
			'longitude': 16.3644,
			'latlng': {
				'lat': 48.20375,
				'lng': 16.3644
			}
		},
		{
			'distance': 37.56939401367626,
			'bearing': 317.81047458769996,
			'latitude': 48.204,
			'longitude': 16.36406,
			'latlng': {
				'lat': 48.204,
				'lng': 16.36406
			}
		},
		{
			'distance': 7.433067348844813,
			'bearing': 270.00003727601995,
			'latitude': 48.204,
			'longitude': 16.36396,
			'latlng': {
				'lat': 48.204,
				'lng': 16.36396
			}
		},
		{
			'distance': 19.148150509151993,
			'bearing': 215.53019946222648,
			'latitude': 48.20386,
			'longitude': 16.36381,
			'latlng': {
				'lat': 48.20386,
				'lng': 16.36381
			}
		},
		{
			'distance': 94.1479761619051,
			'bearing': 228.50919057138003,
			'latitude': 48.2033,
			'longitude': 16.36286,
			'latlng': {
				'lat': 48.2033,
				'lng': 16.36286
			}
		},
		{
			'distance': 9.988139612111116,
			'bearing': 311.9948372840968,
			'latitude': 48.20336,
			'longitude': 16.36276,
			'latlng': {
				'lat': 48.20336,
				'lng': 16.36276
			}
		},
		{
			'distance': 60.76326479254823,
			'bearing': 228.7080359254393,
			'latitude': 48.203,
			'longitude': 16.362145,
			'latlng': {
				'lat': 48.203,
				'lng': 16.362145
			}
		},
		{
			'distance': 60.763504123173625,
			'bearing': 228.70823558067886,
			'latitude': 48.20264,
			'longitude': 16.36153,
			'latlng': {
				'lat': 48.20264,
				'lng': 16.36153
			}
		},
		{
			'distance': 18.377342116214162,
			'bearing': 223.35628804073184,
			'latitude': 48.20252,
			'longitude': 16.36136,
			'latlng': {
				'lat': 48.20252,
				'lng': 16.36136
			}
		},
		{
			'distance': 77.46854645199988,
			'bearing': 216.42438123202294,
			'latitude': 48.20196,
			'longitude': 16.36074,
			'latlng': {
				'lat': 48.20196,
				'lng': 16.36074
			}
		},
		{
			'distance': 48.09761789862624,
			'bearing': 218.10115282497722,
			'latitude': 48.20162,
			'longitude': 16.36034,
			'latlng': {
				'lat': 48.20162,
				'lng': 16.36034
			}
		},
		{
			'distance': 27.03429970201795,
			'bearing': 225.54972470422507,
			'latitude': 48.20145,
			'longitude': 16.36008,
			'latlng': {
				'lat': 48.20145,
				'lng': 16.36008
			}
		},
		{
			'distance': 25.39989499205671,
			'bearing': 232.11877902305304,
			'latitude': 48.20131,
			'longitude': 16.35981,
			'latlng': {
				'lat': 48.20131,
				'lng': 16.35981
			}
		},
		{
			'distance': 25.352519492368593,
			'bearing': 238.1668665480138,
			'latitude': 48.20119,
			'longitude': 16.35952,
			'latlng': {
				'lat': 48.20119,
				'lng': 16.35952
			}
		},
		{
			'distance': 29.902679241370908,
			'bearing': 243.42996332757383,
			'latitude': 48.20107,
			'longitude': 16.35916,
			'latlng': {
				'lat': 48.20107,
				'lng': 16.35916
			}
		},
		{
			'distance': 69.4496419974794,
			'bearing': 252.24031424879195,
			'latitude': 48.20088,
			'longitude': 16.35827,
			'latlng': {
				'lat': 48.20088,
				'lng': 16.35827
			}
		},
		{
			'distance': 70.15839269580272,
			'bearing': 250.5059003041103,
			'latitude': 48.20067,
			'longitude': 16.35738,
			'latlng': {
				'lat': 48.20067,
				'lng': 16.35738
			}
		},
		{
			'distance': 70.15864739450814,
			'bearing': 250.50597419126126,
			'latitude': 48.20046,
			'longitude': 16.35649,
			'latlng': {
				'lat': 48.20046,
				'lng': 16.35649
			}
		},
		{
			'distance': 70.15890209239588,
			'bearing': 250.50604807885253,
			'latitude': 48.20025,
			'longitude': 16.3556,
			'latlng': {
				'lat': 48.20025,
				'lng': 16.3556
			}
		},
		{
			'distance': 74.80480790396284,
			'bearing': 245.3400222528172,
			'latitude': 48.19997,
			'longitude': 16.354685,
			'latlng': {
				'lat': 48.19997,
				'lng': 16.354685
			}
		},
		{
			'distance': 74.805144296815,
			'bearing': 245.34014099732312,
			'latitude': 48.19969,
			'longitude': 16.35377,
			'latlng': {
				'lat': 48.19969,
				'lng': 16.35377
			}
		},
		{
			'distance': 69.6181834973276,
			'bearing': 242.33690472707906,
			'latitude': 48.1994,
			'longitude': 16.35294,
			'latlng': {
				'lat': 48.1994,
				'lng': 16.35294
			}
		},
		{
			'distance': 58.93391884050443,
			'bearing': 241.16911545532597,
			'latitude': 48.199145,
			'longitude': 16.352245,
			'latlng': {
				'lat': 48.199145,
				'lng': 16.352245
			}
		},
		{
			'distance': 58.93414300314153,
			'bearing': 241.16923593500866,
			'latitude': 48.19889,
			'longitude': 16.35155,
			'latlng': {
				'lat': 48.19889,
				'lng': 16.35155
			}
		},
		{
			'distance': 12.459888586973374,
			'bearing': 243.43089847390536,
			'latitude': 48.19884,
			'longitude': 16.3514,
			'latlng': {
				'lat': 48.19884,
				'lng': 16.3514
			}
		},
		{
			'distance': 79.9573225306098,
			'bearing': 334.74656388583907,
			'latitude': 48.19949,
			'longitude': 16.35094,
			'latlng': {
				'lat': 48.19949,
				'lng': 16.35094
			}
		},
		{
			'distance': 30.255427357199537,
			'bearing': 342.9004381759805,
			'latitude': 48.19975,
			'longitude': 16.35082,
			'latlng': {
				'lat': 48.19975,
				'lng': 16.35082
			}
		},
		{
			'distance': 42.0978118728055,
			'bearing': 347.8019433302563,
			'latitude': 48.20012,
			'longitude': 16.3507,
			'latlng': {
				'lat': 48.20012,
				'lng': 16.3507
			}
		},
		{
			'distance': 94.64972290996842,
			'bearing': 254.97920796227015,
			'latitude': 48.1999,
			'longitude': 16.34947,
			'latlng': {
				'lat': 48.1999,
				'lng': 16.34947
			}
		},
		{
			'distance': 98.16262085228689,
			'bearing': 259.85859471253605,
			'latitude': 48.199745,
			'longitude': 16.34817,
			'latlng': {
				'lat': 48.199745,
				'lng': 16.34817
			}
		},
		{
			'distance': 98.16290776027759,
			'bearing': 259.8586247597984,
			'latitude': 48.19959,
			'longitude': 16.34687,
			'latlng': {
				'lat': 48.19959,
				'lng': 16.34687
			}
		},
		{
			'distance': 93.08257578676502,
			'bearing': 256.3500603607323,
			'latitude': 48.199393,
			'longitude': 16.345653,
			'latlng': {
				'lat': 48.199393,
				'lng': 16.345653
			}
		},
		{
			'distance': 92.98453884527694,
			'bearing': 256.4060715729483,
			'latitude': 48.199197,
			'longitude': 16.344437,
			'latlng': {
				'lat': 48.199197,
				'lng': 16.344437
			}
		},
		{
			'distance': 93.08324794456699,
			'bearing': 256.3501611564783,
			'latitude': 48.199,
			'longitude': 16.34322,
			'latlng': {
				'lat': 48.199,
				'lng': 16.34322
			}
		},
		{
			'distance': 80.43088460073072,
			'bearing': 258.4028596064359,
			'latitude': 48.198855,
			'longitude': 16.34216,
			'latlng': {
				'lat': 48.198855,
				'lng': 16.34216
			}
		},
		{
			'distance': 80.4311023668034,
			'bearing': 258.4028915405975,
			'latitude': 48.19871,
			'longitude': 16.3411,
			'latlng': {
				'lat': 48.19871,
				'lng': 16.3411
			}
		},
		{
			'distance': 70.75698363740605,
			'bearing': 256.32673910840487,
			'latitude': 48.19856,
			'longitude': 16.340175,
			'latlng': {
				'lat': 48.19856,
				'lng': 16.340175
			}
		},
		{
			'distance': 70.75717860985192,
			'bearing': 256.32677763968564,
			'latitude': 48.19841,
			'longitude': 16.33925,
			'latlng': {
				'lat': 48.19841,
				'lng': 16.33925
			}
		},
		{
			'distance': 17.97937323281171,
			'bearing': 262.8738736198227,
			'latitude': 48.19839,
			'longitude': 16.33901,
			'latlng': {
				'lat': 48.19839,
				'lng': 16.33901
			}
		},
		{
			'distance': 59.237893457776146,
			'bearing': 250.1983329207152,
			'latitude': 48.19821,
			'longitude': 16.33826,
			'latlng': {
				'lat': 48.19821,
				'lng': 16.33826
			}
		},
		{
			'distance': 47.83660481905521,
			'bearing': 178.22423611899,
			'latitude': 48.19778,
			'longitude': 16.33828,
			'latlng': {
				'lat': 48.19778,
				'lng': 16.33828
			}
		},
		{
			'distance': 61.6837778996784,
			'bearing': 166.80078723513896,
			'latitude': 48.19724,
			'longitude': 16.33847,
			'latlng': {
				'lat': 48.19724,
				'lng': 16.33847
			}
		},
		{
			'distance': 61.68380636961032,
			'bearing': 166.80065298570776,
			'latitude': 48.1967,
			'longitude': 16.33866,
			'latlng': {
				'lat': 48.1967,
				'lng': 16.33866
			}
		},
		{
			'distance': 56.2862526950067,
			'bearing': 165.50789558464317,
			'latitude': 48.19621,
			'longitude': 16.33885,
			'latlng': {
				'lat': 48.19621,
				'lng': 16.33885
			}
		},
		{
			'distance': 56.2862819753923,
			'bearing': 165.50776282247216,
			'latitude': 48.19572,
			'longitude': 16.33904,
			'latlng': {
				'lat': 48.19572,
				'lng': 16.33904
			}
		},
		{
			'distance': 29.966888009151354,
			'bearing': 228.00959401600372,
			'latitude': 48.19554,
			'longitude': 16.33874,
			'latlng': {
				'lat': 48.19554,
				'lng': 16.33874
			}
		},
		{
			'distance': 95.86409077033876,
			'bearing': 243.03562842989615,
			'latitude': 48.19515,
			'longitude': 16.33759,
			'latlng': {
				'lat': 48.19515,
				'lng': 16.33759
			}
		},
		{
			'distance': 18.68858229345876,
			'bearing': 252.64433304572842,
			'latitude': 48.1951,
			'longitude': 16.33735,
			'latlng': {
				'lat': 48.1951,
				'lng': 16.33735
			}
		},
		{
			'distance': 8.625638225408515,
			'bearing': 334.5390389057787,
			'latitude': 48.19517,
			'longitude': 16.3373,
			'latlng': {
				'lat': 48.19517,
				'lng': 16.3373
			}
		}
	],
	'cTemps': [],
	'points': [
		{
			'lat': 48.19813,
			'lng': 16.33811,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'_calendar': {
						'sameDay': '[Today at] LT',
						'nextDay': '[Tomorrow at] LT',
						'nextWeek': 'dddd [at] LT',
						'lastDay': '[Yesterday at] LT',
						'lastWeek': '[Last] dddd [at] LT',
						'sameElse': 'L'
					},
					'_longDateFormat': {
						'LTS': 'h:mm:ss A',
						'LT': 'h:mm A',
						'L': 'MM/DD/YYYY',
						'LL': 'MMMM D, YYYY',
						'LLL': 'MMMM D, YYYY h:mm A',
						'LLLL': 'dddd, MMMM D, YYYY h:mm A'
					},
					'_invalidDate': 'Invalid date',
					'_dayOfMonthOrdinalParse': {},
					'_relativeTime': {
						'future': 'in %s',
						'past': '%s ago',
						's': 'a few seconds',
						'ss': '%d seconds',
						'm': 'a minute',
						'mm': '%d minutes',
						'h': 'an hour',
						'hh': '%d hours',
						'd': 'a day',
						'dd': '%d days',
						'M': 'a month',
						'MM': '%d months',
						'y': 'a year',
						'yy': '%d years'
					},
					'_months': [
						'January',
						'February',
						'March',
						'April',
						'May',
						'June',
						'July',
						'August',
						'September',
						'October',
						'November',
						'December'
					],
					'_monthsShort': [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					],
					'_week': {
						'dow': 0,
						'doy': 6
					},
					'_weekdays': [
						'Sunday',
						'Monday',
						'Tuesday',
						'Wednesday',
						'Thursday',
						'Friday',
						'Saturday'
					],
					'_weekdaysMin': [
						'Su',
						'Mo',
						'Tu',
						'We',
						'Th',
						'Fr',
						'Sa'
					],
					'_weekdaysShort': [
						'Sun',
						'Mon',
						'Tue',
						'Wed',
						'Thu',
						'Fri',
						'Sat'
					],
					'_meridiemParse': {},
					'_abbr': 'en',
					'_config': {
						'calendar': {
							'$ref': '$["points"][0]["time"]["_locale"]["_calendar"]'
						},
						'longDateFormat': {
							'$ref': '$["points"][0]["time"]["_locale"]["_longDateFormat"]'
						},
						'invalidDate': 'Invalid date',
						'dayOfMonthOrdinalParse': {},
						'relativeTime': {
							'$ref': '$["points"][0]["time"]["_locale"]["_relativeTime"]'
						},
						'months': {
							'$ref': '$["points"][0]["time"]["_locale"]["_months"]'
						},
						'monthsShort': {
							'$ref': '$["points"][0]["time"]["_locale"]["_monthsShort"]'
						},
						'week': {
							'$ref': '$["points"][0]["time"]["_locale"]["_week"]'
						},
						'weekdays': {
							'$ref': '$["points"][0]["time"]["_locale"]["_weekdays"]'
						},
						'weekdaysMin': {
							'$ref': '$["points"][0]["time"]["_locale"]["_weekdaysMin"]'
						},
						'weekdaysShort': {
							'$ref': '$["points"][0]["time"]["_locale"]["_weekdaysShort"]'
						},
						'meridiemParse': {},
						'abbr': 'en'
					},
					'_dayOfMonthOrdinalParseLenient': {}
				},
				'_d': '2019-02-28T18:40:21.739Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 83,
			'speed': '6.375565',
			'est': false
		},
		{
			'lat': 48.19818587681389,
			'lng': 16.338079521772247,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:22.739Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 88,
			'speed': '6.618537',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19824,
			'lng': 16.33805,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:23.740Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 88,
			'speed': '6.720991',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19826,
			'lng': 16.33806,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:24.740Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 89,
			'speed': '6.805266',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.1983,
			'lng': 16.33816,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:25.740Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 89,
			'speed': '6.741863',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19832398283286,
			'lng': 16.33824393896376,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:26.742Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 89,
			'speed': '6.762866',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19834898426354,
			'lng': 16.338331443026984,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:27.741Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 92,
			'speed': '7.071270',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19837498092537,
			'lng': 16.338422430412628,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:28.773Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 94,
			'speed': '7.117639',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.198398630730374,
			'lng': 16.33850520391118,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:29.738Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 92,
			'speed': '6.924657',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.198423256125245,
			'lng': 16.338591391986473,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:30.738Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 92,
			'speed': '6.957949',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19844721786559,
			'lng': 16.338675257328937,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:31.737Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 90,
			'speed': '6.784000',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19848,
			'lng': 16.33879,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:32.737Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 91,
			'speed': '7.048312',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.1985419357775,
			'lng': 16.33876999021455,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:33.737Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 92,
			'speed': '7.059772',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.198601937573294,
			'lng': 16.33875060522393,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:34.741Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 92,
			'speed': '6.805266',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19866289520354,
			'lng': 16.33873091140511,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:35.753Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 91,
			'speed': '6.859021',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19872175628194,
			'lng': 16.338711894905614,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:36.741Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 91,
			'speed': '6.784000',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19878235570517,
			'lng': 16.33869231676851,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:37.755Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 92,
			'speed': '6.805266',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19884229831933,
			'lng': 16.33867295080707,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:38.737Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 91,
			'speed': '6.957949',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.198902086884814,
			'lng': 16.338653634592355,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:39.739Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 90,
			'speed': '6.794617',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19896166287508,
			'lng': 16.338634387033146,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:40.739Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 89,
			'speed': '6.784000',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19902050336007,
			'lng': 16.338615377076025,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:41.739Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 89,
			'speed': '6.700247',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19907680440993,
			'lng': 16.338597187529803,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:42.749Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 83,
			'speed': '6.347602',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19913,
			'lng': 16.33858,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:43.740Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 81,
			'speed': '6.149802',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19918369484489,
			'lng': 16.33855794698626,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:44.742Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 81,
			'speed': '6.184843',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19923857820718,
			'lng': 16.338535405812248,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:45.737Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 85,
			'speed': '6.366217',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19929422694454,
			'lng': 16.3385125502658,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:46.737Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 84,
			'speed': '6.422722',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19933884324991,
			'lng': 16.338494225844318,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:47.738Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 78,
			'speed': '5.144265',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19937841648117,
			'lng': 16.338477972657955,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:48.812Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 53,
			'speed': '4.256627',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.199423154651754,
			'lng': 16.338459598154795,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:49.742Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 71,
			'speed': '5.552123',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19947489956056,
			'lng': 16.33843834587864,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:50.742Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 75,
			'speed': '5.972160',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19953010911379,
			'lng': 16.33841567060552,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:51.739Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 83,
			'speed': '6.391207',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19958582404278,
			'lng': 16.33839278774325,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:52.755Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 83,
			'speed': '6.329096',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19962928753062,
			'lng': 16.33837493669578,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:53.745Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': 70,
			'speed': '5.072150',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19966486393145,
			'lng': 16.33836032497252,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:54.738Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': -1,
			'speed': '4.135010',
			'est': true,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19969,
			'lng': 16.33835,
			'time': {
				'_isAMomentObject': true,
				'_isUTC': false,
				'_pf': {
					'empty': false,
					'unusedTokens': [],
					'unusedInput': [],
					'overflow': -2,
					'charsLeftOver': 0,
					'nullInput': false,
					'invalidMonth': null,
					'invalidFormat': false,
					'userInvalidated': false,
					'iso': false,
					'parsedDateParts': [],
					'meridiem': null,
					'rfc2822': false,
					'weekdayMismatch': false
				},
				'_locale': {
					'$ref': '$["points"][0]["time"]["_locale"]'
				},
				'_d': '2019-02-28T18:40:55.750Z',
				'_isValid': true
			},
			'hr': -1,
			'cadence': -1,
			'speed': '2.961637',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		}
	],
	'rTrailPopped': [
		{
			'lat': 48.19813,
			'lng': 16.33811,
			'time': '2019-02-28T18:40:21.739Z',
			'hr': -1,
			'cadence': 83,
			'speed': '6.375565',
			'est': false
		},
		{
			'lat': 48.19824,
			'lng': 16.33805,
			'time': '2019-02-28T18:40:23.740Z',
			'hr': -1,
			'cadence': 88,
			'speed': '6.720991',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19826,
			'lng': 16.33806,
			'time': '2019-02-28T18:40:24.740Z',
			'hr': -1,
			'cadence': 89,
			'speed': '6.805266',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.1983,
			'lng': 16.33816,
			'time': '2019-02-28T18:40:25.740Z',
			'hr': -1,
			'cadence': 89,
			'speed': '6.741863',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19848,
			'lng': 16.33879,
			'time': '2019-02-28T18:40:32.737Z',
			'hr': -1,
			'cadence': 91,
			'speed': '7.048312',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19913,
			'lng': 16.33858,
			'time': '2019-02-28T18:40:43.740Z',
			'hr': -1,
			'cadence': 81,
			'speed': '6.149802',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		},
		{
			'lat': 48.19969,
			'lng': 16.33835,
			'time': '2019-02-28T18:40:55.750Z',
			'hr': -1,
			'cadence': -1,
			'speed': '2.961637',
			'est': false,
			'goal': {
				'lengthType': 'minutes',
				'value': 70,
				'type': 'cadence'
			}
		}
	],
	'user': {
		'hr': false,
		'cadence': true,
		'speed': true,
		'circumference': 2.12,
		'units': 'miles',
		'layout': [
			[
				{
					'col': '1',
					'row': '4',
					'name': 'rideInfo',
					'title': 'Ride Info',
					'size_x': '1',
					'size_y': '1'
				},
				{
					'col': '5',
					'row': '4',
					'name': 'customChart',
					'type': 'gauge',
					'param': 'cadence',
					'title': 'Cad',
					'listen': 'cadenceUpdated',
					'size_x': '1',
					'size_y': '1'
				},
				{
					'col': '6',
					'row': '4',
					'name': 'customChart',
					'type': 'gauge',
					'param': 'hr',
					'title': 'HR',
					'listen': 'hrUpdated',
					'size_x': '1',
					'size_y': '1'
				},
				{
					'col': '1',
					'row': '1',
					'name': 'map',
					'title': 'Map',
					'size_x': '2',
					'size_y': '2'
				},
				{
					'col': '5',
					'row': '1',
					'name': 'customChart',
					'type': 'line',
					'param': 'speed',
					'title': 'Speed',
					'listen': 'speedUpdated',
					'size_x': '2',
					'size_y': '3'
				},
				{
					'col': '4',
					'row': '1',
					'name': 'customChart',
					'type': 'gauge',
					'param': 'speed',
					'title': 'Speed',
					'listen': 'speedUpdated',
					'size_x': '1',
					'size_y': '1'
				}
			]
		],
		'url': 'http://127.0.0.1:3001',
		'modes': 5,
		'id': 8
	},
	'athlete': {
		'id': 19566555,
		'username': 'spencer_mize',
		'resource_state': 2,
		'firstname': 'Spencer',
		'lastname': 'Mize',
		'city': '',
		'state': '',
		'country': null,
		'sex': 'M',
		'premium': false,
		'summit': false,
		'created_at': '2017-01-25T03:07:52Z',
		'updated_at': '2018-08-29T00:53:59Z',
		'badge_type_id': 0,
		'profile_medium': 'https://lh4.googleusercontent.com/-6nJ93zHuYEE/AAAAAAAAAAI/AAAAAAAALL8/vY8zT7LcUHg/photo.jpg',
		'profile': 'https://lh4.googleusercontent.com/-6nJ93zHuYEE/AAAAAAAAAAI/AAAAAAAALL8/vY8zT7LcUHg/photo.jpg',
		'friend': null,
		'follower': null
	},
	'photos': '',
	'poller': {},
	'SettingsPane': {},
	'Goals': {
		'workoutTemplates': [
			{
				'id': 12,
				'title': 'Bike Mountain v3',
				'data': [
					{
						'type': 'speed',
						'value': '21.7',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '26.6',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '31.8',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '26.6',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '21.7',
						'length': '5230.355',
						'lengthType': 'distance'
					}
				],
				'length': 16,
				'type': 'speed',
				'lengthType': 'distance',
				'public': false,
				'createdAt': '2019-02-08T16:44:43.000Z',
				'updatedAt': '2019-02-08T16:44:43.000Z',
				'UserId': 8,
				'spark': [
					[
						20,
						68.23899371069182
					],
					[
						20,
						83.64779874213836
					],
					[
						20,
						100
					],
					[
						20,
						83.64779874213836
					],
					[
						20,
						68.23899371069182
					]
				]
			},
			{
				'id': 13,
				'title': 'Bike Valley v2',
				'data': [
					{
						'type': 'speed',
						'value': '22.3',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '22.3',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '16.5',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '16.5',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '22.3',
						'length': '5230.355',
						'lengthType': 'distance'
					}
				],
				'length': 16,
				'type': 'speed',
				'lengthType': 'distance',
				'public': false,
				'createdAt': '2019-02-08T16:51:39.000Z',
				'updatedAt': '2019-02-08T16:51:40.000Z',
				'UserId': 8,
				'spark': [
					[
						20,
						100
					],
					[
						20,
						100
					],
					[
						20,
						73.99103139013454
					],
					[
						20,
						73.99103139013454
					],
					[
						20,
						100
					]
				]
			},
			{
				'id': 17,
				'title': 'attr',
				'data': [
					{
						'type': 'speed',
						'value': '6.2',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '11.9',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '11.9',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '6.2',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '11.9',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '11.9',
						'length': '5230.355',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '6.2',
						'length': '5230.355',
						'lengthType': 'distance'
					}
				],
				'length': 23,
				'type': 'speed',
				'lengthType': 'distance',
				'public': false,
				'createdAt': '2019-02-08T18:10:50.000Z',
				'updatedAt': '2019-02-08T18:10:50.000Z',
				'UserId': 8,
				'spark': [
					[
						14.285714285714285,
						52.10084033613446
					],
					[
						14.285714285714285,
						100
					],
					[
						14.285714285714285,
						100
					],
					[
						14.285714285714285,
						52.10084033613446
					],
					[
						14.285714285714285,
						100
					],
					[
						14.285714285714285,
						100
					],
					[
						14.285714285714285,
						52.10084033613446
					]
				]
			},
			{
				'id': 19,
				'title': 'Quick Valley',
				'data': [
					{
						'type': 'speed',
						'value': '15.1',
						'length': '4',
						'lengthType': 'minutes'
					},
					{
						'type': 'speed',
						'value': '8.4',
						'length': '4',
						'lengthType': 'minutes'
					},
					{
						'type': 'speed',
						'value': '8.4',
						'length': '4',
						'lengthType': 'minutes'
					},
					{
						'type': 'speed',
						'value': '15.1',
						'length': '4',
						'lengthType': 'minutes'
					}
				],
				'length': 16,
				'type': 'speed',
				'lengthType': 'minutes',
				'public': false,
				'createdAt': '2019-02-20T15:38:01.000Z',
				'updatedAt': '2019-02-20T15:38:01.000Z',
				'UserId': 8,
				'spark': [
					[
						25,
						100
					],
					[
						25,
						55.629139072847686
					],
					[
						25,
						55.629139072847686
					],
					[
						25,
						100
					]
				]
			},
			{
				'id': 23,
				'title': '40 Mile Pacer',
				'data': [
					{
						'type': 'speed',
						'value': '15.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '16.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '17.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '18.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '17.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '16.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '17.0',
						'length': '8046.7',
						'lengthType': 'distance'
					},
					{
						'type': 'speed',
						'value': '15.0',
						'length': '8046.7',
						'lengthType': 'distance'
					}
				],
				'length': 40,
				'type': 'speed',
				'lengthType': 'distance',
				'public': false,
				'createdAt': '2019-02-21T19:46:29.000Z',
				'updatedAt': '2019-02-21T19:46:29.000Z',
				'UserId': 8,
				'spark': [
					[
						12.500000000000004,
						83.33333333333334
					],
					[
						12.500000000000004,
						88.88888888888889
					],
					[
						12.500000000000004,
						94.44444444444444
					],
					[
						12.500000000000004,
						100
					],
					[
						12.500000000000004,
						94.44444444444444
					],
					[
						12.500000000000004,
						88.88888888888889
					],
					[
						12.500000000000004,
						94.44444444444444
					],
					[
						12.500000000000004,
						83.33333333333334
					]
				]
			},
			{
				'id': 24,
				'title': 'Quick cadences',
				'data': [
					{
						'type': 'cadence',
						'value': '70',
						'length': '4',
						'lengthType': 'minutes',
						'x': 0,
						'y': 70
					},
					{
						'type': 'cadence',
						'value': '90',
						'length': '2',
						'lengthType': 'minutes',
						'x': 240,
						'y': 90
					},
					{
						'type': 'cadence',
						'value': '80',
						'length': '2',
						'lengthType': 'minutes',
						'x': 360,
						'y': 80
					},
					{
						'type': 'cadence',
						'value': '90',
						'length': '2',
						'lengthType': 'minutes',
						'x': 480,
						'y': 90
					},
					{
						'type': 'cadence',
						'value': '100',
						'length': '2',
						'lengthType': 'minutes',
						'x': 600,
						'y': 100
					},
					{
						'type': 'cadence',
						'value': '90',
						'length': '2',
						'lengthType': 'minutes',
						'x': 720,
						'y': 90
					},
					{
						'type': 'cadence',
						'value': '80',
						'length': '2',
						'lengthType': 'minutes',
						'x': 840,
						'y': 80
					},
					{
						'type': 'cadence',
						'value': '70',
						'length': '4',
						'lengthType': 'minutes',
						'x': 960,
						'y': 70
					}
				],
				'length': 20,
				'type': 'cadence',
				'lengthType': 'minutes',
				'public': false,
				'createdAt': '2019-02-22T13:56:55.000Z',
				'updatedAt': '2019-02-22T13:56:55.000Z',
				'UserId': 8,
				'spark': [
					[
						20,
						70
					],
					[
						10,
						90
					],
					[
						10,
						80
					],
					[
						10,
						90
					],
					[
						10,
						100
					],
					[
						10,
						90
					],
					[
						10,
						80
					],
					[
						20,
						70
					]
				]
			}
		],
		'workout': {
			'$ref': '$["Goals"]["workoutTemplates"][5]'
		}
	},
	'poll': 503,
	'photoRefresher': 289
};
