import translations from './translations';
import config from './config';

export function findLocale() {
	const locale = config.forceLocale ||
		(navigator && (
			navigator.language ||
			navigator.browserLanguage ||
			navigator.userLanguage ||
			(navigator.languages && navigator.languages[0]) ||
			'en-us'
		));
	return locale.toLowerCase();
}


export class Localize {
	constructor(localizedData = { ...translations, ...config.localization }) {
		const localizedMap = this.processLocalized(localizedData);
		const currentLocal = findLocale();
		const [language] = currentLocal.split('-');
		this.localizedValues = {
			...localizedMap[language],
			...localizedMap[currentLocal]
		};
	}

	lookup = key => {
		return this.localizedValues[key];
	};

	processLocalized = (data = {}) => {
		// Lowercase top level object properties which are locale names
		const [locales, localizedData] = Object.keys(data).reduce(([locales, localeData], key) => {
			const locale = key.toLowerCase();
			return [
				[...locales, locale],
				{
					...localeData,
					[locale]: data[key]
				}
			];
		}, [[], {}]);

		return locales.reduce((acc, locale) => {
			const [language] = locale.split('-');
			return {
				...acc,
				[locale]: {
					...acc[locale],
					...this.flattenObject(localizedData[language]),
					...this.flattenObject(localizedData[locale])
				}
			};
		}, {});
	};

	flattenObject = (data) => {
		const flattened = {};

		function flatten(part, prefix) {
			if (part) {
				Object.keys(part).forEach(key => {
					const prop = prefix ? `${prefix}.${key}` : key;
					const val = part[key];

					if (typeof val === 'object') {
						return flatten(val, prop);
					}

					flattened[prop] = val;
				});
			}
		}

		flatten(data);
		return flattened;
	};
}
