'use strict';

const coronapi = require('coronapi');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const cache_timeout = parseInt(process.env.CACHE_TIMEOUT) || 60000;

const genCache = () => new Promise((resolve, reject) => coronapi().then(data => {
	const d = { updated: new Date().getTime(), data };
	fs.writeFile('./cache.json', JSON.stringify(d), err => {
		if (err) {
			reject(err);
		} else {
			resolve(d);
		}
	});
}));

const rmCache = () => new Promise((resolve, reject) => fs.unlink('./cache.json', err => {
	if (err) {
		reject(err);
	} else {
		resolve(true);
	}
}));

const getData = () => new Promise((resolve, reject) =>
	fs.access('./cache.json', fs.F_OK, err => {
		if (err) {
			if (err.errno === -4058) {
				genCache().then(cache => {
					if (cache === false) {
						reject(new Error('generate cache failed'));
					} else {
						resolve(cache);
					}
				});
			} else {
				reject(err);
			}
		} else {
			fs.readFile('./cache.json', (_err, data) => {
				if (_err) {
					reject(_err);
				} else {
					const d = JSON.parse(data);
					if (new Date().getTime() - d.updated > cache_timeout) {
						rmCache().then(() => {
							genCache().then(cache => {
								if (cache === false) {
									reject(new Error('generate cache failed'));
								} else {
									resolve(cache);
								}
							});
						}).catch(reject);
					} else {
						resolve(d);
					}
				}
			});
		}
	}));

const cleanString = string => string.replace(/ /g, '').replace(/\./g, '').toLowerCase();

router.get('/', (req, res) => {
	getData().then(data => res.json(data));
});

const countryExists = (c, a) => {
	c = cleanString(c);
	const b = Object.keys(a.data).map(cleanString);
	if (b.includes(c)) return a.data[Object.keys(a.data)[b.indexOf(c)]];
	return false;
};

const countryHandler = (req, res) => {
	const countries = req.params.countryNames
		? req.params.countryNames.split('|') : [];

	getData().then(data => {
		if (countries.length === 0) {
			res.json(Object.keys(data.data));
		} else {
			const d = {
				...data.updated
			};
			countries.forEach(country => {
				const c = countryExists(country, data);
				if (c) {
					d[country] = {
						...c
					};
				} else {
					d[country] = {
						error: true,
						message: 'Unknown country. Use /countrylist for more details'
					};
				}
			});
			res.json(d);
		}
	});
};

const listCountriesHandler = (req, res) => {
	getData().then(data => {
		res.json(Object.keys(data.data));
	});
};

router.get('/country/:countryNames?', countryHandler);
router.get('/countries/:countryNames?', countryHandler);
router.get('/countrylist', listCountriesHandler);
router.get('/list', listCountriesHandler);

module.exports = router;
