import Cache from 'src/controllers/Cache'
import Connection from 'src/controllers/Connection'

export default 'Das Wetter'
export const namespace = 'daswetter'

/**
 *
 *
 */
export function root(objects, options) {
	const socket = Connection.getConnection;
	
	return new Promise((resolve, reject) => {
		socket.getObject('system.adapter.daswetter.0').then(obj => {
			const url = obj && obj.native && (obj.native.Days5Forecast || obj.native.Days7Forecast || obj.native.HourlyForecast || obj.native.HourlyForecastJSON);
			
			if (url) {
				const params = url.substr(url.indexOf('?') + 1).split('&');
				
				const c = {}
				params.forEach(param => {
					const [ attr, value ] = param.split('=');
					c[attr] = value;
				});
				
				Cache.set('daswetter', c);
			}
		})
		.catch(() => {})
		.finally(() => {
			// reject
			reject();
		});
	});
}
