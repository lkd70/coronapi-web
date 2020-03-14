# coronapi-web

A REST API for [coronapi](https://github.com/LKD70/coronapi)

## Config

All configuration is handled through environment variables:

| Option | Default | Description |
| ------ | ------- | ----------- |
| PORT | 3000 | PORT for API interface |
| CACHE_TIMEOUT | 60000 | Timeout in milliseconds for data cache to renew data |
| FILE_CACHE | true | Enable file based caching |
