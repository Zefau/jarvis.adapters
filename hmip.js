import { validateStates, parseDefault } from '../adapters';
import _rfdc from 'rfdc/default';

export default 'HomeMatic IP via Access Point'
export const namespace = 'hmip'

export const deviceObjectType = 'device';
export const devicePattern = 'devices\\.(.*)';

/*
 * State Mapping
 */
const STATE_MAPPING = {
/*
	// lights
	"light": {
		"hmip-brc2": {
			"power": {
				"state": ".3.STATE",
				"action": ".4.STATE"
			}
		},
		"hmip-bdt": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".4.LEVEL"
			}
		},
		"hm-lc-sw1pbu-fm": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			}
		}
	},
*/
	// heatings
	"heating": {
		"HmIP-STH": {
			"temperature": {
				"state": ".channels.1.actualTemperature"
			},
			"humidity": {
				"state": ".channels.1.humidity"
			},
			"setTemperature": {
				"state": ".channels.1.setPointTemperature",
				"action": ".channels.1.setPointTemperature"
			}
		},
		"HmIP-eTRV-B": {
			"temperature": {
				"state": ".channels.1.valveActualTemperature"
			},
			"setTemperature": {
				"state": ".channels.1.setPointTemperature",
				"action": ".channels.1.setPointTemperature"
			},
			"valvePosition": {
				"state": ".channels.1.valvePosition"
			},
			"valveState": {
				"state": ".channels.1.valveState"
			}
		},
		"HmIP-eTRV-2": {
			"temperature": {
				"state": ".channels.1.valveActualTemperature"
			},
			"setTemperature": {
				"state": ".channels.1.setPointTemperature",
				"action": ".channels.1.setPointTemperature"
			}
		},
		/*
		"hmip-bwth": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},*/
		"HmIP-WTH-2": {
			"temperature": {
				"state": ".channels.1.actualTemperature"
			},
			"humidity": {
				"state": ".channels.1.humidity"
			},
			"setTemperature": {
				"state": ".channels.1.setPointTemperature",
				"action": ".channels.1.setPointTemperature"
			},
			"vapor": {
				"state": ".channels.1.vaporAmount"
			}
		}//,
		/*
		"hm-cc-rt-dn": {
			"temperature": {
				"state": ".4.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".4.SET_TEMPERATURE",
				"action": ".4.SET_TEMPERATURE"
			},
			"boost": {
				"state": ".4.BOOST_MODE",
				"action": ".4.BOOST_MODE"
			}
		}
		*/
	},
	
	// blinds
	"blind": {
		"HmIP-BBL": {
			"level": {
				"state": ".channels.1.shutterLevel",
				"action": ".channels.1.shutterLevel"
			},
			"activity": {
				"state": ".channels.1.processing"
			},
			"stop": {
				"action": ".channels.1.stop"
			}
		},
		"HmIP-BROLL": {
			"level": {
				"state": ".channels.1.shutterLevel",
				"action": ".channels.1.shutterLevel",
				"actionElement": "BlindLevelAction",
				"BlindLevelActionConfig": {
					"step": "0,1"
				},
				"properties": {
					"min": "1",
					"max": "0"
				},
				"icon": {
					"default": "window-shutter-open",
					"<0.2": "window-shutter-open",
					">=0.8": "window-shutter"
				},
				"bodyElement": "LevelBody",
				"showState": false
			},
			"activity": {
				"state": ".channels.1.processing"
			},
			"stop": {
				"action": ".channels.1.stop",
				"actionElement": "IconButtonAction"
			}
		}
/*,
		"hm-lc-bl1-fm": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"activity": {
				"state": ".1.WORKING",
				"action": ".1.STOP"
			}
		},
		"hm-lc-bl1pbu-fm": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"activity": {
				"state": ".1.WORKING",
				"action": ".1.STOP"
			}
		}
*/
	},
	
	// windows
	"window": {
		"HmIP-SWDO": {
			"open": {
				"state": ".channels.1.windowOpen"
			}
		},
		"HmIP-SWDO-I": {
			"open": {
				"state": ".channels.1.windowOpen"
			}
		},
		"HmIP-SRH": {
			"open": {
				"state": ".channels.1.windowOpen"
			},
			"state": {
				"state": ".channels.1.windowState",
				"display": {
					"CLOSED": "window#open#closed",
					"TILTED": "window#open#tilted",
					"OPEN": "window#open#opened"
				}
			}
		}//,
		/*
		"hm-sec-sco": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"hm-sec-sc-2": {
			"open": {
				"state": ".1.STATE"
			}
		}
		*/
	},
	
	// sockets
	"socket": {
		"HmIP-PS": {
			"power": {
				"state": ".channels.1.on",
				"action": ".channels.1.on"
			}
		}//,
		/*
		"hmip-psm": {
			"power": {
				"state": ".3.STATE"
			},
			"meter": {
				"state": ".6.POWER"
			}
		}
		*/
	},
	
	// motions or presence
	"motion": {
		/*
		"hmip-smi55": {
			"motion": {
				"state": ".3.MOTION"
			},
			"illumination": {
				"state": ".3.ILLUMINATION"
			}
		},
		*/
		"HmIP-SMI": {
			"motion": {
				"state": ".channels.1.motionDetected"
			},
			"illumination": {
				"state": ".channels.1.illumination"
			}
		}
		/*,
		"hmip-smo-a": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		},
		"hmip-sam": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		},
		"hmip-spi": {
			"presence": {
				"state": ".1.PRESENCE_DETECTION_STATE"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		}
		*/
	},

	// weather station
	"weather-station": {
		"HmIP-STHO": {
			"temperature": {
				"state": ".channels.1.actualTemperature"
			},
			"humidity": {
				"state": ".channels.1.humidity"
			},
			"vapor": {
				"state": ".channels.1.vaporAmount"
			},
			"display": {
				"state": ".channels.1.display"
			}
		},
		"HmIP-STHO-A": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			}
		},
		"HmIP-SWO-B": {
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"wind": {
				"state": ".1.WIND_SPEED"
			},
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			},
			"sunshineduration": {
				"state": ".1.SUNSHINEDURATION"
			}
		}
	}//,
/*
	// other
	"other": {
		"hmip-wrc2": {
			"PRESS_LONG_BOTTOM": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT_BOTTOM": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_LONG_TOP": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT_TOP": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			}
		}
	}
*/
}

/**
 *
 *
 * @param	{Object}	deviceStructure
 * @param	{String}	deviceStructure.root		root state
 * @param	{Array}		deviceStructure.states		all states
 * @param	{Object}	deviceStructure.values		all states with its value
 * @return	{Object}	device
 */
export function parse(deviceStructure, options) {
	return new Promise(resolve => {
		const device = {
			'name': deviceStructure.objects[deviceStructure.root].common.name,
			'function': 'other',
			'states': {
				'unreach': {
					'state': '.channels.0.unreach'
				},
				'lowBattery': {
					'state': '.channels.0.lowBat'
				},
				'firmware': {
					'state': '.channels.info.firmwareVersion'
				}
			}
		}
		
		const modelType = deviceStructure.states[deviceStructure.root + '.info.modelType'] || null;
		let findDevice = -1;
		
		if (modelType && modelType.val) {
			// find pre-defined device type
			const deviceTypeList = {}
			const deviceTypeListLowerCase = {}
			
			const deviceType = modelType.val.toLowerCase();
			for (const func in STATE_MAPPING) {
				deviceTypeList[func] = deviceTypeList[func] || Object.keys(STATE_MAPPING[func]);
				deviceTypeListLowerCase[func] = deviceTypeListLowerCase[func] || deviceTypeList[func].map(key => key.toLowerCase());
				
				// search device
				findDevice = deviceTypeListLowerCase[func].indexOf(deviceType);
				
				if (findDevice > -1) {
					device.function = func;
					device.states = {
						...device.states,
						..._rfdc(STATE_MAPPING[func][deviceTypeList[func][findDevice]])
					}
					
					break;
				}
			}
			
			// validate states
			device.states = validateStates(device.states, deviceStructure);
		}
		
		// device not found, thus fallback to inherit all states
		if (findDevice === -1) {
			parseDefault(deviceStructure, options, device).then(resolve);
		}
		else {
			// resolve
			resolve(device);
		}
	});
}
