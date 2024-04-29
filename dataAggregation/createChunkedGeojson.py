import json

# done by hand
countyGroups = {
    1: ["Lyon", "Sioux", "Osceola", "Obrien"],
    2: ["Dickinson", "Emmet", "Clay", "Palo Alto"],
    3: ["Kossuth", "Winnebago", "Hancock"],
    4: ["Worth", "Mitchell", "Cerro Gordo", "Floyd"],
    5: ["Howard", "Chickasaw", "Winneshiek", "Allamakee"],
    6: ["Fayette", "Clayton", "Black Hawk", "Buchanan"],
    7: ["Franklin", "Butler", "Bremer", "Grundy"],
    8: ["Humboldt", "Wright", "Webster", "Hamilton"],
    9: ["Buena Vista", "Pocahontas", "Sac", "Calhoun"],
    10: ["Plymouth", "Cherokee", "Woodbury", "Ida"],
    11: ["Monona", "Crawford", "Harrison", "Shelby"],
    12: ["Carroll", "Greene", "Audubon", "Guthrie"],
    13: ["Hardin", "Boone", "Story", "Marshall"],
    14: ["Tama", "Benton", "Poweshiek", "Iowa"],
    15: ["Delaware", "Dubuque", "Linn", "Jones"],
    16: ["Cedar", "Jackson", "Clinton", "Scott"],
    17: ["Johnson", "Washington", "Muscatine", "Louisa"],
    18: ["Henry", "Des Moines", "Lee", "Van Buren"],
    19: ["Keokuk", "Wapello", "Jefferson", "Davis"],
    20: ["Jasper", "Marion", "Mahaska", "Monroe"],
    21: ["Lucas", "Decatur", "Wayne", "Appanoose"],
    22: ["Polk", "Dallas", "Madison", "Warren"],
    23: ["Union", "Clarke", "Taylor", "Ringgold"],
    24: ["Cass", "Adair", "Montgomery", "Adams"],
    25: ["Fremont", "Page", "Pottawattamie", "Mills"],
}

# from data extraction
popSums = {
    1: 68659,
    2: 52653,
    3: 35409,
    4: 75465,
    5: 54689,
    6: 187618,
    7: 61675,
    8: 73069,
    9: 46853,
    10: 150547,
    11: 50938,
    12: 45217,
    13: 181995,
    14: 77226,
    15: 366507,
    16: 258439,
    17: 233169,
    18: 96686,
    19: 69599,
    20: 101054,
    21: 35148,
    22: 696373,
    23: 32011,
    24: 33999,
    25: 129317,
}
# from data extraction
activeDem = {
    1: 2959,
    2: 5773,
    3: 3980,
    4: 10569,
    5: 8090,
    6: 28566,
    7: 6723,
    8: 8160,
    9: 3890,
    10: 13550,
    11: 4895,
    12: 5570,
    13: 26685,
    14: 10044,
    15: 66112,
    16: 38509,
    17: 47755,
    18: 13992,
    19: 9460,
    20: 11610,
    21: 3379,
    22: 121099,
    23: 2927,
    24: 2961,
    25: 13752,
}
# from data extraction
activeRepub = {
    1: 25990,
    2: 14225,
    3: 9779,
    4: 14319,
    5: 11665,
    6: 29337,
    7: 15390,
    8: 15628,
    9: 10937,
    10: 29846,
    11: 12693,
    12: 11492,
    13: 29506,
    14: 16536,
    15: 58218,
    16: 43235,
    17: 28427,
    18: 17406,
    19: 12405,
    20: 24346,
    21: 8536,
    22: 107315,
    23: 8234,
    24: 9606,
    25: 29462,
}

geojson_file = "Iowa_County_Boundaries.json"

newFeatures = []

i = 0
with open(geojson_file, "r") as f:
    data = json.load(f)
    for d in data["features"]:
        i += 1
    for c in countyGroups:
        newFeature = {"type": "Feature", "geometry": {}, "properties": {}}
        props = {
            "chunkID": c,
            "pop": popSums[c],
            "demPop": activeDem[c],
            "repubPop": activeRepub[c],
        }
        coords = []
        for d in data["features"]:
            if d["properties"]["CountyName"] in countyGroups[c]:
                coords.append(d["geometry"]["coordinates"][0])

        newFeature["properties"] = props
        newFeature["geometry"] = {"type": "Polygon", "coordinates": coords}
        newFeatures.append(newFeature)

    merged_geojson = {"type": "FeatureCollection", "features": newFeatures}

print(i)

output_geojson_file = "chunks.json"


# Write merged GeoJSON to file
with open(output_geojson_file, "w") as f:
    json.dump(merged_geojson, f)
