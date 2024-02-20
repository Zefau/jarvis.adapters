import { v5 as uuid } from 'uuid';
import _rfdc from 'rfdc/default';

import Connection from 'src/controllers/Connection';
import { validateStates, getRoom } from '../adapters';

import { allSettled } from 'src/helpers/utils';

export default 'mihome-vacuum';
export const namespace = 'mihome-vacuum';
export const deviceObjectType = 'state';

/*
 * State Mapping
 * @see https://github.com/Zefau/ioBroker.jarvis/issues/231
 */
const STATE_MAPPING = {
	"consumableFilter": {
		"state": ".consumable.filter",
		"action": ".consumable.filter_reset",
		"actionElement": "IconButtonAction"
	},
	"consumableBrushMain": {
		"state": ".consumable.main_brush",
		"action": ".consumable.main_brush_reset",
		"actionElement": "IconButtonAction"
	},
	"consumableBrushSide": {
		"state": ".consumable.side_brush",
		"action": ".consumable.side_brush_reset",
		"actionElement": "IconButtonAction"
	},
	"consumableSensors": {
		"state": ".consumable.sensors",
		"action": ".consumable.sensors_reset",
		"actionElement": "IconButtonAction"
	},
	"consumableFilterWater": {
		"state": ".consumable.water_filter",
		"action": ".consumable.water_filter_reset",
		"actionElement": "IconButtonAction"
	},
	"controlSoundVolume": {
		"state": ".control.sound_volume",
		"action": ".control.sound_volume",
		"actionElement": "InputAction"
	},
	"controlModeCarpet": {
		"action": ".control.carpet_mode",
		"actionElement": "IconButtonAction"
	},
	"controlFind": {
		"action": ".control.find",
		"actionElement": "IconButtonAction"
	},
	"controlHome": {
		"action": ".control.home",
		"actionElement": "IconButtonAction"
	},
	"controlPause": {
		"action": ".control.pause",
		"actionElement": "IconButtonAction"
	},
	"cleanRoomResume": {
		"action": ".control.resumeRoomClean",
		"actionElement": "IconButtonAction"
	},
	"cleanZoneResume": {
		"action": ".control.resumeZoneClean",
		"actionElement": "IconButtonAction"
	},
	"cleanSpot": {
		"action": ".control.spotclean",
		"actionElement": "IconButtonAction"
	},
	"cleanZone": {
		"action": ".control.zoneClean",
		"actionElement": "InputAction"
	},
	"clean": {
		"action": ".control.clean",
		"actionElement": "IconButtonAction"
	},
	"controlFan": {
		"state": ".control.fan_power",
		"action": ".control.fan_power",
		"display": {
			"101": "QUIET",
			"102": "BALANCED",
			"103": "TURBO",
			"104": "MAXIMUM",
			"105": "MOP",
			"106": "CUSTOM"
		}
	},
	"historyTableJson": {
		"state": ".history.allTableJSON"
	},
	"cleanedTotalArea": {
		"state": ".history.total_area"
	},
	"cleanedTotalCleanups": {
		"state": ".history.total_cleanups"
	},
	"cleanedTotalTime": {
		"state": ".history.total_time"
	},
	"cleanedMissionArea": {
		"state": ".info.cleanedarea"
	},
	"cleanedMissionTime": {
		"state": ".info.cleanedtime"
	},
	"battery": {
		"state": ".info.battery"
	},
	"doNotDisturb": {
		"state": ".info.dnd"
	},
	"error": {
		"state": ".info.error"
	},
	"timer": {
		"state": ".info.nextTimer"
	},
	"state": {
		"state": ".info.state"
	},
	"waterBox": {
		"state": ".info.water_box"
	},
	"map": {
		"state": ".cleanmap.map64",
		"action": ".cleanmap.loadMap"
	},
	"cleanQueue": {
		"state": ".info.queue",
		"action": ".control.clearQueue"
	},
	"firmware": {
		"state": ".deviceInfo.fw_ver"
	},
	"mac": {
		"state": ".deviceInfo.mac"
	},
	"model": {
		"state": ".deviceInfo.model"
	},
	"wifi_signal": {
		"state": ".deviceInfo.wifi_signal"
	}
}

/**
 *
 *
 */
export function root(objects, options) {
	return new Promise(resolve => {
		const socket = Connection.getConnection;
		const stateList = Object.keys(objects);
		
		const promises = [];
		for (let instance = 0; instance < 99; instance++) {
			// verify that instance exists
			if (stateList.indexOf(namespace + '.' + instance + '.deviceInfo.model') === -1) {
				break;
			}
			
			// get device model
			promises.push(new Promise((resolve, reject) => {
				socket.getState(namespace + '.' + instance + '.deviceInfo.model')
					.then(state => {
						const device = {
							'id': (state && state.val.toLowerCase().replace(/ /g, '')) + '_' + uuid(namespace + '.' + instance, '4eaf6392-6a70-4802-b343-5ff1a1673f39').substr(0, 5),
							'name': (state && state.val),
							'function': 'vacuum',
							'room': getRoom(deviceStructure),
							'states': _rfdc(STATE_MAPPING)
						}
						
						// add rooms to states
						const roomList = stateList.filter(state => state.startsWith(namespace + '.' + instance + '.rooms') && (state.endsWith('roomClean') || state.endsWith('state')));
						const rooms = {}
						
						roomList.forEach(room => {
							const [ roomId ] = room.replace(namespace + '.' + instance + '.rooms.', '').split('.');
							
							rooms[roomId] = {
								...rooms[roomId] || {},
								[room.indexOf('.state') > -1 ? 'state' : 'action']: room.replace(namespace + '.' + instance, '')
							}
						});
						
						device.states = {
							...device.states,
							...rooms
						}
						
						// validate states
						device.states = validateStates(device.states, { 'objects': objects, 'list': stateList, 'root': namespace + '.' + instance });
						
						// add device
						resolve(device);
					})
					.catch(error => {
						console.error(error);
						reject(error);
					});
			}));
		}
		
		//
		allSettled(promises).then(result => {
			const devices = [];
			result.forEach(res => res.status === 'fulfilled' && devices.push(res.value));
			resolve(devices);
		});
	});
}
