#!/usr/bin/python3
""""view for Amenity-Place relationship """

from flask import jsonify, abort, request, make_response
from api.v1.views import app_views
from models import storage
from models.amenity import Amenity
from models.place import Place


@app_views.route("/places/<place_id>/amenities")
def get_amenities(place_id=None):
    """Retrieves the list of all Amenity objects of a Place"""
    place = storage.get("Place", place_id)
    if not place:
        abort(404)
    return jsonify([amenity.to_dict() for amenity in place.amenities])


@app_views.route("/places/<place_id>/amenities/<amenity_id>",
                 methods=["DELETE"])
def delete_amenity_of_place(place_id, amenity_id):
    """Deletes a Amenity object to a Place"""
    place = storage.get("Place", place_id)
    if not place:
        abort(404)

    amenity = storage.get("Amenity", amenity_id)
    if not amenity:
        abort(404)

    if not any([place_amenity.id == amenity.id
                for place_amenity in place.amenities]):
        abort(404)

    for index, place_amenity in enumerate(place.amenities):
        if place_amenity.id == amenity.id:
            del place.amenities[index]

    storage.save()
    return jsonify({}), 200


@app_views.route("/places/<place_id>/amenities/<amenity_id>", methods=["POST"])
def link_amenity_to_place(place_id, amenity_id):
    """Link a Amenity object to a Place"""
    place = storage.get("Place", place_id)
    if not place:
        abort(404)

    amenity = storage.get("Amenity", amenity_id)
    if not amenity:
        abort(404)

    if any([place_amenity.id == amenity.id
            for place_amenity in place.amenities]):
        return jsonify(amenity.to_dict()), 200

    place.amenities.append(amenity)
    storage.save()
    return jsonify(amenity.to_dict()), 200
