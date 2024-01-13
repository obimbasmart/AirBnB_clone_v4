#!/usr/bin/python3
"""Place object api resource view"""

from flask import jsonify, abort, make_response, request
from api.v1.views import app_views
from models import storage
from models.place import Place


@app_views.route("/cities/<city_id>/places")
def all_places(city_id):
    """retrieves all Place objects by class name"""
    if not storage.get('City', city_id):
        abort(404)

    places = []
    for place in storage.all('Place').values():
        if place.city_id == city_id:
            places.append(place.to_dict())
    return jsonify(places)


@app_views.route("/places/<place_id>")
def place(place_id):
    """retrieves the number of each objects by place_id"""
    place = storage.get("Place", place_id)
    if not place:
        abort(404)
    return jsonify(place.to_dict())


@app_views.route("/places/<place_id>", methods=['DELETE'])
def delete_place(place_id):
    """retrieves the number of each objects by place_id"""
    place = storage.get("Place", place_id)
    if not place:
        abort(404)
    storage.delete(place)
    storage.save()
    return make_response(jsonify({}), 200)


@app_views.route("/cities/<city_id>/places", methods=["POST"])
def create_place(city_id):
    '''Create a Place object with city_id'''
    city = storage.get("City", city_id)
    if not city:
        abort(404)

    place_data = request.get_json(silent=True)
    if not place_data:
        abort(400, description="Not a JSON")

    if "user_id" not in place_data:
        abort(400, description="Missing user_id")

    user = storage.get("User", place_data["user_id"])
    if not user:
        abort(404)

    if "name" not in place_data:
        abort(400, description="Missing name")

    place = Place(name=place_data["name"],
                  city_id=city_id, user_id=place_data["user_id"])
    place.save()
    return make_response(jsonify(place.to_dict()), 201)


@app_views.route("/places/<place_id>", methods=['PUT'])
def update_place(place_id):
    '''Updates the target place with the corressponding id'''
    place = storage.get("Place", place_id)
    if not place:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    for k, v in request.get_json().items():
        if k == "id" or k == "created_at" or k == "updated_at"\
                or k == "user_id" or k == "city_id":
            continue
        else:
            setattr(place, k, v)
    storage.save()
    return make_response(jsonify(place.to_dict()), 200)


@app_views.route("/places_search", methods=["POST"])
def get_place_by_filter():
    """that retrieves all Place objects
    depending of the JSON in the body of the request."""
    all_places = storage.all(Place).values()
    request_data = request.get_json(silent=True)
    place_filter = []

    if request_data is None:
        abort(400, "Not a JSON")

    state_ids = request_data.get("states")
    if state_ids:
        place_filter = filter_place_by_state_ids(all_places, state_ids)

    city_ids = request_data.get("cities")
    if city_ids:
        place_filter.extend(filter_place_by_city_ids(all_places, city_ids))

    amenity_ids = request_data.get("amenities")
    if amenity_ids:
        place_filter += filter_place_by_amenity_ids(all_places, amenity_ids)

    if place_filter:
        return jsonify([place for place in place_filter])
    return jsonify([place.to_dict() for place in all_places])


def filter_place_by_amenity_ids(all_places, amenity_ids):
    """return Place objects having all listed amenities"""
    place_by_amenity_ids = []
    for place in all_places:
        place_amenity_list_id = [amenity.to_dict()["id"]
                                 for amenity in place.amenities]
        if all([amenity_id in place_amenity_list_id for amenity_id in amenity_ids]):
            place_by_amenity_ids.append(place.to_dict())

    for place in place_by_amenity_ids:
        del place["amenities"]

    return place_by_amenity_ids


def filter_place_by_state_ids(all_places, state_ids):
    """return all Place objects for each State id listed"""
    places_by_state_id = []
    for state_id in state_ids:
        state = storage.get("State", state_id)
        cities = state.cities
        for city in cities:
            places_by_state_id.extend(city.places)
    return [place.to_dict() for place in places_by_state_id]


def filter_place_by_city_ids(all, city_ids):
    """return all Place objects for each City id in @city_ids"""
    places_by_city_id = []
    [places_by_city_id.extend(storage.get("City", city_id).places)
     for city_id in city_ids
     if storage.get("City", city_id)]

    return [city.to_dict() for city in places_by_city_id]
