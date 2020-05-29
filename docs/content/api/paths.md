# Paths

## GET /people/ 

> Get all the people

**Summary**: Get people

#### Responses

**Status Code**: 200

> A JSON document representing peoples.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| count | <code>Integer</code> | false | false |  |
| next | <code>String</code> | false | true |  |
| previous | <code>String</code> | false | true |  |
| results | [<code>Array&lt;People&gt;</code>](/content/api/components?id=schemasPeople) |  | false |  |

**Example**:

```json
{
  "count": 1,
  "next": "http://swapi.dev/api/people/?page=3",
  "previous": "http://swapi.dev/api/people/?page=1",
  "results": [
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
  ]
}
```

* * *

## GET /people/{id}/ 

> Get a people by ID

**Summary**: Get a people

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | A people ID |

#### Responses

**Status Code**: 200

> A JSON document representing people.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;People&gt;</code>](/content/api/components?id=schemasPeople)

* * *

**Status Code**: 404 - [NonFound](/content/api/components?id&#x3D;responsesnonfound)

* * *

## GET /planets/ 

> Get all the planets resources

**Summary**: Get planets

#### Responses

**Status Code**: 200

> A JSON document representing peoples.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| count | <code>Integer</code> | false | false |  |
| next | <code>String</code> | false | true |  |
| previous | <code>String</code> | false | true |  |
| results | [<code>Array&lt;Planet&gt;</code>](/content/api/components?id=schemasPlanet) |  | false |  |

**Example**:

```json
{
  "count": 1,
  "next": "http://swapi.dev/api/planets/?page=3",
  "previous": "http://swapi.dev/api/planets/?page=1",
  "results": [
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
  ]
}
```

* * *

## GET /planets/{id}/ 

> Get a planet by ID

**Summary**: Get a planet

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | A planet ID |

#### Responses

**Status Code**: 200

> A JSON document representing a planet.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Planet&gt;</code>](/content/api/components?id=schemasPlanet)

* * *

**Status Code**: 404 - [NonFound](/content/api/components?id&#x3D;responsesnonfound)

* * *

## GET /films/ 

> Get all films

**Summary**: Get films

#### Responses

**Status Code**: 200

> A JSON document representing films.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| count | <code>Integer</code> | false | false |  |
| next | <code>String</code> | false | true |  |
| previous | <code>String</code> | false | true |  |
| results | [<code>Array&lt;Film&gt;</code>](/content/api/components?id=schemasFilm) |  | false |  |

**Example**:

```json
{
  "count": 1,
  "next": "http://swapi.dev/api/films/?page=3",
  "previous": "http://swapi.dev/api/films/?page=1",
  "results": [
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
  ]
}
```

* * *

## GET /films/{id}/ 

> Get a film by ID

**Summary**: Get a film

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | A film ID |

#### Responses

**Status Code**: 200

> A JSON document representing a film.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Film&gt;</code>](/content/api/components?id=schemasFilm)

* * *

**Status Code**: 404 - [NonFound](/content/api/components?id&#x3D;responsesnonfound)

* * *

## GET /species/ 

> Get all species

**Summary**: Get species

#### Responses

**Status Code**: 200

> A JSON document representing species.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| count | <code>Integer</code> | false | false |  |
| next | <code>String</code> | false | true |  |
| previous | <code>String</code> | false | true |  |
| results | [<code>Array&lt;Specie&gt;</code>](/content/api/components?id=schemasSpecie) |  | false |  |

**Example**:

```json
{
  "count": 1,
  "next": "http://swapi.dev/api/species/?page=3",
  "previous": "http://swapi.dev/api/species/?page=1",
  "results": [
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
  ]
}
```

* * *

**Status Code**: 404 - [NonFound](/content/api/components?id&#x3D;responsesnonfound)

* * *

## GET /species/{id}/ 

> Get a specie by ID

**Summary**: Get a specie

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | A specie ID |

#### Responses

**Status Code**: 200

> A JSON document representing a specie.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Specie&gt;</code>](/content/api/components?id=schemasSpecie)

* * *

## GET /vehicles/ 

> Get all vehicles

**Summary**: Get vehicles

#### Responses

**Status Code**: 200

> A JSON document representing vehicles.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| count | <code>Integer</code> | false | false |  |
| next | <code>String</code> | false | true |  |
| previous | <code>String</code> | false | true |  |
| results | [<code>Array&lt;Vehicle&gt;</code>](/content/api/components?id=schemasVehicle) |  | false |  |

**Example**:

```json
{
  "count": 1,
  "next": "http://swapi.dev/api/vehicles/?page=3",
  "previous": "http://swapi.dev/api/vehicles/?page=1",
  "results": [
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
  ]
}
```

* * *

## GET /vehicles/{id}/ 

> Get a vehicle by ID

**Summary**: Get a vehicle

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | A vehicle ID |

#### Responses

**Status Code**: 200

> A JSON document representing a vehicle.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Vehicle&gt;</code>](/content/api/components?id=schemasVehicle)

* * *

**Status Code**: 404 - [NonFound](/content/api/components?id&#x3D;responsesnonfound)

* * *

## GET /starships/ 

> Get all starships

**Summary**: Get starships

#### Responses

**Status Code**: 200

> A JSON document representing starships.

**Content Type**: <code>application/json</code>

**Response Type:** <code>Object</code>
    
| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| count | <code>Integer</code> | false | false |  |
| next | <code>String</code> | false | true |  |
| previous | <code>String</code> | false | true |  |
| results | [<code>Array&lt;Starship&gt;</code>](/content/api/components?id=schemasStarship) |  | false |  |

**Example**:

```json
{
  "count": 1,
  "next": "http://swapi.dev/api/starships/?page=3",
  "previous": "http://swapi.dev/api/starships/?page=1",
  "results": [
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
  ]
}
```

* * *

## GET /starships/{id}/ 

> Get a starship by ID

**Summary**: Get a starship

#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | A starship ID |

#### Responses

**Status Code**: 200

> A JSON document representing a starship.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;Starship&gt;</code>](/content/api/components?id=schemasStarship)

* * *

**Status Code**: 404 - [NonFound](/content/api/components?id&#x3D;responsesnonfound)

* * *

