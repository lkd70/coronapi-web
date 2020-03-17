'use strict';

const coronapi = require('coronapi');
const express = require('express');
const router = express.Router();
const fs = require('fs');

global.cache = {
	updated: 0
};
const cache_timeout = parseInt(process.env.CACHE_TIMEOUT) || 60000;
const file_cache = process.env.FILE_CACHE ? process.env.FILE_CACHE === 'true'
	? process.env.FILE_CACHE : false : false;

const genCache = () => new Promise((resolve, reject) => coronapi.then(data => {
	const d = {
		updated: new Date().getTime(),
		data
	};
	if (file_cache === true) {
		fs.writeFile('./cache.json', JSON.stringify(d), err => {
			if (err) {
				reject(err);
			} else {
				resolve(d);
			}
		});
	} else {
		global.cache = d;
		resolve(d);
	}
}));

const rmCache = () => new Promise((resolve, reject) => fs.unlink('./cache.json', err => {
	if (err) {
		reject(err);
	} else {
		resolve(true);
	}
}));

const getData = () => new Promise((resolve, reject) => {
	if (file_cache) {
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
		});
	} else if (new Date().getTime() - global.cache.updated > cache_timeout) {
		genCache().then(resolve);
	} else {
		resolve(global.cache);
	}
});

const cleanString = string => string.replace(/ /g, '').replace(/\./g, '').toLowerCase();

router.get('/', (req, res) => {
	getData().then(data => res.json(data));
});

const getLocation = (loc, data) => {
	loc = cleanString(loc);
	let location = false;
	data.areas.forEach(l => {
		if (cleanString(l.id) === loc) {
			location = l;
		} else {
			const res = getLocation(loc, l);
			if (res !== false) location = res;
		}
	});
	return location;
};

const listLocations = data => {
	const locations = [];
	data.areas.forEach(loc => {
		locations.push(loc.id);
		listLocations(loc).forEach(l => locations.push(l));
	});
	return locations;
};

const locationHandler = (req, res) => {
	const locations = req.params.locationNames
		? req.params.locationNames.split('|'): [];

	getData().then(data => {
		if (locations.length === 0) {
			res.json(listLocations(data.data));
		} else {
			res.json(locations.map(l => getLocation(l, data.data) || `Unknown location: ${l}`));
		}
	});
};

const totalHandler = (req, res) => getData().then(data => res.json({
	totalConfirmed: data.data.totalConfirmed,
	totalDeaths: data.data.totalDeaths,
	totalRecovered: data.data.totalRecovered,
	lastUpdated: data.data.lastUpdated
}));

const listLocationsHandler = (req, res) => getData().then(data =>
	res.json(listLocations(data.data)));

router.get('/locations?/:locationNames?', locationHandler);
router.get('/locationList', listLocationsHandler);
router.get('/list', listLocationsHandler);
router.get('/totals?', totalHandler);
module.exports = router;
