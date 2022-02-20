import { validateStates, parseDefault, detectFunction } from '../adapters';
const clone = require('rfdc')();

export default 'MQTT';
export const namespace = 'mqtt';

export const deviceObjectType = 'channel';
export const devicePattern = '((?!info).)*';

/*
 * State Mapping
 */
const STATE_MAPPING = {
	
	// lights
	"light": {
		"dimmer": {
			"state": ".Dimmer",
			"action": ".Dimmer"
		},
		"ct": {
			"state": ".CT",
			"action": ".CT",
			"properties": {
				"min": 153,
				"max": 500
			}
		},
		"hue": {
			"state": ".Hue",
			"action": ".Hue"
		},
		"sat": {
			"state": ".Saturation",
			"action": ".Saturation"
		}
	},
	
	// other
	"other": {
		"version": [ ".Version", ".INFO.Version" ],
		"reachability": ".alive",
		"ip": ".INFO.IPAddress",
		"signal": ".Wifi_Signal",
		
		"dataReceived": ".RfReceived_Data",
		
		"power": {
			"state": ".POWER",
			"action": ".POWER"
		},
		"powerCurrent": {
			"state": ".ENERGY_Current",
			"unit": " A"
		},
		"powerMeter": {
			"state": ".ENERGY_Power",
			"unit": " W"
		},
		"powerConsumption": {
			"state": ".ENERGY_Total",
			"unit": " kWh"
		},
		"powerConsumptionToday": {
			"state": ".ENERGY_Today",
			"unit": " kWh"
		},
		"powerConsumptionYesterday": {
			"state": ".ENERGY_Yesterday",
			"unit": " kWh"
		},
		
		"power1": {
			"state": ".POWER1",
			"action": ".POWER1"
		},
		"power2": {
			"state": ".POWER2",
			"action": ".POWER2"
		},
		"power3": {
			"state": ".POWER3",
			"action": ".POWER3"
		},
		"power4": {
			"state": ".POWER4",
			"action": ".POWER4"
		},
		"power5": {
			"state": ".POWER5",
			"action": ".POWER5"
		},
		"power6": {
			"state": ".POWER6",
			"action": ".POWER6"
		},
		"power7": {
			"state": ".POWER7",
			"action": ".POWER7"
		},
		"power8": {
			"state": ".POWER8",
			"action": ".POWER8"
		},
		"power9": {
			"state": ".POWER9",
			"action": ".POWER9"
		}
	}
}

/**
 *
 *
 */
export function parse(deviceStructure, options) {
	return new Promise(resolve => {
		let device = {
			'name': deviceStructure.objects[deviceStructure.root].common.name,
			'function': 'other',
			'states': {
				...clone(STATE_MAPPING.other),
				...clone(STATE_MAPPING.light)
			}
		}
		
		// validate states
		device.states = validateStates(device.states, deviceStructure);
		
		// nothing left, so read it all
		if (device.states.power === undefined && device.states.dimmer === undefined) {
			parseDefault(deviceStructure, options, device).then(resolve);
		}
		else {
			// detect function
			device = detectFunction(device);
			
			// resolve
			resolve(device);
		}
	});
}
