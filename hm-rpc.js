import { validateStates, detectStates, getRoom } from '../adapters'
import _rfdc from 'rfdc/default';

export default 'HomeMatic / HomeMatic IP via CCU'
export const namespace = 'hm-rpc'

export const deviceObjectType = 'device';

export const BlindLevelActivity = {
	"1": true,
	"2": true,
	"3": false
}

/*
 * State Mapping
 */
const STATE_MAPPING = {
	// lights
	"light": {
		"HM-LC-Dim1T-DR": {
			"rampTime": {
				"state": ".1.RAMP_TIME",
				"action": ".1.RAMP_TIME"
			},
			"rampStop": {
				"state": ".1.RAMP_STOP",
				"action": ".1.RAMP_STOP"
			},
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"levelReal": {
				"state": ".1.LEVEL_REAL",
				"action": ".1.LEVEL_REAL"
			},
			"levelOld": {
				"state": ".1.OLD_LEVEL",
				"action": ".1.OLD_LEVEL"
			}
			
		},
		"HmIP-RGBW": {
			"activity": {
				"state": ".1.ACTIVITY_STATE"
			},
			"colorTemperature": {
				"state": ".1.COLOR_TEMPERATURE",
				"action": ".1.COLOR_TEMPERATURE"
			},
			"colorTemperatureStatus": {
				"state": ".1.COLOR_TEMPERATURE_STATUS"
			},
			"dim2WarmState": {
				"state": ".1.DIM2WARM_STATE"
			},
			"durationUnit": {
				"state": ".1.DURATION_UNIT",
				"action": ".1.DURATION_UNIT"
			},
			"durationValue": {
				"state": ".1.DURATION_VALUE",
				"action": ".1.DURATION_VALUE"
			},
			"effect": {
				"state": ".1.EFFECT",
				"action": ".1.EFFECT"
			},
			"hue": {
				"state": ".1.HUE",
				"action": ".1.HUE"
			},
			"hueStatus": {
				"state": ".1.HUE_STATUS"
			},
			"HumanCentricLightState": {
				"state": ".1.HUMAN_CENTRIC_LIGHT_STATE"
			},
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"levelStatus": {
				"state": ".1.LEVEL_STATUS"
			},
			"process": {
				"state": ".1.PROCESS"
			},
			"rampTimeToOffUnit": {
				"state": ".1.RAMP_TIME_TO_OFF_UNIT",
				"action": ".1.RAMP_TIME_TO_OFF_UNIT"
			},
			"rampTimeToOffValue": {
				"state": ".1.RAMP_TIME_TO_OFF_VALUE",
				"action": ".1.RAMP_TIME_TO_OFF_VALUE"
			},
			"rampTimeUnit": {
				"state": ".1.RAMP_TIME_UNIT",
				"action": ".1.RAMP_TIME_UNIT"
			},
			"rampTimeValue": {
				"state": ".1.RAMP_TIME_VALUE",
				"action": ".1.RAMP_TIME_VALUE"
			},
			"saturation": {
				"state": ".1.SATURATION",
				"action": ".1.SATURATION"
			},
			"saturationStatus": {
				"state": ".1.SATURATION_STATUS"
			},
			"section": {
				"state": ".1.SECTION"
			},
			"sectionStatus": {
				"state": ".1.SECTION_STATUS"
			}
		},
		"HmIP-BSM": {
			"power": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"powerMeter": {
				"state": ".7.POWER"
			},
			"powerVoltage": {
				"state": ".7.VOLTAGE"
			},
			"powerFrequency": {
				"state": ".7.FREQUENCY"
			}
		},
		"HmIP-BSL": {
			"power": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"durationUnitTop": {
				"state": ".8.DURATION_UNIT",
				"action": ".8.DURATION_UNIT"
			},
			"durationValueTop": {
				"state": ".8.DURATION_VALUE",
				"action": ".8.DURATION_VALUE"
			},
			"rampTimeUnitTop": {
				"state": ".8.RAMP_TIME_UNIT",
				"action": ".8.RAMP_TIME_UNIT"
			},
			"rampTimeValueTop": {
				"state": ".8.RAMP_TIME_VALUE",
				"action": ".8.RAMP_TIME_VALUE"
			},
			"levelTop": {
				"state": ".8.LEVEL",
				"action": ".8.LEVEL"
			},
			"levelStatusTop": {
				"state": ".8.LEVEL_STATUS"
			},
			"colorTop": {
				"state": ".8.COLOR",
				"action": ".8.COLOR",
				"display": {
					"0": "BLACK",
					"1": "BLUE",
					"2": "GREEN",
					"3": "TURQUOISE",
					"4": "RED",
					"5": "PURPLE",
					"6": "YELLOW",
					"7": "WHITE"
				}
			},
			"colorStatusTop": {
				"state": ".8.COLOR_STATUS"
			},
			"durationUnitBottom": {
				"state": ".12.DURATION_UNIT",
				"action": ".12.DURATION_UNIT"
			},
			"durationValueBottom": {
				"state": ".12.DURATION_VALUE",
				"action": ".12.DURATION_VALUE"
			},
			"rampTimeUnitBottom": {
				"state": ".12.RAMP_TIME_UNIT",
				"action": ".12.RAMP_TIME_UNIT"
			},
			"rampTimeValueBottom": {
				"state": ".12.RAMP_TIME_VALUE",
				"action": ".12.RAMP_TIME_VALUE"
			},
			"levelBottom": {
				"state": ".12.LEVEL",
				"action": ".12.LEVEL"
			},
			"levelStatusBottom": {
				"state": ".12.LEVEL_STATUS"
			},
			"colorBottom": {
				"state": ".12.COLOR",
				"action": ".12.COLOR",
				"display": {
					"0": "BLACK",
					"1": "BLUE",
					"2": "GREEN",
					"3": "TURQUOISE",
					"4": "RED",
					"5": "PURPLE",
					"6": "YELLOW",
					"7": "WHITE"
				}
			},
			"colorStatusTop": {
				"state": ".12.COLOR_STATUS"
			}
		},
		"HmIP-BRC2": {
			"power": {
				"state": ".3.STATE",
				"action": ".4.STATE"
			}
		},
		"HmIP-BDT": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".4.LEVEL"
			}
		},
		"HmIP-PDT": {
			"level": {
				"state": ".2.LEVEL",
				"action": ".3.LEVEL"
			},
			"timerOff": {
				"state": ".3.ON_TIME",
				"action": ".3.ON_TIME",
				"unit": " s"
			},
			"timerOn": {
				"state": ".3.RAMP_TIME",
				"action": ".3.RAMP_TIME",
				"unit": " s"
			}
		},
		"HB-RC-2-PBU-LED": { // 2-fach Wandtaster, ähnlich dem HmIP-BSL, mit RGB LED Beleuchtung, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"brightnessCh1": {
				"state": ".4.ACT_BRIGHTNESS",
				"action": ".4.ACT_BRIGHTNESS"
			},
			"colorCh1": {
				"state": ".4.COLOR",
				"action": ".4.COLOR"
			},
			"levelCh1": {
				"state": ".3.LEVEL",
				"action": ".3.LEVEL"
			},
			"timerOffCh1": {
				"state": ".3.ON_TIME",
				"action": ".3.ON_TIME"
			},
			"timerOnCh1": {
				"state": ".3.RAMP_TIME",
				"action": ".3.RAMP_TIME"
			},
			"brightnessCh2": {
				"state": ".6.ACT_BRIGHTNESS",
				"action": ".6.ACT_BRIGHTNESS"
			},
			"colorCh2": {
				"state": ".6.COLOR",
				"action": ".6.COLOR"
			},
			"levelCh2": {
				"state": ".5.LEVEL",
				"action": ".5.LEVEL"
			},
			"timerOffCh2": {
				"state": ".5.ON_TIME",
				"action": ".5.ON_TIME"
			},
			"timerOnCh2": {
				"state": ".5.RAMP_TIME",
				"action": ".5.RAMP_TIME"
			}
		},
		"HB-RC-6-PBU-LED": { // 6fach (Wand)Taster mit RGB Status-LEDs, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"powerCh1": {
				"state": ".7.STATE",
				"action": ".7.STATE"
			},
			"timerCh1": {
				"state": ".7.ON_TIME",
				"action": ".7.ON_TIME"
			},
			"powerCh2": {
				"state": ".8.STATE",
				"action": ".8.STATE"
			},
			"timerCh2": {
				"state": ".8.ON_TIME",
				"action": ".8.ON_TIME"
			},
			"powerCh3": {
				"state": ".9.STATE",
				"action": ".9.STATE"
			},
			"timerCh3": {
				"state": ".9.ON_TIME",
				"action": ".9.ON_TIME"
			},
			"powerCh4": {
				"state": ".10.STATE",
				"action": ".10.STATE"
			},
			"timerCh4": {
				"state": ".10.ON_TIME",
				"action": ".10.ON_TIME"
			},
			"powerCh5": {
				"state": ".11.STATE",
				"action": ".11.STATE"
			},
			"timerCh5": {
				"state": ".11.ON_TIME",
				"action": ".11.ON_TIME"
			},
			"powerCh6": {
				"state": ".12.STATE",
				"action": ".12.STATE"
			},
			"timerCh6": {
				"state": ".12.ON_TIME",
				"action": ".12.ON_TIME"
			}
		},
		"HB-UNI-RGB-LED-CTRL": { // RGB Controller für adressierbare RGB LEDs, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"brightnessCh1": {
				"state": ".2.ACT_BRIGHTNESS",
				"action": ".2.ACT_BRIGHTNESS"
			},
			"colorCh1": {
				"state": ".2.COLOR",
				"action": ".2.COLOR"
			},
			"hsvCh1": {
				"state": ".2.ACT_HSV_COLOR_VALUE",
				"action": ".2.ACT_HSV_COLOR_VALUE"
			},
			"timerOffCh1": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME"
			},
			"timerOnCh1": {
				"state": ".2.RAMP_TIME",
				"action": ".2.RAMP_TIME"
			},
			"brightnessCh2": {
				"state": ".3.ACT_BRIGHTNESS",
				"action": ".3.ACT_BRIGHTNESS"
			},
			"colorCh2": {
				"state": ".3.COLOR",
				"action": ".3.COLOR"
			},
			"hsvCh2": {
				"state": ".3.ACT_HSV_COLOR_VALUE",
				"action": ".3.ACT_HSV_COLOR_VALUE"
			},
			"timerOffCh2": {
				"state": ".3.ON_TIME",
				"action": ".3.ON_TIME"
			},
			"timerOnCh2": {
				"state": ".3.RAMP_TIME",
				"action": ".3.RAMP_TIME"
			}
		},
		"HM-LC-Dim1T-FM": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"timerOn": {
				"state": ".1.RAMP_TIME",
				"action": ".1.RAMP_TIME"
			}
		},
		"HM-LC-RGBW-WM": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"timerOn": {
				"state": ".1.RAMP_TIME",
				"action": ".1.RAMP_TIME"
			},
			"hue": {
				"state": ".2.COLOR",
				"action": ".2.COLOR"
			}
		},
		"HM-LC-Sw1PBU-FM": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			}
		},
		"HM-LC-Sw1-FM": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"activity": {
				"state": ".1.WORKING",
				"action": ".1.WORKING"
			}
		},
		"HM-LC-Sw1-DR": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			}
		},
		"HM-LC-Sw2-FM": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"powerCh2": {
				"state": ".2.STATE",
				"action": ".2.STATE"
			},
			"timerOffCh2": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME"
			}
		},
		"HM-LC-Sw4-SM": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"powerCh2": {
				"state": ".2.STATE",
				"action": ".2.STATE"
			},
			"powerCh3": {
				"state": ".3.STATE",
				"action": ".3.STATE"
			},
			"powerCh4": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"timerOffCh2": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME"
			},
			"timerOffCh3": {
				"state": ".3.ON_TIME",
				"action": ".3.ON_TIME"
			},
			"timerOffCh4": {
				"state": ".4.ON_TIME",
				"action": ".4.ON_TIME"
			},
			"activity": {
				"state": ".1.WORKING",
				"action": ".1.WORKING"
			},
			"activityCh2": {
				"state": ".2.WORKING",
				"action": ".2.WORKING"
			},
			"activityCh3": {
				"state": ".3.WORKING",
				"action": ".3.WORKING"
			},
			"activityCh4": {
				"state": ".4.WORKING",
				"action": ".4.WORKING"
			}
		},
		"HM-LC-Sw4-PCB": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"powerCh2": {
				"state": ".2.STATE",
				"action": ".2.STATE"
			},
			"powerCh3": {
				"state": ".3.STATE",
				"action": ".3.STATE"
			},
			"powerCh4": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"timerOffCh2": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME"
			},
			"timerOffCh3": {
				"state": ".3.ON_TIME",
				"action": ".3.ON_TIME"
			},
			"timerOffCh4": {
				"state": ".4.ON_TIME",
				"action": ".4.ON_TIME"
			},
			"activity": {
				"state": ".1.WORKING",
				"action": ".1.WORKING"
			},
			"activityCh2": {
				"state": ".2.WORKING",
				"action": ".2.WORKING"
			},
			"activityCh3": {
				"state": ".3.WORKING",
				"action": ".3.WORKING"
			},
			"activityCh4": {
				"state": ".4.WORKING",
				"action": ".4.WORKING"
			}
		},
		"HM-LC-Sw4-DR": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"powerCh2": {
				"state": ".2.STATE",
				"action": ".2.STATE"
			},
			"timerOffCh2": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME"
			},
			"powerCh3": {
				"state": ".3.STATE",
				"action": ".3.STATE"
			},
			"timerOffCh3": {
				"state": ".3.ON_TIME",
				"action": ".3.ON_TIME"
			},
			"powerCh4": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"timerOffCh4": {
				"state": ".4.ON_TIME",
				"action": ".4.ON_TIME"
			}
		},
		"HM-LC-Dim1TPBU-FM": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			}
		},
		"HM-LC-Dim1T-Pl-3": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"timerOn": {
				"state": ".1.RAMP_TIME",
				"action": ".1.RAMP_TIME"
			}
		}
	},

	// heatings
	"heating": {
		"HmIP-STH": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-STHD": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV-B": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV-B1": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV-B-2 R4M": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV-C": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV-C-2": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV-E": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			}
		},
		"HmIP-eTRV": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			},
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"valve": {
				"state": ".1.VALVE_STATE",
				"action": ".1.VALVE_STATE"
			}
		},
		"HmIP-eTRV-2": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			},
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"valve": {
				"state": ".1.VALVE_STATE",
				"action": ".1.VALVE_STATE"
			}
		},
		"HmIP-eTRV-2 I9F": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"frost": {
				"state": ".1.FROST_PROTECTION"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			},
			"boostTime": {
				"state": ".1.BOOST_TIME",
				"action": ".1.BOOST_TIME"
			},
			"windowState": {
				"state": ".1.WINDOW_STATE"
			},
			"partyMode": {
				"state": ".1.PARTY_MODE",
				"action": ".1.PARTY_MODE"
			},
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"valve": {
				"state": ".1.VALVE_STATE",
				"action": ".1.VALVE_STATE"
			}
		},
		"HmIP-BWTH": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},
		"HmIP-WTH": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},
		"HmIP-WTH-1": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},
		"HmIP-WTH-2": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},
		"HmIP-WTH-B": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},
		"HmIP-WTH-B-2": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".1.SET_POINT_TEMPERATURE",
				"action": ".1.SET_POINT_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"boost": {
				"state": ".1.BOOST_MODE",
				"action": ".1.BOOST_MODE"
			}
		},
		"HM-CC-VD": {
			"valve": {
				"state": ".1.VALVE_STATE",
				"action": ".1.VALVE_STATE"
			}
		},
		"HM-CC-TC": {
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"lowBatteryAlarmReporting": {
				"state": ".0.LOWBAT_ALARM",
				"action": ".2.LOWBAT_RALARM"
			},
			"setTemperature": {
				"state": ".2.SETPOINT",
				"action": ".2.SETPOINT"
			}
		},
		"HM-CC-RT-DN": {
			"temperature": {
				"state": ".4.ACTUAL_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".4.SET_TEMPERATURE",
				"action": ".4.SET_TEMPERATURE"
			},
			"boost": {
				"state": ".4.BOOST_MODE",
				"action": ".4.BOOST_MODE"
			},
			"batteryState": {
				"state": ".4.BATTERY_STATE"
			},
			"partyTemperature": {
				"state": ".4.PARTY_TEMPERATURE"
			},
			"modeAuto": {
				"state": ".4.AUTO_MODE",
				"action": ".4.AUTO_MODE"
			},
			"modeManu": {
				"state": ".4.MANU_MODE",
				"action": ".4.MANU_MODE"
			},
			"boostState": {
				"state": ".4.BOOST_STATE",
				"action": ".4.BOOST_STATE"
			},
			"modeCurrent": {
				"state": ".4.COMFORT_MODE",
				"action": ".4.COMFORT_MODE"
			},
			"modeLowering": {
				"state": ".4.LOWERING_MODE",
				"action": ".4.LOWERING_MODE"
			},
			"modeControl": {
				"state": ".4.CONTROL_MODE",
				"action": ".4.CONTROL_MODE",
				"display": {
					"0": "Auto-Mode",
					"1": "Manu-Mode",
					"2": "Party-Mode",
					"3": "Boost-Mode"
				}
			},
			"valve": {
				"state": ".4.VALVE_STATE",
				"action": ".4.VALVE_STATE"
			}
		},
		"HM-TC-IT-WM-W-EU": {
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"actualHumidity": {
				"state": ".2.ACTUAL_HUMIDITY"
			},
			"actualTemperature": {
				"state": ".2.ACTUAL_TEMPERATURE"
			},
			"modeAuto": {
				"state": ".2.AUTO_MODE",
				"action": ".2.AUTO_MODE"
			},
			"batteryState": {
				"state": ".2.BATTERY_STATE"
			},
			"boost": {
				"state": ".2.BOOST_MODE",
				"action": ".2.BOOST_MODE"
			},
			"boostState": {
				"state": ".2.BOOST_STATE",
				"action": ".2.BOOST_STATE"
			},
			"modeControl": {
				"state": ".2.CONTROL_MODE",
				"action": ".2.CONTROL_MODE",
				"display": {
					"0": "Auto-Mode",
					"1": "Manu-Mode",
					"2": "Party-Mode",
					"3": "Boost-Mode"
				}
			},
			"modeCurrent": {
				"state": ".2.COMFORT_MODE",
				"action": ".2.COMFORT_MODE"
			},
			"lowBatteryAlarmReporting": {
				"state": ".2.LOWBAT_REPORTING",
				"action": ".2.LOWBAT_REPORTING"
			},
			"modeManu": {
				"state": ".2.MANU_MODE",
				"action": ".2.MANU_MODE"
			},
			"partyTemperature": {
				"state": ".2.PARTY_TEMPERATURE"
			},
			"setTemperature": {
				"state": ".2.SET_TEMPERATURE",
				"action": ".2.SET_TEMPERATURE"
			},
			"openWindow": {
				"state": ".2.WINDOW_OPEN_REPORTING",
				"action": ".2.WINDOW_OPEN_REPORTING"
			}
		},
		"HM-WDS40-TH-I": {
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			}
		},
		"HM-WDS10-TH-O": {
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			}
		},
		"HM-WDS30-OT2-SM": {
			"temperatureCh1": {
				"state": ".1.TEMPERATURE"
			},
			"lowBatteryCh1": {
				"state": ".1.LOWBAT"
			},
			"temperatureCh2": {
				"state": ".2.TEMPERATURE"
			},
			"lowBatteryCh2": {
				"state": ".2.LOWBAT"
			},
			"temperatureCh3": {
				"state": ".3.TEMPERATURE"
			},
			"lowBatteryCh3": {
				"state": ".3.LOWBAT"
			},
			"temperatureCh4": {
				"state": ".4.TEMPERATURE"
			},
			"lowBatteryCh4": {
				"state": ".4.LOWBAT"
			},
			"temperatureCh5": {
				"state": ".5.TEMPERATURE"
			},
			"lowBatteryCh5": {
				"state": ".5.LOWBAT"
			},
			"temperatureCh6": {
				"state": ".6.TEMPERATURE"
			},
			"lowBatteryCh6": {
				"state": ".6.LOWBAT"
			}
		}
	},

	// blinds
	"blind": {
		"HB-LC-Bl1PBU-FM": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"PRESS_CONT1": {
				"state": ".2.PRESS_CONT",
				"action": ".2.PRESS_CONT"
			},
			"PRESS_LONG1": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT1": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			},
			"PRESS_CONT2": {
				"state": ".3.PRESS_CONT",
				"action": ".3.PRESS_CONT"
			},
			"PRESS_LONG2": {
				"state": ".3.PRESS_LONG",
				"action": ".3.PRESS_LONG"
			},
			"PRESS_SHORT2": {
				"state": ".3.PRESS_SHORT",
				"action": ".3.PRESS_SHORT"
			}
		},
		"HmIP-BBL": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".4.LEVEL"
			},
			"level2": {
				"state": ".3.LEVEL2",
				"action": ".4.LEVEL2"
			},
			"activity": {
				"state": ".3.ACTIVITY_STATE"
			},
			"stop": {
				"action": ".4.STOP"
			}
		},
		"HmIP-FROLL": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".4.LEVEL"
			},
			"activity": {
				"state": ".3.ACTIVITY_STATE"
			},
			"stop": {
				"action": ".4.STOP"
			}
		},
		"HmIP-BROLL": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".4.LEVEL"
			},
			"level2": {
				"state": ".3.LEVEL2",
				"action": ".4.LEVEL2"
			},
			"activity": {
				"state": ".3.ACTIVITY_STATE"
			},
			"stop": {
				"action": ".4.STOP"
			}
		},
		"HmIP-BROLL-2": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".4.LEVEL"
			},
			"level2": {
				"state": ".3.LEVEL2",
				"action": ".4.LEVEL2"
			},
			"activity": {
				"state": ".3.ACTIVITY_STATE"
			},
			"stop": {
				"action": ".4.STOP"
			}
		},
		"HM-LC-Bl1-FM": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"activity": {
				"state": ".1.WORKING"
			},
			"stop": {
				"action": ".1.STOP"
			}
		},
		"HMW-LC-Bl1-DR": {
			"level": {
				"state": ".3.LEVEL",
				"action": ".3.LEVEL"
			},
			"activity": {
				"state": ".3.WORKING"
			},
			"stop": {
				"action": ".3.STOP"
			}
		},
		"HM-LC-Bl1PBU-FM": {
			"level": {
				"state": ".1.LEVEL",
				"action": ".1.LEVEL"
			},
			"activity": {
				"state": ".1.WORKING"
			},
			"stop": {
				"action": ".1.STOP"
			}
		},
		"HmIPW-DRBL4": {
			"levelCh1": {
				"state": ".2.LEVEL",
				"action": ".2.LEVEL"
			},
			"level2Ch1": {
				"state": ".2.LEVEL_2",
				"action": ".2.LEVEL_2"
			},
			"activityCh1": {
				"state": ".2.PROCESS"
			},
			"stopCh1": {
				"action": ".2.STOP"
			},
			"levelCh2": {
				"state": ".6.LEVEL",
				"action": ".6.LEVEL"
			},
			"level2Ch2": {
				"state": ".6.LEVEL_2",
				"action": ".6.LEVEL_2"
			},
			"activityCh2": {
				"state": ".6.PROCESS"
			},
			"stopCh2": {
				"action": ".6.STOP"
			},
			"levelCh3": {
				"state": ".10.LEVEL",
				"action": ".10.LEVEL"
			},
			"level2Ch3": {
				"state": ".10.LEVEL_2",
				"action": ".10.LEVEL_2"
			},
			"activityCh3": {
				"state": ".10.PROCESS"
			},
			"stopCh3": {
				"action": ".10.STOP"
			},
			"levelCh4": {
				"state": ".14.LEVEL",
				"action": ".14.LEVEL"
			},
			"level2Ch4": {
				"state": ".14.LEVEL_2",
				"action": ".14.LEVEL_2"
			},
			"activityCh4": {
				"state": ".14.PROCESS"
			},
			"stopCh4": {
				"action": ".14.STOP"
			}
		}
	},
	
	// sensor
	"sensor": {
		"HM-Sec-TiS": {
			"power": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SLO": {
			"illuminationAverage": {
				"state": ".1.AVERAGE_ILLUMINATION",
				"unit": " Lux"
			},
			"illuminationCurrent": {
				"state": ".1.CURRENT_ILLUMINATION",
				"unit": " Lux"
			},
			"illuminationHighest": {
				"state": ".1.HIGHEST_ILLUMINATION",
				"unit": " Lux"
			},
			"illuminationLowest": {
				"state": ".1.LOWEST_ILLUMINATION",
				"unit": " Lux"
			}
		},
		"HmIP-SWD": {
			"alarm": {
				"state": ".1.ALARMSTATE"
			},
			"alarmMoisture": {
				"state": ".1.MOISTURE_DETECTED"
			},
			"alarmWaterlevel": {
				"state": ".1.WATERLEVEL_DETECTED"
			}
		},
		"HM-Sec-WDS-2": {
			"alarm": {
				"state": ".1.STATE"
			}
		}
	},
	
	// smoke
	"smoke": {
		"HmIP-SWSD": {
			"alarm": {
				"state": ".1.SMOKE_DETECTOR_ALARM_STATUS",
				"display": {
					"0": "IDLE_OFF",
					"1": "PRIMARY_ALARM",
					"2": "INTRUSION_ALARM",
					"3": "SECONDARY_ALARM"
				}
			}
		},
		"HM-Sec-SD": {
			"alarm": {
				"state": ".1.STATE"
			},
			"lowBatteryCh1": {
				"state": ".1.LOWBAT"
			}
		},
		"HM-Sec-SD-2": {
			"alarm": {
				"state": ".1.STATE"
			},
			"lowBatteryCh1": {
				"state": ".1.LOWBAT"
			}
		},
		"HM-Sec-SD-2-Team": {
			"alarm": {
				"state": ".1.STATE"
			}
		}
	},
	
	// windows
	"window": {
		"HmIP-SWDM": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SWDM-2": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SWDM-B2": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SWDO-I": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SWDO-PL": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SWDO": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SWDO-2": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HmIP-SRH": {
			"open": {
				"state": ".1.STATE",
				"display": {
					"0": "window#open#closed",
					"1": "window#open#tilted",
					"2": "window#open#opened"
				}
			}
		},
		"HM-Sec-RHS": {
			"open": {
				"state": ".1.STATE",
				"display": {
					"0": "window#open#closed",
					"1": "window#open#tilted",
					"2": "window#open#opened"
				}
			}
		},
		"HM-Sec-Sco": {
			"open": {
				"state": ".1.STATE"
			}
		},
		"HM-Sec-SC-2": {
			"open": {
				"state": ".1.STATE"
			}
		}
	},
	
	// sockets
	"socket": {
		"HmIP-FSM": {
			"power": {
				"state": ".1.STATE",
				"action": ".2.STATE"
			},
			"timerOff": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME",
				"unit": " s"
			},
			"powerCurrent": {
				"state": ".5.CURRENT",
				"unit": " mA"
			},
			"powerFrequency": {
				"state": ".5.FREQUENCY",
				"unit": " Hz"
			},
			"powerCounter": {
				"state": ".5.ENERGY_COUNTER",
				"unit": " Wh"
			},
			"powerMeter": {
				"state": ".5.POWER",
				"unit": " Wh"
			},
			"powerVoltage": {
				"state": ".5.VOLTAGE",
				"unit": " V"
			}
		},
		"HmIP-FSM16": {
			"power": {
				"state": ".1.STATE",
				"action": ".2.STATE"
			},
			"timerOff": {
				"state": ".2.ON_TIME",
				"action": ".2.ON_TIME",
				"unit": " s"
			},
			"powerCurrent": {
				"state": ".5.CURRENT",
				"unit": " mA"
			},
			"powerFrequency": {
				"state": ".5.FREQUENCY",
				"unit": " Hz"
			},
			"powerCounter": {
				"state": ".5.ENERGY_COUNTER",
				"unit": " Wh"
			},
			"powerMeter": {
				"state": ".5.POWER",
				"unit": " Wh"
			},
			"powerVoltage": {
				"state": ".5.VOLTAGE",
				"unit": " V"
			}
		},
		"HmIP-PS": {
			"power": {
				"state": ".3.STATE"
			}
		},
		"HmIP-PS-2": {
			"power": {
				"state": ".3.STATE"
			}
		},
		"HmIP-PSM": {
			"power": {
				"state": ".3.STATE"
			},
			"powerCurrent": {
				"state": ".6.CURRENT",
				"unit": " mA"
			},
			"powerFrequency": {
				"state": ".6.FREQUENCY"
			},
			"powerCounter": {
				"state": ".6.ENERGY_COUNTER",
				"unit": " Wh"
			},
			"powerMeter": {
				"state": ".6.POWER",
				"unit": " W"
			},
			"powerVoltage": {
				"state": ".6.VOLTAGE",
				"unit": " V"
			}
		},
		"HmIP-PSM-2": {
			"temperature":{
				"state":".0.ACTUAL_TEMPERATURE",
				"unit":" °C"
			},
			"power":{
				"state":".2.STATE",
				"action":".3.STATE"
			},
			"powerCurrent":{
				"state":".6.CURRENT",
				"unit":" mA"
			},
			"powerFrequency":{
				"state":".6.FREQUENCY"
			},
			"powerCounter":{
				"state":".6.ENERGY_COUNTER",
				"unit":" Wh"
			},
			"powerMeter":{
				"state":".6.POWER",
				"unit":" W"
			},
			"powerVoltage":{
				"state":".6.VOLTAGE",
				"unit":" V"
			}
		},
		"HM-ES-PMSw1-Pl-DN-R1": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"powerCurrent": {
				"state": ".2.CURRENT",
				"unit": " mA"
			},
			"powerFrequency": {
				"state": ".2.FREQUENCY"
			},
			"powerCounter": {
				"state": ".2.ENERGY_COUNTER",
				"unit": " Wh"
			},
			"powerMeter": {
				"state": ".2.POWER",
				"unit": " W"
			},
			"powerVoltage": {
				"state": ".2.VOLTAGE",
				"unit": " V"
			}
		},
		"HM-LC-Sw1-Pl": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"activity": {
				"state": ".1.WORKING",
				"action": ".1.WORKING"
			}
		},
		"HM-LC-Sw1-Pl-2": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			}
		},
		"HM-LC-Sw1-Pl-DN-R1": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			}
		},
		"HM-ES-PMSw1-DR": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"boot": {
				"state": ".2.BOOT",
				"action": ".2.BOOT"
			},
			"powerCurrent": {
				"state": ".2.CURRENT",
				"unit": " mA"
			},
			"powerFrequency": {
				"state": ".2.FREQUENCY"
			},
			"powerCounter": {
				"state": ".2.ENERGY_COUNTER",
				"unit": " Wh"
			},
			"powerMeter": {
				"state": ".2.POWER",
				"unit": " W"
			},
			"powerVoltage": {
				"state": ".2.VOLTAGE",
				"unit": " V"
			}
		},
		"HM-ES-PMSw1-Pl": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"timerOff": {
				"state": ".1.ON_TIME",
				"action": ".1.ON_TIME"
			},
			"boot": {
				"state": ".2.BOOT",
				"action": ".2.BOOT"
			},
			"powerCurrent": {
				"state": ".2.CURRENT",
				"unit": " mA"
			},
			"powerFrequency": {
				"state": ".2.FREQUENCY"
			},
			"powerVoltage": {
				"state": ".2.VOLTAGE",
				"unit": " V"
			},
			"powerCounter": {
				"state": ".2.ENERGY_COUNTER",
				"unit": " Wh"
			},
			"powerMeter": {
				"state": ".2.POWER",
				"unit": " W"
			},
			"gasCounter": {
				"state": ".1.GAS_ENERGY_COUNTER",
				"unit": " m3"
			},
			"gasMeter": {
				"state": ".1.GAS_POWER",
				"unit": " m3"
			}
		}
	},
	
	// motions or presence
	"motion": {
		"HmIP-SMI55": {
			"motion": {
				"state": ".3.MOTION"
			},
			"brightness": {
				"state": ".3.BRIGHTNESS"
			},
			"illumination": {
				"state": ".3.ILLUMINATION"
			}
		},
		"HmIP-SMI55-2": {
			"motion": {
				"state": ".3.MOTION"
			},
			"illumination": {
				"state": ".3.ILLUMINATION"
			},
			"illuminationCurrent": {
				"state": ".3.CURRENT_ILLUMINATION"
			},
			"PRESS_LONG{n}": {
				"state": ".{n}.PRESS_LONG",
				"action": ".{n}.PRESS_LONG"
			},
			"PRESS_LONG_RELEASE{n}": {
				"state": ".{n}.PRESS_LONG_RELEASE",
				"action": ".{n}.PRESS_LONG_RELEASE"
			},
			"PRESS_LONG_START{n}": {
				"state": ".{n}.PRESS_LONG_START",
				"action": ".{n}.PRESS_LONG_START"
			},
			"PRESS_SHORT{n}": {
				"state": ".{n}.PRESS_SHORT",
				"action": ".{n}.PRESS_SHORT"
			}
		},
		"HmIP-SMI": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		},
		"HmIP-SMO-A": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		},
		"HmIP-SAM": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		},
		"HmIP-SPI": {
			"presence": {
				"state": ".1.PRESENCE_DETECTION_STATE"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			}
		},
		"HM-PB-6-WM55": {
			"PRESS_LONG1": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT1": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_LONG2": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT2": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			},
			"PRESS_LONG3": {
				"state": ".3.PRESS_LONG",
				"action": ".3.PRESS_LONG"
			},
			"PRESS_SHORT3": {
				"state": ".3.PRESS_SHORT",
				"action": ".3.PRESS_SHORT"
			},
			"PRESS_LONG4": {
				"state": ".4.PRESS_LONG",
				"action": ".4.PRESS_LONG"
			},
			"PRESS_SHORT4": {
				"state": ".4.PRESS_SHORT",
				"action": ".4.PRESS_SHORT"
			},
			"PRESS_LONG5": {
				"state": ".5.PRESS_LONG",
				"action": ".5.PRESS_LONG"
			},
			"PRESS_SHORT5": {
				"state": ".5.PRESS_SHORT",
				"action": ".5.PRESS_SHORT"
			},
			"PRESS_LONG6": {
				"state": ".6.PRESS_LONG",
				"action": ".6.PRESS_LONG"
			},
			"PRESS_SHORT6": {
				"state": ".6.PRESS_SHORT",
				"action": ".6.PRESS_SHORT"
			}
		},
		"HM-Sen-MDIR-WM55": {
			"PRESS_LONG_BOTTOM": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT_BOTTOM": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_LONG_TOP": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT_TOP": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			},
			"motion": {
				"state": ".3.MOTION"
			},
			"illumination": {
				"state": ".3.ILLUMINATION"
			}
		},
		"HM-Sec-MDIR": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.BRIGHTNESS"
			}
		},
		"HM-Sen-MDIR-O": {
			"motion": {
				"state": ".1.MOTION"
			},
			"illumination": {
				"state": ".1.BRIGHTNESS"
			}
		},
		"HM-Sen-MDIR-O-2": {
			"motion": {
				"state": ".1.MOTION"
			},
			"brightness": {
				"state": ".1.BRIGHTNESS"
			}
		},
		"HM-Sen-MDIR-O-3": {
			"motion": {
				"state": ".1.MOTION"
			},
			"brightness": {
				"state": ".1.BRIGHTNESS"
			}
		}
	},
	
	// door / locks
	"door": {
		"HM-Sec-Key": {
			"error": {
				"state": ".1.ERROR"
			},
			"lock": {
				"state": ".1.OPEN"
			}
		},
		"HM-Sec-Key-O": {
			"error": {
				"state": ".1.ERROR"
			},
			"lock": {
				"state": ".1.OPEN"
			}
		}
	},
	
	// weather station
	"weather-station": {
		"HmIP-STHO": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			}
		},
		"HmIP-STHO-A": {
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			}
		},
		"HmIP-SWO-B": {
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"wind": {
				"state": ".1.WIND_SPEED"
			},
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			},
			"sunshineDuration": {
				"state": ".1.SUNSHINEDURATION"
			}
		},
		"HmIP-SWO-PR": {
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"wind": {
				"state": ".1.WIND_SPEED"
			},
			"windDirection": {
				"state": ".1.WIND_DIR"
			},
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			},
			"sunshineDuration": {
				"state": ".1.SUNSHINEDURATION"
			},
			"rain": {
				"state": ".1.RAINING"
			},
			"rainCounter": {
				"state": ".1.RAIN_COUNTER"
			}
		},
		"HmIP-SWO-PL": {
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"wind": {
				"state": ".1.WIND_SPEED"
			},
			"temperature": {
				"state": ".1.ACTUAL_TEMPERATURE"
			},
			"illumination": {
				"state": ".1.ILLUMINATION"
			},
			"sunshineDuration": {
				"state": ".1.SUNSHINEDURATION"
			},
			"raining": {
				"state": ".1.RAINING"
			},
			"rainCounter": {
				"state": ".1.RAIN_COUNTER"
			}
		},
		"HM-WDS40-TH-I-2": {
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"humidity": {
				"state": ".1.HUMIDITY"
			}
		},
		"HM-WDS100-C6-O": {
			"humidity": {
				"state": ".1.HUMIDITY"
			},
			"wind": {
				"state": ".1.WIND_SPEED"
			},
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"illumination": {
				"state": ".1.BRIGHTNESS"
			},
			"sunshineDuration": {
				"state": ".1.SUNSHINEDURATION"
			},
			"raining": {
				"state": ".1.RAINING"
			},
			"rainCounter": {
				"state": ".1.RAIN_COUNTER"
			}
		}
	},
	
	// other
	"other": {
		"HB-OU-MP3-LED": {
			"state": {
				"state": ".1.STATE"
			},
			"submit": {
				"state": ".1.SUBMIT"
			},
			"state2": {
				"state": ".2.STATE"
			},
			"submit2": {
				"state": ".2.SUBMIT"
			}
		},
		"HmIP-ASIR-B1": {
			"acoustic": {
				"state": ".3.ACOUSTIC_ALARM_ACTIVE"
			},
			"optical": {
				"state": ".3.OPTICAL_ALARM_ACTIVE"
			}
		},
		"HmIP-SCI": {
			"rssi": {
				"state": ".0.RSSI_DEVICE"
			},
			"power": {
				"state": ".1.STATE"
			}
		},
		"HmIPW-DRAP": {
			"temperature": {
				"state": ".0.ACTUAL_TEMPERATURE"
			}
		},
		"HmIP-FCI1": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			},
			"PRESS_LONG": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			}
		},
		"HmIP-PCBS": {
			"powerCh2": {
				"state": ".2.STATE",
				"action": ".2.STATE"
			},
			"powerCh3": {
				"state": ".3.STATE",
				"action": ".3.STATE"
			},
			"powerCh4": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"powerCh5": {
				"state": ".5.STATE",
				"action": ".5.STATE"
			}
		},
		"HmIP-PCBS2": {
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			}
		},
		"HB-UNI-Sen-CAP-MOIST-T": { // 6xFeuchte + 1x Temp Sensor, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"temperature": {
				"state": ".1.TEMPERATURE"
			},
			"humidityCh{n}": {
				"state": ".{n}.HUMIDITY"
			}
		},
		"HB-UNI-Sen-TEMP-DS18B20": { // 8-fach Temp-Sensor, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"temperatureCh{n}": {
				"state": ".{n}.TEMPERATURE"
			}
		},
		"HB-UNI-Sen-DUMMY-BEACON-V2": { // 16 Dummy Geräte, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"powerCh{n}": {
				"state": ".{n}.STATE"
			}
		},
		"HB-UNI-Sen-LEV-US": { // Ultraschall Sensor Regentank, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"batteryVoltage": {
				"state": ".1.BATTERY_VOLTAGE"
			},
			"fillingHeight": {
				"state": ".1.FILLING_HEIGHT"
			},
			"fillingLevel": {
				"state": ".1.FILLING_LEVEL"
			},
			"fillingLiter": {
				"state": ".1.FILLING_LITER"
			}
		},
		"HB-UNI-Sen-RFID-RC": { // RFID Leser/Taster (8 Chips), https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"powerCh{n}": {
				"state": ".{n}.STATE"
			},
			"rfidCh{n}": {
				"state": ".{n}.RFID_CHIPID"
			}
		},
		"HB-UNI-Sen-VOLT": { // 2-fach DC Spannungsmessung, https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"voltageCh{n}": {
				"state": ".{n}.HB_VOLTAGE"
			}
		}
	},
	
	// switch
	"switch": {
		"HM-PB-2-FM": {
			"PRESS_CONT1": {
				"state": ".1.PRESS_CONT",
				"action": ".1.PRESS_CONT"
			},
			"PRESS_LONG1": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT1": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_CONT2": {
				"state": ".2.PRESS_CONT",
				"action": ".2.PRESS_CONT"
			},
			"PRESS_LONG2": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT2": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			}
		},
		"HmIP-BS2": {
			"powerCh1": {
				"state": ".4.STATE",
				"action": ".4.STATE"
			},
			"powerCh2": {
				"state": ".8.STATE",
				"action": ".8.STATE"
			}
		},
		"HmIP-WRC6": {
			"PRESS_LONG{n}": {
				"state": ".{n}.PRESS_LONG",
				"action": ".{n}.PRESS_LONG"
			},
			"PRESS_LONG_RELEASE{n}": {
				"state": ".{n}.PRESS_LONG_RELEASE",
				"action": ".{n}.PRESS_LONG_RELEASE"
			},
			"PRESS_LONG_START{n}": {
				"state": ".{n}.PRESS_LONG_START",
				"action": ".{n}.PRESS_LONG_START"
			},
			"PRESS_SHORT{n}": {
				"state": ".{n}.PRESS_SHORT",
				"action": ".{n}.PRESS_SHORT"
			}
		},
		"HmIP-RCV-50": {
			"PRESS_LONG{n}": {
				"state": ".{n}.PRESS_LONG",
				"action": ".{n}.PRESS_LONG"
			},
			"PRESS_SHORT{n}": {
				"state": ".{n}.PRESS_SHORT",
				"action": ".{n}.PRESS_SHORT"
			}
		},
		"HM-Dis-EP-WM55": {
			"PRESS_CONT{n}": {
				"state": ".{n}.PRESS_CONT",
				"action": ".{n}.PRESS_CONT"
			},
			"PRESS_LONG{n}": {
				"state": ".{n}.PRESS_LONG",
				"action": ".{n}.PRESS_LONG"
			},
			"PRESS_SHORT{n}": {
				"state": ".{n}.PRESS_SHORT",
				"action": ".{n}.PRESS_SHORT"
			}
		},
		"HmIP-FSI16": {
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			},
			"timerOffCh{n}": {
				"state": ".{n}.ON_TIME",
				"action": ".{n}.ON_TIME"
			}
		},
		"HB-UNI-SenAct-4-4-RC": { // Universal 4fach-Aktor und 4fach-Sender (Taster), https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			},
			"timerOffCh{n}": {
				"state": ".{n}.ON_TIME",
				"action": ".{n}.ON_TIME"
			}
		},
		"HB-UNI-SenAct-4-4-SC": { // Universal 4fach-Aktor und 4fach-Sender (Schliesser), https://github.com/Zefau/ioBroker.jarvis/issues/1612#issuecomment-1322305037
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			},
			"lowBatteryCh{n}": {
				"state": ".{n}.LOW_BAT"
			}
		},
		"HmIPW-DRI32": {
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			},
			"PRESS_LONG{n}": {
				"state": ".{n}.PRESS_LONG",
				"action": ".{n}.PRESS_LONG"
			},
			"PRESS_SHORT{n}": {
				"state": ".{n}.PRESS_SHORT",
				"action": ".{n}.PRESS_SHORT"
			}
		},
		"HmIPW-DRS4": {
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			},
			"activityCh{n}": {
				"state": ".{n}.PROCESS"
			}
		},
		"HmIPW-DRD3": {
			"levelCh{n}": {
				"state": ".{n}.LEVEL",
				"action": ".{n}.LEVEL"
			},
			"statusCh{n}": {
				"state": ".{n}.LEVEL_STATUS",
				"action": ".{n}.LEVEL_STATUS"
			},
			"activityCh{n}": {
				"state": ".{n}.PROCESS"
			}
		},
		"HmIPW-DRS8": {
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			},
			"activityCh{n}": {
				"state": ".{n}.PROCESS"
			}
		},
		"HmIP-DRSI1": {
			"power": {
				"state": ".2.STATE",
				"action": ".3.STATE"
			}
		},
		"HmIP-WRC2": {
			"PRESS_LONG_BOTTOM": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT_BOTTOM": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_LONG_TOP": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT_TOP": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			}
		},
		"HM-RC-2-PBU-FM": {
			"PRESS_CONT_BOTTOM": {
				"state": ".1.PRESS_CONT",
				"action": ".1.PRESS_CONT"
			},
			"PRESS_LONG_BOTTOM": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_LONGRELEASE_BOTTOM": {
				"state": ".1.PRESS_LONG_RELEASE",
				"action": ".1.PRESS_LONG_RELEASE"
			},
			"PRESS_SHORT_BOTTOM": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_CONT_TOP": {
				"state": ".2.PRESS_CONT",
				"action": ".2.PRESS_CONT"
			},
			"PRESS_LONG_TOP": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_LONGRELEASE_TOP": {
				"state": ".2.PRESS_LONG_RELEASE",
				"action": ".2.PRESS_LONG_RELEASE"
			},
			"PRESS_SHORT_TOP": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			}
		},
		"HM-LC-Sw1-DR": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			}
		},
		"HM-LC-SW1-FM": {
			"power": {
				"state": ".1.STATE",
				"action": ".1.STATE"
			}
		},
		"HM-PB-2-WM": {
			"lowBatteryCh1": {
				"state": ".1.LOWBAT"
			},
			"PRESS_LONG_BOTTOM": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT_BOTTOM": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_LONG_TOP": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT_TOP": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			}
		},
		"HM-PB-2-WM55": {
			"lowBatteryCh1": {
				"state": ".1.LOWBAT"
			},
			"PRESS_LONG_BOTTOM": {
				"state": ".1.PRESS_LONG",
				"action": ".1.PRESS_LONG"
			},
			"PRESS_SHORT_BOTTOM": {
				"state": ".1.PRESS_SHORT",
				"action": ".1.PRESS_SHORT"
			},
			"PRESS_LONG_TOP": {
				"state": ".2.PRESS_LONG",
				"action": ".2.PRESS_LONG"
			},
			"PRESS_SHORT_TOP": {
				"state": ".2.PRESS_SHORT",
				"action": ".2.PRESS_SHORT"
			}
		},
		"HB-UNI-SenAct-4-4-RC": {
			"stateCh1": {
				"state": ".1.STATE"
			},
			"stateCh2": {
				"state": ".2.STATE"
			},
			"stateCh3": {
				"state": ".3.STATE"
			},
			"stateCh4": {
				"state": ".4.STATE"
			},
			"PRESS_LONG1": {
				"state": ".5.PRESS_LONG",
				"action": ".5.PRESS_LONG"
			},
			"PRESS_SHORT1": {
				"state": ".5.PRESS_SHORT",
				"action": ".5.PRESS_SHORT"
			},
			"PRESS_LONG2": {
				"state": ".6.PRESS_LONG",
				"action": ".6.PRESS_LONG"
			},
			"PRESS_SHORT2": {
				"state": ".6.PRESS_SHORT",
				"action": ".6.PRESS_SHORT"
			},
			"PRESS_LONG3": {
				"state": ".7.PRESS_LONG",
				"action": ".7.PRESS_LONG"
			},
			"PRESS_SHORT3": {
				"state": ".7.PRESS_SHORT",
				"action": ".7.PRESS_SHORT"
			},
			"PRESS_LONG4": {
				"state": ".8.PRESS_LONG",
				"action": ".8.PRESS_LONG"
			},
			"PRESS_SHORT4": {
				"state": ".8.PRESS_SHORT",
				"action": ".8.PRESS_SHORT"
			}
		}
	},
	
	// CUxD
	"CUxD": {
		"HM-LC-Sw1PBU-FM": {
			"powerCh{n}": {
				"state": ".{n}.STATE",
				"action": ".{n}.STATE"
			}
		}
	}
}

/**
 *
 *
 * @param	{Object}	deviceStructure
 * @param	{String}	deviceStructure.root		root state
 * @param	{Array}		deviceStructure.states		all states
 * @param	{Object}	deviceStructure.values		all states with its value
 * @return	{Object}	device
 */
export function parse(deviceStructure, options) {
	return new Promise(resolve => {
		const obj = deviceStructure.objects[deviceStructure.root];
		
		let device = {
			'name': obj.common.name,
			'function': 'other',
			'room': getRoom(deviceStructure)
		}
		
		if (obj.native) {
			device = {
				...device,
				'states': {
					'config': '.0.CONFIG_PENDING',
					'unreach': '.0.UNREACH',
					'lowBattery': [ '.0.LOWBAT', '.0.LOW_BAT' ],
					'lowBatteryAlarm': '.0.LOWBAT_ALARM',
					'connectivity': '.0.RSSI_PEER',
					'firmware': '.0.UPDATE_PENDING'
				}
			}
			
			// find device
			const deviceTypeList = {}
			const deviceTypeListLowerCase = {}
			
			let findHmIP = -1;
			let findHmIPW = -1;
			
			const deviceType = obj.native.TYPE.toLowerCase();
			for (const func in STATE_MAPPING) {
				deviceTypeList[func] = deviceTypeList[func] || Object.keys(STATE_MAPPING[func]);
				deviceTypeListLowerCase[func] = deviceTypeListLowerCase[func] || deviceTypeList[func].map(key => key.toLowerCase().replace('hmip-', '').replace('hmipw-', '').replace('hm-', ''));
				
				// search device
				findHmIP = deviceTypeListLowerCase[func].indexOf(deviceType.replace('hmipw-', '').replace('hmip-', '').replace('hm-', ''));
				findHmIPW = deviceTypeListLowerCase[func].indexOf(deviceType.replace('hmipw-', '').replace('hmip-', '').replace('hm-', ''));
				
				if (findHmIP !== -1 || findHmIPW !== -1) {
					device.function = func;
					device.states = {
						...device.states,
						...detectStates(_rfdc(STATE_MAPPING[func][deviceTypeList[func][findHmIP !== -1 ? findHmIP : findHmIPW]]), deviceStructure)
					}
					
					break;
				}
			}
			
			// CUxD
			if (deviceStructure.root.indexOf('.CUX') > -1) {
					device.states = {
						...device.states,
						..._rfdc(STATE_MAPPING.CUxD['HM-LC-Sw1PBU-FM'])
					}
			}
			
			// validate states
			device.states = validateStates(device.states, deviceStructure);
			
			// nullify device if no states (except unreach / lowBattery) are found
			if (findHmIP === -1 && findHmIPW === -1) {
				device.states = {}
			}
		}
		
		// resolve
		resolve(device);
	});
}
