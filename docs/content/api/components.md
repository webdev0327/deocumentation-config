# Components

## Responses 

### NonFound :id=responsesnonfound
> A record not found

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Object</code></code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| detail | <code>String</code> | false | false | An error message |

**Example**:

```json
{
  "detail": "Not found"
}
```

* * *

## Schemas 

### Film :id=schemasfilm
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| starships | <code>Array</code> | false | false | The starship resources featured within this film. |
| starships[i] | <code>String</code> | false | false |  |
| edited | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was edited. |
| planets | <code>Array</code> | false | false | The planet resources featured within this film. |
| planets[i] | <code>String</code> | false | false |  |
| producer | <code>String</code> | false | false | The producer(s) of this film. |
| title | <code>String</code> | false | false | The title of this film. |
| url | <code>String</code> | false | false | The url of this resource |
| release_date | <code>String</code> | false | false | The release date at original creator country. |
| vehicles | <code>Array</code> | false | false | The vehicle resources featured within this film. |
| vehicles[i] | <code>String</code> | false | false |  |
| episode_id | <code>Integer</code> | false | false | The episode number of this film. |
| director | <code>String</code> | false | false | The director of this film. |
| created | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was created. |
| opening_crawl | <code>String</code> | false | false | The opening crawl text at the beginning of this film. |
| characters | <code>Array</code> | false | false | The people resources featured within this film. |
| characters[i] | <code>String</code> | false | false |  |
| species | <code>Array</code> | false | false | The species resources featured within this film. |
| species[i] | <code>String</code> | false | false |  |

**Example**:

```json
{
  "starships": [
    "http://swapi.dev/api/starships/1/"
  ],
  "edited": "2020-05-29T14:45:48Z",
  "planets": [
    "http://swapi.dev/api/plantes/1/"
  ],
  "producer": "string",
  "title": "string",
  "url": "string",
  "release_date": "2020-05-29",
  "vehicles": [
    "http://swapi.dev/api/vehicles/1/"
  ],
  "episode_id": 0,
  "director": "string",
  "created": "2020-05-29T14:45:48Z",
  "opening_crawl": "string",
  "characters": [
    "http://swapi.dev/api/people/1/"
  ],
  "species": [
    "http://swapi.dev/api/species/1/"
  ]
}
```

* * *

### People :id=schemaspeople
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| starships | <code>Array</code> | false | false | An array of starship resources that this person has piloted |
| starships[i] | <code>String</code> | false | false |  |
| edited | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was edited. |
| name | <code>String</code> | false | false | The name of this person. |
| created | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was created. |
| url | <code>String</code> | false | false | The url of this resource |
| gender | <code>String</code> | false | false | The gender of this person (if known). |
| vehicles | <code>Array</code> | false | false | An array of vehicle resources that this person has piloted |
| vehicles[i] | <code>String</code> | false | false |  |
| skin_color | <code>String</code> | false | false | The skin color of this person. |
| hair_color | <code>String</code> | false | false | The hair color of this person. |
| height | <code>String</code> | false | false | The height of this person in meters. |
| eye_color | <code>String</code> | false | false | The eye color of this person. |
| mass | <code>String</code> | false | false | The mass of this person in kilograms. |
| films | <code>Array</code> | false | false | An array of urls of film resources that this person has been in. |
| films[i] | <code>String</code> | false | false |  |
| species | <code>Array</code> | false | false | The url of the species resource that this person is. |
| species[i] | <code>String</code> | false | false |  |
| homeworld | <code>String</code> | false | false | The url of the planet resource that this person was born on. |
| birth_year | <code>String</code> | false | false | The birth year of this person. BBY (Before the Battle of Yavin) or ABY (After the Battle of Yavin). |

**Example**:

```json
{
  "starships": [
    "http://swapi.dev/api/starships/1/"
  ],
  "edited": "2020-05-29T14:45:48Z",
  "name": "string",
  "created": "2020-05-29T14:45:48Z",
  "url": "string",
  "gender": "string",
  "vehicles": [
    "http://swapi.dev/api/vehicles/1/"
  ],
  "skin_color": "string",
  "hair_color": "string",
  "height": "string",
  "eye_color": "string",
  "mass": "string",
  "films": [
    "http://swapi.dev/api/films/1/"
  ],
  "species": [
    "http://swapi.dev/api/species/1/"
  ],
  "homeworld": "string",
  "birth_year": "string"
}
```

* * *

### Planet :id=schemasplanet
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| diameter | <code>String</code> | false | false | The diameter of this planet in kilometers. |
| climate | <code>String</code> | false | false | The climate of this planet. Comma-seperated if diverse. |
| surface_water | <code>String</code> | false | false | The percentage of the planet surface that is naturally occuring water or bodies of water. |
| name | <code>String</code> | false | false | The name of this planet. |
| created | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was created. |
| url | <code>String</code> | false | false | The hypermedia URL of this resource. |
| rotation_period | <code>String</code> | false | false | The number of standard hours it takes for this planet to complete a single rotation on its axis. |
| edited | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was edited. |
| terrain | <code>String</code> | false | false | The terrain of this planet. Comma-seperated if diverse. |
| gravity | <code>String</code> | false | false | A number denoting the gravity of this planet. Where 1 is normal. |
| orbital_period | <code>String</code> | false | false | The number of standard days it takes for this planet to complete a single orbit of its local star. |
| films | <code>Array</code> | false | false | An array of Film URL Resources that this planet has appeared in. |
| films[i] | <code>String</code> | false | false |  |
| residents | <code>Array</code> | false | false | An array of People URL Resources that live on this planet. |
| residents[i] | <code>String</code> | false | false |  |
| population | <code>String</code> | false | false | The average populationof sentient beings inhabiting this planet. |

**Example**:

```json
{
  "diameter": "string",
  "climate": "string",
  "surface_water": "string",
  "name": "string",
  "created": "2020-05-29T14:45:48Z",
  "url": "string",
  "rotation_period": "string",
  "edited": "2020-05-29T14:45:48Z",
  "terrain": "string",
  "gravity": "string",
  "orbital_period": "string",
  "films": [
    "http://swapi.dev/api/films/1/"
  ],
  "residents": [
    "string"
  ],
  "population": "string"
}
```

* * *

### Specie :id=schemasspecie
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| edited | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was edited. |
| name | <code>String</code> | false | false | The name of this species. |
| classification | <code>String</code> | false | false | The classification of this species. |
| people | <code>Array</code> | false | false | An array of People URL Resources that are a part of this species. |
| people[i] | <code>String</code> | false | false |  |
| eye_colors | <code>String</code> | false | false | A comma-seperated string of common eye colors for this species, none if this species does not typically have eyes. |
| created | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was created. |
| designation | <code>String</code> | false | false | The designation of this species. |
| skin_colors | <code>String</code> | false | false | A comma-seperated string of common skin colors for this species, none if this species does not typically have skin. |
| language | <code>String</code> | false | false | The language commonly spoken by this species. |
| url | <code>String</code> | false | false | The hypermedia URL of this resource. |
| hair_colors | <code>String</code> | false | false | A comma-seperated string of common hair colors for this species, none if this species does not typically have hair. |
| homeworld | <code>String</code> | false | false | The URL of a planet resource, a planet that this species originates from. |
| films | <code>Array</code> | false | false |  An array of Film URL Resources that this species has appeared in. |
| films[i] | <code>String</code> | false | false |  |
| average_lifespan | <code>String</code> | false | false | The average lifespan of this species in years. |
| average_height | <code>String</code> | false | false | The average height of this person in centimeters. |

**Example**:

```json
{
  "edited": "2020-05-29T14:45:48Z",
  "name": "string",
  "classification": "string",
  "people": [
    "string"
  ],
  "eye_colors": "string",
  "created": "2020-05-29T14:45:48Z",
  "designation": "string",
  "skin_colors": "string",
  "language": "string",
  "url": "string",
  "hair_colors": "string",
  "homeworld": "string",
  "films": [
    "http://swapi.dev/api/films/1/"
  ],
  "average_lifespan": "string",
  "average_height": "string"
}
```

* * *

### Starship :id=schemasstarship
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| passengers | <code>String</code> | false | false | The number of non-essential people this starship can transport. |
| pilots | <code>Array</code> | false | false | An array of People URL Resources that this starship has been piloted by. |
| pilots[i] | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false | The name of this starship. The common name, such as Death Star. |
| hyperdrive_rating | <code>String</code> | false | false | The class of this starships hyperdrive. |
| url | <code>String</code> | false | false | The hypermedia URL of this resource. |
| cargo_capacity | <code>String</code> | false | false | The maximum number of kilograms that this starship can transport. |
| edited | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was edited. |
| consumables | <code>String</code> | false | false | The maximum length of time that this starship can provide consumables for its entire crew without having to resupply. |
| max_atmosphering_speed | <code>String</code> | false | false | The maximum speed of this starship in atmosphere. n/a if this starship is incapable of atmosphering flight. |
| crew | <code>String</code> | false | false | The number of personnel needed to run or pilot this starship. |
| length | <code>String</code> | false | false | The length of this starship in meters. |
| MGLT | <code>String</code> | false | false | The Maximum number of Megalights this starship can travel in a standard hour. A Megalight is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth. |
| starship_class | <code>String</code> | false | false | The class of this starship, such as Starfighter or Deep Space Mobile Battlestation. |
| created | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was created. |
| films | <code>Array</code> | false | false | An array of Film URL Resources that this starship has appeared in. |
| films[i] | <code>String</code> | false | false |  |
| model | <code>String</code> | false | false | The model or official name of this starship. Such as T-65 X-wing or DS-1 Orbital Battle Station. |
| cost_in_credits | <code>String</code> | false | false | The cost of this starship new, in galactic credits. |
| manufacturer | <code>String</code> | false | false | The manufacturer of this starship. Comma seperated if more than one. |

**Example**:

```json
{
  "passengers": "string",
  "pilots": [
    "string"
  ],
  "name": "string",
  "hyperdrive_rating": "string",
  "url": "string",
  "cargo_capacity": "string",
  "edited": "2020-05-29T14:45:48Z",
  "consumables": "string",
  "max_atmosphering_speed": "string",
  "crew": "string",
  "length": "string",
  "MGLT": "string",
  "starship_class": "string",
  "created": "2020-05-29T14:45:48Z",
  "films": [
    "http://swapi.dev/api/films/1/"
  ],
  "model": "string",
  "cost_in_credits": "string",
  "manufacturer": "string"
}
```

* * *

### Vehicle :id=schemasvehicle
**Type**: <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| vehicle_class | <code>String</code> | false | false | The class of this vehicle, such as Wheeled. |
| passengers | <code>String</code> | false | false | The number of non-essential people this vehicle can transport. |
| pilots | <code>Array</code> | false | false | An array of People URL Resources that this vehicle has been piloted by. |
| pilots[i] | <code>String</code> | false | false |  |
| name | <code>String</code> | false | false | The name of this vehicle. The common name, such as Sand Crawler. |
| created | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was created. |
| url | <code>String</code> | false | false | The hypermedia URL of this resource. |
| cargo_capacity | <code>String</code> | false | false | The maximum number of kilograms that this vehicle can transport. |
| edited | <code>String</code> | false | false | The ISO 8601 date format of the time that this resource was edited. |
| consumables | <code>String</code> | false | false | The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply. |
| max_atmosphering_speed | <code>String</code> | false | false | The maximum speed of this vehicle in atmosphere. |
| crew | <code>String</code> | false | false | The number of personnel needed to run or pilot this vehicle. |
| length | <code>String</code> | false | false | The length of this vehicle in meters. |
| films | <code>Array</code> | false | false | An array of Film URL Resources that this vehicle has appeared in. |
| films[i] | <code>String</code> | false | false |  |
| model | <code>String</code> | false | false | The model or official name of this vehicle. Such as All Terrain Attack Transport. |
| cost_in_credits | <code>String</code> | false | false | The cost of this vehicle new, in galactic credits. |
| manufacturer | <code>String</code> | false | false | The manufacturer of this vehicle. Comma seperated if more than one. |

**Example**:

```json
{
  "vehicle_class": "string",
  "passengers": "string",
  "pilots": [
    "string"
  ],
  "name": "string",
  "created": "2020-05-29T14:45:48Z",
  "url": "string",
  "cargo_capacity": "string",
  "edited": "2020-05-29T14:45:48Z",
  "consumables": "string",
  "max_atmosphering_speed": "string",
  "crew": "string",
  "length": "string",
  "films": [
    "http://swapi.dev/api/films/1/"
  ],
  "model": "string",
  "cost_in_credits": "string",
  "manufacturer": "string"
}
```

* * *

