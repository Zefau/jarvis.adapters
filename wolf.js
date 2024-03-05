import { validateStates, parseDefault } from '../adapters';
import _rfdc from 'rfdc/default';

export default 'WOLF (ISM8i)';
export const namespace = 'wolf';

export const deviceObjectType = 'channel';

/**
 *
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
