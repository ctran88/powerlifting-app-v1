from pymongo import MongoClient

# Global MongoDB client variables
mongo_uri = 'mongodb://admin:TPNadmin01@0.0.0.0/tpn?authSource=admin'
mongo_client = MongoClient(mongo_uri)
mongo_db = mongo_client.tpn
mongo_libraries = mongo_db.libraries

# Global defaults
main_defaults = {
    'type': 'main',
    'list': [
        'squat',
        'bench press',
        'deadlift'
    ]
}

main_variation_defaults = {
    'type': 'variations',
    'list': [
        'low bar',
        'high bar',
        'front',
        'ssb',
        'duffalo',
        'pause',
        '1-ct pause',
        'tempo',
        'pin',
        'tng',
        'close grip',
        'wide grip',
        'board',
        'conventional',
        'sumo',
        'sldl',
        'snatch grip',
        'deficit',
        'block'
    ]
}

accessory_defaults = {
    'type': 'accessories',
    'list': [
        'romanian deadlift',
        'hip thrust',
        'overhead press'
    ]
}


# Populate library collection wwith default exercises
def populate_libraries(defaults):
    mongo_libraries.insert(defaults)


def main():
    mongo_libraries.drop()
    populate_libraries(main_defaults)
    populate_libraries(main_variation_defaults)
    populate_libraries(accessory_defaults)

    mongo_client.close()
    print("Populated.")


if __name__ == "__main__":
    main()
