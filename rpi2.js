import { v5 as uuid } from 'uuid';

export default 'rpi2';
export const namespace = 'rpi2';

export const deviceObjectType = 'state';

/**
 *
 *
 */
export function root(objects, options) {
	return new Promise(resolve => {
		const stateList = Object.values(objects).map(state => state.id);
		
		const devices = {};
		for (let instance = 0; instance < 99; instance++) {
			// verify that instance exists
			if (stateList.indexOf(namespace + '.' + instance + '.cpu.load1') === -1) {
				break;
			}
			
			// device
			devices[namespace + '.' + instance] = devices[namespace + '.' + instance] || {
				'id': (namespace + '.' + instance).toLowerCase().replace(/ /g, '') + '_' + uuid(namespace + '.' + instance, '4eaf6392-6a70-4802-b343-5ff1a1673f39').substr(0, 5),
				'name': namespace + '.' + instance,
				'function': 'server',
				'states': {}
			}
			
			// add states
			stateList.forEach(state => {
				const stateKey = state.replace(namespace + '.' + instance + '.', '').replace(/\./g, '-');
				devices[namespace + '.' + instance].states[stateKey] = {
					"state": state
				}
			});
		}
		
		resolve(Object.values(devices));
	});
}
