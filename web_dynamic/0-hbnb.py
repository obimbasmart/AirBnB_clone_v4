#!/usr/bin/python3
"""starts a Flask web application"""

from flask import Flask, render_template
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place
from models.user import User

app = Flask(__name__)


@app.route("/0-hbnb", strict_slashes=False)
def show_filters():
    """display hbnb page"""
    states = get_object_from_storage(State)
    [state.cities.sort(key=lambda city: city.name) for state in states]

    amenities = get_object_from_storage(Amenity)
    places = get_object_from_storage(Place)
    users = [user for _, user in storage.all(User).items()]

    user_id_to_name = {
        user.id: f"{user.first_name} {user.last_name}" for user in users}
    [setattr(place, "owner", user_id_to_name[place.user_id])
     for place in places]
    return render_template("0-hbnb.html",
                           states=states, amenities=amenities,
                           places=places, cache_id="26872dc6-9dfa-4f19-94ef-3b3255e52c6d")


@app.teardown_appcontext
def close_db_connection(error=None):
    """close database connections"""
    storage.reload()
    storage.close()


def get_object_from_storage(klass):
    """get a sorted list of objects of instance @klass"""
    return sorted([obj for _, obj in storage.all(
        klass).items()], key=lambda obj: obj.name)


if __name__ == "__main__":
    app.run()
