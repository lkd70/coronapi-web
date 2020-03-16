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

## Routes

### Route: `/`

Returns all data

#### Example response

```json
{
    "updated": 1584218593961,
    "data": [
        "China": {
            "total_cases": 80824,
            "new_cases": 11,
            "total_deaths": 3189,
            "new_deaths": 13,
            "total_recovered": 65573,
            "active_cases": 12062,
            "serious_cases": 3610,
            "total_cases_per_million": 56.2
       }, ...
    ]
}
```

### Route: `/countries`

Lists all country names

#### Example response

```json
["China","Italy","Iran","S. Korea","Spain","Germany","France","USA","Switzerland","UK","Norway","Sweden","Netherlands","Denmark","Japan","Diamond Princess","Belgium","Austria","Qatar","Australia","Malaysia","Greece","Canada","Finland","Bahrain","Singapore","Czechia","Slovenia","Israel","Portugal","Iceland","Brazil","Hong Kong","Ireland","Romania","Estonia","Philippines","Iraq","Egypt","Kuwait","Poland","Saudi Arabia","San Marino","India","Indonesia","Lebanon","UAE","Thailand","Chile","Russia","Taiwan","Vietnam","Luxembourg","Serbia","Slovakia","Bulgaria","Brunei","Albania","Croatia","Peru","South Africa","Palestine","Algeria","Panama","Argentina","Pakistan","Georgia","Hungary","Ecuador","Belarus","Latvia","Mexico","Costa Rica","Cyprus","Colombia","Senegal","Oman","Armenia","Tunisia","Bosnia and Herzegovina","Malta","Morocco","Azerbaijan","North Macedonia","Moldova","Afghanistan","Dominican Republic","Macao","Sri Lanka","Bolivia","Maldives","Martinique","Faeroe Islands","Lithuania","Jamaica","Cambodia","French Guiana","Paraguay","New Zealand","Kazakhstan","Réunion","Bangladesh","Turkey","Cuba","Liechtenstein","Uruguay","Ukraine","Channel Islands","French Polynesia","Guadeloupe","Honduras","Puerto Rico","Monaco","Nigeria","Aruba","Burkina Faso","Cameroon","DRC","Ghana","Namibia","Saint Martin","Trinidad and Tobago","Venezuela","Guyana","Sudan","Andorra","Jordan","Nepal","Antigua and Barbuda","Bhutan","Cayman Islands","Ivory Coast","Curaçao","Ethiopia","Gabon","Gibraltar","Guatemala","Guinea","Vatican City","Kenya","Mauritania","Mayotte","Mongolia","Rwanda","St. Barth","Saint Lucia","St. Vincent Grenadines","Suriname","Eswatini","Togo","U.S. Virgin Islands"]
```

### Route: `/countries/<COUNTRY_NAME>|[COUNTRY_NAME]...`

Returns details for given country name(s).

#### Example response

query: `/countries/UK|USA`

```json
{
  "UK": {
    "total_cases": 1140,
    "new_cases": 342,
    "total_deaths": 21,
    "new_deaths": 10,
    "total_recovered": 18,
    "active_cases": 1101,
    "serious_cases": 20,
    "total_cases_per_million": 16.8
  },
  "USA": {
    "total_cases": 2499,
    "new_cases": 252,
    "total_deaths": 55,
    "new_deaths": 6,
    "total_recovered": 49,
    "active_cases": 2395,
    "serious_cases": 10,
    "total_cases_per_million": 7.5
  }
}
```

### Route: `/total`

Returns global statistics

#### Example response

```json
{
  "updated": 1584374601418,
  "total_cases": 175693,
  "new_cases": 6133,
  "total_deaths": 6715,
  "new_deaths": 210,
  "total_recovered": 77868,
  "active_cases": 91110,
  "serious_cases": 5967,
  "cases_per_million": 22.5
}
```
