import { v5 as uuid } from 'uuid'
import { detectFunction, detectStateElements } from '../adapters'

export default 'knx'
export const namespace = 'knx'
export const deviceObjectType = 'state'

/**
 *
 * @see https://github.com/Zefau/ioBroker.jarvis/issues/231
 */
export function root(objects, options) {
	return new Promise(resolve => {
		const devices = [];
		
		for (const objectId in objects) {
			const obj = objects[objectId];
			
			if (objectId.indexOf('.info.connection') > -1) {
				continue;
			}
			
			const name = objectId.replace('knx.', '').substr(2).replace(/\./g, ' - ').replace(/_/g, ' ');
			let device = {
				'id': obj.common.name.toLowerCase().replace(/ /g, '') + '_' + uuid(objectId, '4eaf6392-6a70-4802-b343-5ff1a1673f39').substr(0, 5),
				name,
				'function': 'other',
				'states': {
					[obj.native.address]: detectStateElements(objectId, { 'objects': objects })
				}
			}
			
			device = detectFunction(device);
			devices.push(device);
		}
		
		resolve(devices);
	});
}
