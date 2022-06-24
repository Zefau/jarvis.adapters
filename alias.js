import { validateStates } from '../adapters';
import { locale } from 'src/boot/i18n';

export default 'Alias Devices';
export const namespace = 'alias';

export const deviceObjectType = 'channel';

/**
 *
 */
export function parse(deviceStructure, options) {
	return new Promise((resolve, reject) => {
		const obj = deviceStructure.objects[deviceStructure.root];
		
		if (!obj || !obj.common) {
			return reject(new Error('Alias structure incorrect. Could not load role from %state'));
		}
		
		const device = {
			'name': obj.common.name[locale] || obj.common.name || '',
			'function': 'other',
			'states': {
				'unreach': '.UNREACH',
				'lowBattery': '.LOWBAT'
			}
		}
		
		// convert alias structure to jarvis
		const role = obj && obj.common ? obj.common.role : '';
		
		// LIGHT - SWITCH
		if ([ 'light' ].indexOf(role) > -1) {
			device.function = 'light';
			device.states = {
				'power': {
					'state': '.SET',
					'action': '.SET'
				},
				...device.states
			}
		}
		
		// LIGHT - DIMMER
		else if ([ 'dimmer' ].indexOf(role) > -1) { // 'rgb' not supported
			device.function = 'light';
			device.states = {
				'level': {
					'state': '.ACTUAL',
					'action': '.SET'
				},
				...device.states
			}
		}
		
		// LIGHT - COLOR
		else if ([ 'rgbSingle', 'ct', 'hue' ].indexOf(role) > -1) { // 'rgb' not supported
			device.function = 'light';
			device.states = {
				'power': {
					'state': '.ON',
					'action': '.ON'
				},
				'level': {
					'state': '.DIMMER',
					'action': '.DIMMER'
				},
				'colorTemperature': {
					'state': '.TEMPERATURE',
					'action': '.TEMPERATURE'
				},
				'hue': {
					'state': '.HUE',
					'action': '.HUE'
				},
				'rgb': {
					'state': '.RGB',
					'action': '.RGB'
				},
				...device.states
			}
		}
		
		// BLIND
		else if ([ 'blind' ].indexOf(role) > -1) {
			device.function = 'blind';
			device.states = {
				'level': {
					'state': '.SET',
					'action': '.SET'
				},
				'activity': {
					'state': '.WORKING',
					'action': '.STOP'
				},
				...device.states
			}
		}
		
		// WINDOW
		else if ([ 'window' ].indexOf(role) > -1) {
			device.function = 'window';
			device.states = {
				'open': {
					'state': '.ACTUAL'
				},
				...device.states
			}
		}
		
		// DOOR
		else if ([ 'door' ].indexOf(role) > -1) {
			device.function = 'door';
			device.states = {
				'open': {
					'state': '.ACTUAL'
				},
				...device.states
			}
		}
		
		// THERMOSTAT / TEMPERATURE
		else if ([ 'temperature', 'thermostat' ].indexOf(role) > -1) {
			device.function = 'heating';
			device.states = {
				'temperature': {
					'state': '.ACTUAL'
				},
				'setTemperature': {
					'state': '.SET',
					'action': '.SET'
				},
				'humidity': {
					'state': '.HUMIDITY',
					'action': '.HUMIDITY'
				},
				'boost': {
					'state': '.BOOST',
					'action': '.BOOST'
				},
				...device.states
			}
		}
		
		// adapt all states
		deviceStructure.list.forEach(state => {
			device.states = {
				...device.states,
				[state.substring(state.lastIndexOf('.') + 1)]: state.replace(deviceStructure.root, '')
			}
		});
		
		// validate states
		device.states = validateStates(device.states, deviceStructure);
		
		// resolve
		resolve(device);
	});
}
