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

router.get('/', (req, res) => {
	getData().then(data => res.json(data));
});

module.exports = router;
