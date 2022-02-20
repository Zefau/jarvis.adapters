import { parseDefault } from '../adapters';

export default 'Deconz';
export const namespace = 'deconz';

export const deviceObjectType = 'device';
export const devicePattern = '(((Lights|Groups|Sensors)+\\.\\d*)|((lights|groups|sensors)+\\.\\w*\\d*))';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
