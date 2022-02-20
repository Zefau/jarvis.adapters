import { v5 as uuid } from 'uuid';

import { validateStates } from '../adapters';
const clone = require('rfdc')();

export default 'UniFi';
export const namespace = 'unifi';
export const deviceObjectType = 'state';

/*
 * State Mapping
 */
const STATE_MAPPING = {
	
	// health channel
	"health": {
		"lan.lan_ip": {
			"state": ".lan.lan_ip"
		},
		"lan.num_guest": {
			"state": ".lan.num_guest"
		},
		"lan.num_iot": {
			"state": ".lan.num_iot"
		},
		"lan.num_user": {
			"state": ".lan.num_user"
		},
		"lan.rx_bytes": {
			"state": ".lan.rx_bytes-r"
		},
		"lan.status": {
			"state": ".lan.status"
		},
		"lan.subsystem": {
			"state": ".lan.subsystem"
		},
		"lan.tx_bytes": {
			"state": ".lan.tx_bytes-r"
		},
		"vpn.status": {
			"state": ".vpn.status"
		},
		"vpn.subsystem": {
			"state": ".vpn.subsystem"
		},
		"wan.wan_ip": {
			"state": ".wan.wan_ip"
		},
		"wan.rx_bytes": {
			"state": ".wan.rx_bytes-r"
		},
		"wan.status": {
			"state": ".wan.status"
		},
		"wan.subsystem": {
			"state": ".wan.subsystem"
		},
		"wan.tx_bytes": {
			"state": ".wan.tx_bytes-r"
		},
		"wlan.num_guest": {
			"state": ".wlan.num_guest"
		},
		"wlan.num_iot": {
			"state": ".wlan.num_iot"
		},
		"wlan.num_user": {
			"state": ".wlan.num_user"
		},
		"wlan.rx_bytes": {
			"state": ".wlan.rx_bytes-r"
		},
		"wlan.status": {
			"state": ".wlan.status"
		},
		"wlan.subsystem": {
			"state": ".wlan.subsystem"
		},
		"wlan.tx_bytes": {
			"state": ".wlan.tx_bytes-r"
		},
		
		"www.latency": {
			"state": ".www.latency"
		},
		"www.rx_bytes": {
			"state": ".www.rx_bytes-r"
		},
		"www.status": {
			"state": ".www.status"
		},
		"www.subsystem": {
			"state": ".www.subsystem"
		},
		"www.tx_bytes": {
			"state": ".www.tx_bytes-r"
		},
		"www.uptime": {
			"state": ".www.uptime"
		},
		"www.xput_down": {
			"state": ".www.xput_down"
		},
		"www.xput_up": {
			"state": ".www.xput_up"
		},
		"www.speedtest.lastrun": {
			"state": ".www.speedtest.lastrun"
		},
		"www.speedtest.ping": {
			"state": ".www.speedtest.ping"
		},
		"www.speedtest.status": {
			"state": ".www.speedtest.status"
		}
	},
	
	// sysinfo channel
	"sysinfo": {
		"update_available": {
			"state": ".update_available"
		},
		"version": {
			"state": ".version"
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
			if (stateList.indexOf(namespace + '.' + instance + '.info.connection') === -1) {
				break;
			}
			
			// device
			devices[namespace + '.' + instance] = devices[namespace + '.' + instance] || {
				'id': (namespace + '.' + instance).toLowerCase().replace(/ /g, '') + '_' + uuid(namespace + '.' + instance, '4eaf6392-6a70-4802-b343-5ff1a1673f39').substr(0, 5),
				'name': namespace + '.' + instance,
				'function': 'other',
				'states': {}
			}
			
			// loop states
			for (const folder in STATE_MAPPING) {
				for (const stateKey in STATE_MAPPING[folder]) {
					const s = clone(STATE_MAPPING[folder][stateKey]);
					
					if (stateList.indexOf(namespace + '.' + instance + '.default.' + folder + s.state) > -1) {
						s.state = '.default.' + folder + s.state;
						devices[namespace + '.' + instance].states[folder + '-' + stateKey] = s;
					}
				}
			}
			
			// add devices and clients tree as dedicated devices
			for (const state of stateList) {
				[ 'devices', 'clients' ].forEach(key => {
					if (state.indexOf(namespace + '.' + instance + '.default.' + key + '.') > -1) {
						const devicePath = state.replace(namespace + '.' + instance + '.default.' + key + '.', '');
						let deviceName = devicePath.substr(0, devicePath.indexOf('.'));
						const obj = objects[namespace + '.' + instance + '.default.' + key + '.' + deviceName];
						deviceName = (obj && obj.common && obj.common.name) || deviceName;
						
						const deviceId = deviceName.toLowerCase().replace(/ /g, '');
						const stateKey = devicePath.substr(devicePath.indexOf('.') + 1);
						
						if (deviceName) {
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
				});
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
