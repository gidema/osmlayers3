goog.require('osml');
goog.provide('osml.preprocessors');
goog.provide('osml.preprocessors.Preprocessor');

osml.preprocessors = osml.preprocessors || {};

osml.preprocessors.Preprocessor = function() {
    
};

osml.preprocessors.BasePreprocessor = function() {};
osml.preprocessors.BasePreprocessor.prototype.process = function(data) {
    var name = data.tags.name;
    if (name) {
        data.title = name;
    }
};

osml.preprocessors.AmenityPreprocessor = function() {};
goog.inherits(osml.preprocessors.AmenityPreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.AmenityPreprocessor.religionToBuilding = {
    'christian': 'Church',
    'muslim': 'Mosk',
    'scientologist': 'Church',
    'jewish': 'Synagogue',
    'buddhist': 'Temple',
    'hindu': 'Church',
    'shinto': 'Shrine',
    'taoism': 'Temple',
    'sikh': 'Temple'
};

osml.preprocessors.AmenityPreprocessor.prototype.process = function(data) {
    var amenity = data.tags.amenity;
    if (!amenity) return;
    amenity = osml.capitalizeFirst(amenity);
    amenity = amenity.replace('_', ' ');
    switch (amenity) {
    case 'Restaurant':
        var cuisine = data.tags.cuisine;
        if (cuisine) {
            cuisine = osml.capitalizeFirst(cuisine);
            data.subTitle = cuisine + ' restaurant';
        }
        else {
            data.subTitle = 'Restaurant';
        }
        break;
    case 'Place of worship':
        var religion = data.tags.religion;
        if (religion) {
            data.subTitle = osml.preprocessors.AmenityPreprocessor.religionToBuilding[religion];
            if (! building) {
                data.subTitle = osml.capitalizeFirst(religion) + ' place of worship';
            }
        }
        else {
            data.subTitle = 'Place of worship';
        }
    default: 
        data.subTitle = amenity;
    }
};

osml.preprocessors.TourismPreprocessor = function() {};
goog.inherits(osml.preprocessors.TourismPreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.TourismPreprocessor.prototype.process = function(data) {
    var tourism = data.tags.tourism;
    if (!tourism) return;
    tourism = osml.capitalizeFirst(tourism);
    tourism = tourism.replace('_', ' ');
    switch (tourism) {
    case 'Restaurant':
        var cuisine = data.tags.cuisine;
        if (cuisine) {
            cuisine = osml.capitalizeFirst(cuisine);
            data.subTitle = cuisine + ' restaurant';
        }
        else {
            data.subTitle = 'Restaurant';
        }
        break;
    case 'Place of worship':
        var religion = data.tags.religion;
        if (religion) {
            data.subTitle = osml.preprocessors.AmenityPreprocessor.religionToBuilding[religion];
            if (! building) {
                data.subTitle = osml.capitalizeFirst(religion) + ' place of worship';
            }
        }
        else {
            data.subTitle = 'Place of worship';
        }
    default: 
        data.subTitle = tourism;
    }
};
