import { v5 as uuid } from 'uuid';
import _rfdc from 'rfdc/default';

import { validateStates, getRoom } from '../adapters';

export default 'tr-064';
export const namespace = 'tr-064';
export const deviceObjectType = 'state';

/*
 * State Mapping
 */
const STATE_MAPPING = {
	
	// calllists
	"calllists": {
		"allCount": {
			"state": ".all.count"
		},
		"allHTML": {
			"state": ".all.html"
		},
		"allJson": {
			"state": ".all.json"
		},
		"inboundCount": {
			"state": ".inbound.count"
		},
		"inboundHTML": {
			"state": ".inbound.html"
		},
		"inboundJson": {
			"state": ".inbound.json"
		},
		"missedCount": {
			"state": ".missed.count"
		},
		"missedHTML": {
			"state": ".missed.html"
		},
		"missedJson": {
			"state": ".missed.json"
		},
		"outboundCount": {
			"state": ".outbound.count"
		},
		"outboundHTML": {
			"state": ".outbound.html"
		},
		"outboundJson": {
			"state": ".outbound.json"
		}
	},
	
	// phonebook
	"phonebook": {
		"image": {
			"state": ".image"
		},
		"name": {
			"state": ".name"
		},
		"number": {
			"state": ".number"
		}
	},
	
	// devices
	/*
	"devices": {
		"active": {
			"state": ".active"
		},
		"lastActive": {
			"state": ".lastActive"
		},
		"lastActive-ts": {
			"state": ".lastActive-ts"
		},
		"lastIP": {
			"state": ".lastIP"
		},
		"lastInactive": {
			"state": ".lastInactive"
		},
		"lastInactive": {
			"state": ".lastInactive"
		},
		"lastMAC-address": {
			"state": ".lastMAC-address"
		}
	},
	*/
	
	// states
	"states": {
		"ab": {
			"state": ".ab"
		},
		"ip": {
			"state": ".externalIP"
		},
		"ipv6": {
			"state": ".externalIPv6"
		},
		"reboot": {
			"action": ".reboot",
			"actionElement": "IconButtonAction"
		},
		"reconnect": {
			"action": ".reconnectInternet",
			"actionElement": "IconButtonAction"
		},
		"wlan24": {
			"state": ".wlan24"
		},
		"wlan50": {
			"state": ".wlan50"
		}
	}
}

/**
 *
 *
 */
export function root(objects, options) {
	return new Promise(resolve => {
		const stateList = Object.keys(objects);
		
		const devices = {};
		for (let instance = 0; instance < 99; instance++) {
			// verify that instance exists
			if (stateList.indexOf(namespace + '.' + instance + '.states.externalIP') === -1) {
				break;
			}
			
			// loop channels
			for (const key in STATE_MAPPING) {
				devices[key + '.' + instance] = devices[key + '.' + instance] || {
					'id': (namespace + '.' + instance + '-' + key).toLowerCase().replace(/ /g, '') + '_' + uuid(namespace + '.' + instance, '4eaf6392-6a70-4802-b343-5ff1a1673f39').substr(0, 5),
					'name': namespace + '.' + instance + ' ' + key,
					'function': 'other',
					'room': '',
					'states': {}
				}
				
				// loop assigned state keys
				for (const stateKey in STATE_MAPPING[key]) {
					const s = _rfdc(STATE_MAPPING[key][stateKey]);
					
					// add general states to device
					if (stateList.indexOf(namespace + '.' + instance + '.' + key + s.state) > -1 || stateList.indexOf(namespace + '.' + instance + '.' + key + s.action) > -1) {
						s.state = s.state && ('.' + key + s.state);
						s.action = s.action && ('.' + key + s.action);
						
						devices[key + '.' + instance].states[stateKey] = s;
						devices[key + '.' + instance].room = getRoom(namespace + '.' + instance + '.' + key + s.state);
					}
				}
			}
			
			// add devices tree as dedicated device
			for (const state of stateList) {
				if (state.indexOf(namespace + '.' + instance + '.devices.') > -1) {
					let deviceName = state.replace(namespace + '.' + instance + '.devices.', '')
					deviceName = deviceName.substr(0, deviceName.indexOf('.'));
					const deviceId = deviceName.toLowerCase().replace(/ /g, '');
					const stateKey = state.substr(state.lastIndexOf('.') + 1);
					
					if (deviceName && stateKey !== 'lastActive-ts' && stateKey !== 'lastInactive-ts') {
						devices[deviceId + '.' + instance] = devices[deviceId + '.' + instance] || {
							'id': deviceId + '_' + uuid(namespace + '.' + instance, '4eaf6392-6a70-4802-b343-5ff1a1673f39').substr(0, 5),
							'name': deviceName,
							'function': 'other',
							'states': {}
						}
						
						devices[deviceId + '.' + instance].states = {
							...devices[deviceId + '.' + instance].states,
							[stateKey]: state.replace(namespace + '.' + instance, '')
						}
					}
				}
			}
		}
		
		// validate states
		for (const key in devices) {
			const [ , instance ] = key.split('.');
			devices[key].states = validateStates(devices[key].states, { 'objects': objects, 'list': stateList, 'root': namespace + '.' + instance });
		}
		
		resolve(Object.values(devices));
	});
}
