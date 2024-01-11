# AirBnB clone - RESTful API
`Airbnb_clone_v3` is an enhanced version of the original [Airbnb_clone_v2](https://github.com/obimbasmart/AirBnB_clone_v2) repository, now featuring a RESTful API for seamless manipulation of objects stored in the system. This version introduces a user-friendly JSON web interface, providing a convenient way to interact with and manage your stored data.

## API Documentation:
The following are valid resources and endpoints:

Root Domain Name (for development): `localhost:5000/api/v1/`
- `.../api/v1/status` - return the status of the API
- `.../api/v1/stats` - retrieves the number of each objects by type

- ### State
    -  Retrieves the list of all State objects: `GET .../api/v1/states`
    -  Retrieves a State object: `GET .../api/v1/states/<state_id>`
    -  Deletes a State object:: `DELETE .../api/v1/states/<state_id>`
    -  Creates a State: `POST /api/v1/states`
        - dictionary must contain the key `name`
    -  Updates a State object: `PUT /api/v1/states/<state_id>`

- ### City
    - Retrieves the list of all City objects of a State: `GET /api/v1/states/<state_id>/cities`
    - Retrieves a City object. : `GET /api/v1/cities/<city_id>`
    - Deletes a City object: `DELETE /api/v1/cities/<city_id>`
    - Creates a City: `POST /api/v1/states/<state_id>/cities`
        - dictionary must contain the key `name`
    - Updates a City object: `PUT /api/v1/cities/<city_id>`

- ### Amenity
    - Retrieves the list of all Amenity objects: `GET /api/v1/amenities`
    - Retrieves a Amenity object: `GET /api/v1/amenities/<amenity_id>`
    - Deletes a Amenity object:: `DELETE /api/v1/amenities/<amenity_id>`
    - Creates a Amenity: `POST /api/v1/amenities`
        - dictionary must contain the key name
    - Updates a Amenity object: `PUT /api/v1/amenities/<amenity_id>`

- ### User
    - Retrieves the list of all User objects: `GET /api/v1/users`
    - Retrieves a User object: `GET /api/v1/users/<user_id>`
    - Deletes a User object:: `DELETE /api/v1/users/<user_id>`
    - Creates a User: `POST /api/v1/users`
    - Updates a User object: `PUT /api/v1/users/<user_id>`

- ### Place
    - Retrieves the list of all Place objects of a City: `GET /api/v1/cities/<city_id>/places`
    - Retrieves a Place object. : `GET /api/v1/places/<place_id>`
    - Deletes a Place object: `DELETE /api/v1/places/<place_id>`
    - Creates a Place: `POST /api/v1/cities/<city_id>/places`
    - Updates a Place object: `PUT /api/v1/places/<place_id>`

- ### Reviews
    - Retrieves the list of all Review objects of a Place: `GET /api/v1/places/<place_id>/reviews`
    - Retrieves a Review object. : `GET /api/v1/reviews/<review_id>`
    - Deletes a Review object: `DELETE /api/v1/reviews/<review_id>`
    - Creates a Review: `POST /api/v1/places/<place_id>/reviews`
    - Updates a Review object: `PUT /api/v1/reviews/<review_id>`

- ### Place-Amenity
    - Retrieves the list of all Amenity objects of a Place: `GET /api/v1/places/<place_id>/amenities`
    - Deletes a Amenity object to a Place: `DELETE /api/v1/places/<place_id>/amenities/<amenity_id>`
    - Link a Amenity object to a Place: `POST /api/v1/places/<place_id>/amenities/<amenity_id>`


## Examples of use
```bash
obimbasmart@MyXubuntu:~$ curl -X GET localhost:5000/api/v1/status
{
  "status": "OK"
}
obimbasmart@MyXubuntu:~$ curl -X GET localhost:5000/api/v1/stats
{
  "amenities": 47,
  "cities": 39,
  "places": 154,
  "reviews": 718,
  "states": 16,
  "users": 70
}
obimbasmart@MyXubuntu:~$ curl -X GET localhost:5000/api/v1/states
[
  {
    "__class__": "State",
    "created_at": "2017-03-25T02:17:06",
    "id": "0e391e25-dd3a-45f4-bce3-4d1dea83f3c7",
    "name": "Alabama",
    "updated_at": "2017-03-25T02:17:06"
  },
  {
    "__class__": "State",
    "created_at": "2017-03-25T02:17:06",
    "id": "10098698-bace-4bfb-8c0a-6bae0f7f5b8f",
    "name": "Oregon",
    "updated_at": "2017-03-25T02:17:06"
  },
  .
  .
  .

]
obimbasmart@MyXubuntu:~$ curl -X GET localhost:5000/api/v1/states/0e391e25-dd3a-45f4-bce3-4d1dea83f3c7
{
  "__class__": "State",
  "created_at": "2017-03-25T02:17:06",
  "id": "0e391e25-dd3a-45f4-bce3-4d1dea83f3c7",
  "name": "Alabama",
  "updated_at": "2017-03-25T02:17:06"
}
obimbasmart@MyXubuntu:~$ curl  -X POST  localhost:5000/api/v1/states -H "Content-Type: application/json" -d '{"name": "California"}'
{
  "__class__": "State",
  "created_at": "2024-01-11T19:10:27.465477",
  "id": "54d4281d-1075-486e-b3d3-82daf8ae6954",
  "name": "California",
  "updated_at": "2024-01-11T19:10:27.465508"
}
obimbasmart@MyXubuntu:~$
```

## Bugs
Currently, the User object is designed to store the user password in cleartext.
It’s super bad! Each time a new User object is created or password updated, the password should be hashed to a MD5 value - `hashlib.md5()`

## Original Authors
- Alexa Orrico - [Github](https://github.com/alexaorrico) / [Twitter](https://twitter.com/alexa_orrico)  
- Jennifer Huang - [Github](https://github.com/jhuang10123) / [Twitter](https://twitter.com/earthtojhuang)

## REST API Authors
- Obimba smart - [Github](https://github.com/obimbasmart)
- Oluwatobi Akinlola - [Github](https://github.com/itsoluwatobby)

## License
Public Domain. No copy write protection. 
