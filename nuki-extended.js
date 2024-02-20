import { validateStates, getRoom } from '../adapters';
import _rfdc from 'rfdc/default';

export default 'nuki-extended';
export const namespace = 'nuki-extended';

export const deviceObjectType = 'channel';
export const devicePattern = '(openers|smartlocks)+\\.([^.]+\\w+)';

/*
 * State Mapping
 */
const STATE_MAPPING = {
	
	// opener
	"openers": {
		"door": {
			"state": ".state.doorState"
		},
		"ring": {
			"state": ".state.ringState"
		},
		"ringUpdate": {
			"state": ".state.ringStateUpdate"
		},
		"state": {
			"state": ".state.lockState",
			"display": {
				"0": "UNTRAINED",
				"1": "ONLINE",
				"3": "RING_TO_OPEN",
				"5": "OPEN",
				"7": "OPENING",
				"253": "BOOT_RUN",
				"255": "UNDEFINED"
			}
		},
		"lowbattery": {
			"state": ".state.batteryCritical"
		},
		"ACTIONS": {
			"action": "._ACTION",
			"display": {
				"0": "NO_ACTION",
				"1": "ACTIVE RTO",
				"2": "DEACTIVATE RTO",
				"3": "ELECTRIC STRIKE ACTUATION",
				"4": "ACTIVATE CM",
				"5": "DEACTIVATE CM"
			},
			"actionElement": "DropdownAction"
		},
		"ACTIVATE_CM": {
			"action": "._ACTION.ACTIVATE_CM",
			"actionElement": "IconButtonAction"
		},
		"ACTIVE_RTO": {
			"action": "._ACTION.ACTIVE_RTO",
			"actionElement": "IconButtonAction"
		},
		"DEACTIVATE_CM": {
			"action": "._ACTION.DEACTIVATE_CM",
			"actionElement": "IconButtonAction"
		},
		"DEACTIVATE_RTO": {
			"action": "._ACTION.DEACTIVATE_RTO",
			"actionElement": "IconButtonAction"
		},
		"ELECTRIC_STRIKE_ACTUATION": {
			"action": "._ACTION.ELECTRIC_STRIKE_ACTUATION",
			"actionElement": "IconButtonAction"
		}
	},
	
	// smartlock
	"smartlocks": {
		"door": {
			"state": ".state.closed"
		},
		"doorState": {
			"state": ".state.doorState",
			"display": {
				"0": "UNAVAILABLE",
				"1": "DEACTIVATED",
				"2": "DOOR_CLOSED",
				"3": "DOOR_OPENED",
				"4": "DOOR_STATE_UNKNOWN",
				"5": "CALIBRATING"
			}
		},
		"lock": {
			"state": ".state.locked"
		},
		"lockState": {
			"state": ".state.lockState",
			"display": {
				"0": "UNCALIBRATED",
				"1": "LOCKED",
				"2": "UNLOCKING",
				"3": "UNLOCKED",
				"4": "LOCKING",
				"5": "UNLATCHED",
				"6": "UNLOCKED_LOCK_N_GO",
				"7": "UNLATCHING",
				"254": "MOTOR_BLOCKED",
				"255": "UNDEFINED"
			}
		},
		"lockUpdate": {
			"state": ".state.lastStateUpdate"
		},
		"lowbattery": {
			"state": ".state.batteryCritical"
		},
		"ACTIONS": {
			"action": "._ACTION",
			"display": {
				"0": "NO_ACTION",
				"1": "UNLOCK",
				"2": "LOCK",
				"3": "UNLATCH",
				"4": "LOCK_N_GO",
				"5": "LOCK_N_GO_WITH_UNLATCH"
			},
			"actionElement": "DropdownAction"
		},
		"LOCK": {
			"action": "._ACTION.LOCK",
			"actionElement": "IconButtonAction"
		},
		"LOCK_N_GO": {
			"action": "._ACTION.LOCK_N_GO",
			"actionElement": "IconButtonAction"
		},
		"LOCK_N_GO_WITH_UNLATCH": {
			"action": "._ACTION.LOCK_N_GO_WITH_UNLATCH",
			"actionElement": "IconButtonAction"
		},
		"UNLATCH": {
			"action": "._ACTION.UNLATCH",
			"actionElement": "IconButtonAction"
		},
		"UNLOCK": {
			"action": "._ACTION.UNLOCK",
			"actionElement": "IconButtonAction"
		}
	}
}

/**
 *
 *
 */
export function parse(deviceStructure, options) {
	return new Promise((resolve, reject) => {
		const type = deviceStructure.states[deviceStructure.root + '.type'];
		
		if (type) {
			const name = deviceStructure.states[deviceStructure.root + '.name'];
			const device = {
				'name': (name && name.val) || deviceStructure.root,
				'function': 'door',
				'room': getRoom(deviceStructure),
				'states': _rfdc(STATE_MAPPING[type.val === 0 ? 'smartlocks' : 'openers'])
			}
			
			// validate states
			device.states = validateStates(device.states, deviceStructure);
			
			// resolve
			return resolve(device);
		}
		
		return reject(new Error('Nuki has no type'));
	});
}
