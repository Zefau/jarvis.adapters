import { validateStates, detectFunction, getRoom } from '../adapters';
import _rfdc from 'rfdc/default';

export default 'Shelly';
export const namespace = 'shelly';

export const deviceObjectType = 'device';

export const BlindLevelActivity = {
	"open": true,
	"close": true,
	"stop": false
}

/*
 * State Mapping
 */
const STATE_MAPPING = {

	// socket
	"socket": {
		"power": {
			"state": ".Relay0.Switch",
			"action": ".Relay0.Switch",
			"actionElement": "SwitchAction"
		},
		"powerCounter": {
			"state": ".Relay0.Energy",
			"unit": " Wh"
		},
		"powerMeter": {
			"state": ".Relay0.Power",
			"unit": " W"
		}
	},

	// blinds
	"blind": {
		"level": {
			"state": ".Shutter.Position",
			"action": ".Shutter.Position"
		},
		"activity": {
			"state": ".Shutter.state"
		},
		"stop": {
			"action": ".Shutter.Pause"
		}
	},

	// lights
	"light": {
		"power": [{
			"state": ".lights.Switch",
			"action": ".lights.Switch",
			"actionElement": "SwitchAction"
		}, {
			"state": ".white0.Switch",
			"action": ".white0.Switch",
			"actionElement": "SwitchAction"
		}],
		"powerCh1": {
			"state": ".white1.Switch",
			"action": ".white1.Switch",
			"actionElement": "SwitchAction"
		},
		"powerCh2": {
			"state": ".white2.Switch",
			"action": ".white2.Switch",
			"actionElement": "SwitchAction"
		},
		"powerCh3": {
			"state": ".white3.Switch",
			"action": ".white3.Switch",
			"actionElement": "SwitchAction"
		},
		"colorTemperature": {
			"state": ".lights.white",
			"action": ".lights.white",
			"actionElement": "LevelBody",
			"properties": {
				"min": 0,
				"max": 100
			}
		},
		"level": [{
			"state": ".lights.brightness",
			"action": ".lights.brightness"
		}, {
			"state": ".white0.brightness",
			"action": ".white0.brightness"
		}],
		"levelCh1": {
			"state": ".white1.brightness",
			"action": ".white1.brightness"
		},
		"levelCh2": {
			"state": ".white2.brightness",
			"action": ".white2.brightness"
		},
		"levelCh3": {
			"state": ".white3.brightness",
			"action": ".white3.brightness"
		},
		"hex": {
			"state": ".lights.rgbw",
			"action": ".lights.rgbw"
		},
		"hue": {
			"state": ".lights.hue",
			"action": ".lights.hue"
		},
		"powerMeter": [{
			"state": ".Relay0.Power",
			"unit": " W"
		}, {
			"state": ".lights.Power",
			"unit": " W"
		}, {
			"state": ".white0.Power",
			"unit": " W"
		}, {
			"state": ".Emeter0.Power",
			"unit": " W"
		}],
		"powerMeterCh1": [{
			"state": ".Relay1.Power",
			"unit": " W"
		}, {
			"state": ".white1.Power",
			"unit": " W"
		}, {
			"state": ".Emeter1.Power",
			"unit": " W"
		}],
		"powerMeterCh2": [{
			"state": ".Relay2.Power",
			"unit": " W"
		}, {
			"state": ".white2.Power",
			"unit": " W"
		}, {
			"state": ".Emeter2.Power",
			"unit": " W"
		}],
		"powerMeterCh3": [{
			"state": ".Relay3.Power",
			"unit": " W"
		}, {
			"state": ".white3.Power",
			"unit": " W"
		}],
		"powerCounter": [{
			"state": ".Relay0.Energy",
			"unit": " Wh"
		}, {
			"state": ".lights.Energy",
			"unit": " Wh"
		}, {
			"state": ".white0.Energy",
			"unit": " Wh"
		}, {
			"state": ".Emeter0.Total",
			"unit": " Wh"
		}],
		"powerCounterCh1": [{
			"state": ".Relay1.Energy",
			"unit": " Wh"
		}, {
			"state": ".white1.Energy",
			"unit": " Wh"
		}, {
			"state": ".Emeter1.Total",
			"unit": " Wh"
		}],
		"powerCounterCh2": [{
			"state": ".Relay2.Energy",
			"unit": " Wh"
		}, {
			"state": ".white2.Energy",
			"unit": " Wh"
		}, {
			"state": ".Emeter2.Total",
			"unit": " Wh"
		}],
		"powerCounterCh3": [{
			"state": ".Relay3.Energy",
			"unit": " Wh"
		}, {
			"state": ".white3.Energy",
			"unit": " Wh"
		}],
		"powerCurrent": {
			"state": ".Emeter0.Current",
			"unit": " A"
		},
		"powerCurrentCh1": {
			"state": ".Emeter1.Current",
			"unit": " A"
		},
		"powerCurrentCh2": {
			"state": ".Emeter2.Current",
			"unit": " A"
		},
		"powerVoltage": {
			"state": ".Emeter0.Voltage",
			"unit": " V"
		},
		"powerVoltageCh1": {
			"state": ".Emeter1.Voltage",
			"unit": " V"
		},
		"powerVoltageCh2": {
			"state": ".Emeter2.Voltage",
			"unit": " V"
		},
		"powerCounterReturned": {
			"state": ".Emeter0.Total_Returned",
			"unit": " Wh"
		},
		"powerCounterReturnedCh1": {
			"state": ".Emeter1.Total_Returned",
			"unit": " Wh"
		},
		"powerCounterReturnedCh2": {
			"state": ".Emeter2.Total_Returned",
			"unit": " Wh"
		},
		"powerTotalCurrent": {
			"state": ".Total.Current",
			"unit": " A"
		},
		"powerTotalConsumed": {
			"state": ".Total.ConsumedPower",
			"unit": " Wh"
		},
		"powerTotalInstant": {
			"state": ".Total.InstantPower",
			"unit": " W"
		},
		"powerTotalVoltage": {
			"state": ".Total.Voltage",
			"unit": " V"
		},
		"powerTotalVoltageMean": {
			"state": ".Total.VoltageMean",
			"unit": " V"
		}
	},
	
	// switch
	"switch": {
		"input": {
			"state": ".Relay0.Input"
		},
		"inputCh2": {
			"state": ".Relay1.Input"
		},
		"inputCh3": {
			"state": ".Relay2.Input"
		},
		"event": {
			"state": ".Relay0.Event"
		},
		"eventCh2": {
			"state": ".Relay1.Event"
		},
		"eventCh3": {
			"state": ".Relay2.Event"
		},
		"eventCount": {
			"state": ".Relay0.EventCount"
		},
		"eventCountCh2": {
			"state": ".Relay1.EventCount"
		},
		"eventCountCh3": {
			"state": ".Relay2.EventCount"
		}
	},
	
	// sensor
	"sensor": {
		"battery": [{
			"state": ".sensor.battery"
		}, {
			"state": ".bat.value"
		}],
		"humidity": {
			"state": ".hum.value"
		},
		"flood": {
			"state": ".sensor.flood"
		},
		"door": {
			"state": ".sensor.door"
		},
		"illumination": {
			"state": ".sensor.lux"
		},
		"tilt": {
			"state": ".sensor.tilt"
		},
		"vibration": {
			"state": ".sensor.vibration"
		},
		"temperature": [{
			"state": ".sensor.temperatureC"
		}, {
			"state": ".tmp.temperatureC"
		}]
	}
}

const buttonType = {
	'momentary': 'momentary',
	'toggle': 'toggle',
	'edge': 'edge',
	'detached': 'detached',
	'action': 'action',
	'cycle': 'cycle',
	'momentary_on_release': 'momentary_on_release'
}

const inputMode = {
	"momentary": "momentary",
	"follow": "follow",
	"flip": "flip",
	"detached": "detached"
}

const initialState = {
	"on": "on",
	"off": "off",
	"restore_last": "restore_last",
	"match_input": "match_input"
}

/**
 *
 *
 */
export function parse(deviceStructure, options) {
	return new Promise(resolve => {
		const name = deviceStructure.states[deviceStructure.root + '.name'] && deviceStructure.states[deviceStructure.root + '.name'].val;
		
		let device = {
			'name': name || deviceStructure.objects[deviceStructure.root].common.name,
			'function': 'socket',
			'room': getRoom(deviceStructure),
			'states': {
				..._rfdc(STATE_MAPPING.socket),
				'firmware': {
					'state': '.firmware',
					'action': '.firmwareupdate',
					'actionElement': 'IconButtonAction'
				},
				'ip': '.hostname',
				'temperature': '.temperatureC',
				'version': '.version',
				'reachability': '.online',
				'cloudEnabled': '.Cloud.enabled',
				'apEnabled': '.WiFi.apEnabled',
				
				'buttonTypeRelay0': {
					'state': '.Relay0.ButtonType',
					'action': '.Relay0.ButtonType',
					'actionElement': 'DropdownAction',
					'display': buttonType
				},
				'buttonTypeRelay1': {
					'state': '.Relay1.ButtonType',
					'action': '.Relay1.ButtonType',
					'actionElement': 'DropdownAction',
					'display': buttonType
				},
				
				'initialStateRelay0': {
					'state': '.Relay0.InitialState',
					'action': '.Relay0.InitialState',
					'actionElement': 'DropdownAction',
					'display': initialState
				},
				'initialStateRelay1': {
					'state': '.Relay1.InitialState',
					'action': '.Relay1.InitialState',
					'actionElement': 'DropdownAction',
					'display': initialState
				},
				'inputModeRelay0': {
					'state': '.Relay0.InputMode',
					'action': '.Relay0.InputMode',
					'actionElement': 'DropdownAction',
					'display': inputMode
				},
				'inputModeRelay1': {
					'state': '.Relay1.InputMode',
					'action': '.Relay1.InputMode',
					'actionElement': 'DropdownAction',
					'display': inputMode
				}
			}
		}
		
		// Shelly 1, Shelly 1 L, Shelly 1 PM, Shelly Plug, Shelly Plug S
		if (deviceStructure.root.indexOf('SHSW-1') > -1 || deviceStructure.root.indexOf('SHSW-L') > -1 || deviceStructure.root.indexOf('SHSW-PM') > -1 || deviceStructure.root.indexOf('SHPLG') > -1 || deviceStructure.root.indexOf('SHPLG2') > -1) {
			device.states = {
				...device.states
			}
		}
		
		// Shelly i3
		else if (deviceStructure.root.indexOf('SHIX3-') > -1) {
			device.states = {
				..._rfdc(STATE_MAPPING.switch),
				...device.states
			}
		}
		
		// Shelly 2
		else if (deviceStructure.root.indexOf('SHSW-2') > -1) {
			// Shutter mode
			if ((deviceStructure.states[deviceStructure.root + '.Sys.deviceMode'] && deviceStructure.states[deviceStructure.root + '.Sys.deviceMode'].val === 'roller') || (deviceStructure.states[deviceStructure.root + '.mode'] && deviceStructure.states[deviceStructure.root + '.mode'].val === 'roller')) {
				delete device.states.power;
				delete device.states.buttonTypeRelay0;
				delete device.states.buttonTypeRelay1;
				delete device.states.initialStaateRelay0;
				delete device.states.initialStaateRelay1;
				delete device.states.inputModeRelay0;
				delete device.states.inputModeRelay1;
				
				device.function = 'blind';
				device.states = {
					..._rfdc(STATE_MAPPING.blind),
					...device.states,
					'buttonType': {
						'state': '.Shutter.ButtonType',
						'action': '.Shutter.ButtonType',
						'actionElement': 'DropdownAction',
						'display': buttonType
					}
				}
			}
			
			// Relay mode
			else {
				device.states = {
					...device.states,
					'Relay0': {
						'state': '.Relay0.Switch',
						'action': '.Relay0.Switch',
						'actionElement': 'SwitchAction'
					},
					'Relay1': {
						'state': '.Relay1.Switch',
						'action': '.Relay1.Switch',
						'actionElement': 'SwitchAction'
					}
				}
			}
		}
		
		// Shelly Dimmer, Shelly RGBW, Shelly Bulb Duo,
		else if (deviceStructure.root.indexOf('SHDM-') > -1 || deviceStructure.root.indexOf('SHRGBW') > -1 || deviceStructure.root.indexOf('SHBDUO') > -1) {
			device.function = 'light';
			device.states = {
				...device.states,
				..._rfdc(STATE_MAPPING.light)
			}
		}
		
		// Shelly Flood (SHWT), Shelly DW, Shelly H&T
		else if (deviceStructure.root.indexOf('SHWT-') > -1 || deviceStructure.root.indexOf('SHDW-') > -1 || deviceStructure.root.indexOf('SHHT-') > -1) {
			device.function = deviceStructure.root.indexOf('SHDW-') > -1 ? 'door' : 'sensor';
			device.states = {
				...device.states,
				..._rfdc(STATE_MAPPING.sensor)
			}
		}
		
		// validate states
		device.states = validateStates(device.states, deviceStructure);
		
		// detect function
		device = detectFunction(device);
		
		// resolve
		resolve(device);
	});
}
