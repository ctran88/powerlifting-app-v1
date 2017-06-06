from pymongo import MongoClient

# Global MongoDB client variables
mongo_uri = 'mongodb://admin:TPNadmin01@0.0.0.0/tpn?authSource=admin'
mongo_client = MongoClient(mongo_uri)
mongo_db = mongo_client.tpn
mongo_library = mongo_db.library

# Global defaults
main_variation_defaults = {
    'type': 'mainVariation',
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
        'board',
        'conventional',
        'sumo',
        'sldl',
        'snatch grip',
        'deficit',
        'block'
    ]
}


# Executes sql query and returns the results array
def populate_library(defaults):
    mongo_library.insert(defaults)


def main():
    populate_library(main_variation_defaults)

    mongo_client.close()
    print("Populated.")


if __name__ == "__main__":
    main()
