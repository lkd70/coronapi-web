# coronapi-web

A REST API for [coronapi](https://github.com/LKD70/coronapi)

Coronavirus is on everyone's minds at the moment, with this API,
you can bring it in to your apps, too.

This project is an example usage of the [coronapi](https://github.com/LKD70/coronapi) module.
For a live preview of this project, check out this [Heroku Instance](https://coronapi-web.herokuapp.com/).

## Config

All configuration is handled through environment variables:

| Option | Default | Description |
| ------ | ------- | ----------- |
| PORT | 3000 | PORT for API interface |
| CACHE_TIMEOUT | 60000 | Timeout in milliseconds for data cache to renew data |
| FILE_CACHE | true | Enable file based caching |
