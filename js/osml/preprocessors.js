goog.require('osml');
goog.provide('osml.preprocessors');
goog.provide('osml.preprocessors.Preprocessor');
goog.provide('osml.preprocessors.HideTagsPreprocessor');
goog.provide('osml.preprocessors.NamePreprocessor');
goog.provide('osml.preprocessors.AmenityPreprocessor');
goog.provide('osml.preprocessors.TourismPreprocessor');
goog.provide('osml.preprocessors.TagPreprocessor');

osml.preprocessors = osml.preprocessors || {};

/**
 * @constructor
 */
osml.preprocessors.Preprocessor = function() {};

/**
 * Preprocessor to handle the name tag.
 * Adds the name value to the title property in the data object and adds 'name' to the list
 * of used tags.
 * 
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @returns {osml.preprocessors.NamePreprocessor}
 */
osml.preprocessors.NamePreprocessor = function() {
};
goog.inherits(osml.preprocessors.NamePreprocessor, osml.preprocessors.Preprocessor);
osml.preprocessors.NamePreprocessor.prototype.process = function(data) {
    var name = data.tags['name'];
    if (name) {
        data.title = name;
        data.usedTags.name = true;
    }
};

/**
 * Preprocessor used for handling a specific tag.
 * The default behavior is to add the tag value to the subtitle property in the data
 * object and add the tag to the list of used tags
 * 
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @param {string} tag
 * @returns {osml.preprocessors.TagPreprocessor}
 */
osml.preprocessors.TagPreprocessor = function(tag) {
    this.tag = tag;
    this.value = null;
};
goog.inherits(osml.preprocessors.TagPreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.TagPreprocessor.prototype.process = function(data) {
    this.value = data.tags[this.tag];
    if (!this.value) return false;
    var value = osml.capitalizeFirst(this.value);
    value = value.replace('_', ' ');
    data.subTitle = value;
    data.usedTags[this.tag] = true;
    return true;
};

/**
 * Preprocessor that add a list of tags that won't be shown. For example because they
 * are considered uninteresting in a certain context.
 * 
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @param {Array} tags Tag names to be hidden;
 * @returns {osml.preprocessors.HideTagsPreprocessor}
 */
osml.preprocessors.HideTagsPreprocessor = function(tags) {
    this.tags = tags;
};
goog.inherits(osml.preprocessors.HideTagsPreprocessor, osml.preprocessors.Preprocessor);

goog.inherits(osml.preprocessors.HideTagsPreprocessor, osml.preprocessors.Preprocessor);
osml.preprocessors.HideTagsPreprocessor.prototype.process = function(data) {
    goog.array.forEach(this.tags, function(tag) {
        data.usedTags[tag] = true;
    });
};

/**
 * @constructor
 * @extends osml.preprocessors.TagPreprocessor
 * @returns {osml.preprocessors.AmenityPreprocessor}
 */osml.preprocessors.AmenityPreprocessor = function() {
    goog.base(this, 'amenity');
};
goog.inherits(osml.preprocessors.AmenityPreprocessor, osml.preprocessors.TagPreprocessor);

osml.preprocessors.AmenityPreprocessor.religionToBuilding = {
    'christian': 'Church',
    'muslim': 'Mosque',
    'scientologist': 'Church',
    'jewish': 'Synagogue',
    'buddhist': 'Temple',
    'hindu': 'Temple',
    'shinto': 'Shrine',
    'taoism': 'Temple',
    'sikh': 'Temple'
};

osml.preprocessors.AmenityPreprocessor.prototype.process = function(data) {
    if (!goog.base(this, 'process', data)) {
        return false;
    }
    switch (this.value) {
    case 'restaurant':
        var cuisine = data.tags['cuisine'];
        if (cuisine) {
            cuisine = osml.capitalizeFirst(cuisine);
            data.subTitle = cuisine + ' restaurant';
        }
        break;
    case 'place_of_worship':
        var religion = data.tags['religion'];
        if (religion) {
            var building = osml.preprocessors.AmenityPreprocessor.religionToBuilding[religion];
            if (building) {
                data.subTitle = building;
            }
            else {
                data.subTitle = osml.capitalizeFirst(religion) + ' place of worship';
            }
        }
    }
};

/**
 * @constructor
 * @extends osml.preprocessors.TagPreprocessor
 * @returns {osml.preprocessors.TourismPreprocessor}
 */osml.preprocessors.TourismPreprocessor = function() {
    goog.base(this, 'tourism');
};
goog.inherits(osml.preprocessors.TourismPreprocessor, osml.preprocessors.TagPreprocessor);

osml.preprocessors.TourismPreprocessor.prototype.process = function(data) {
    if (!goog.base(this, 'process', data)) {
        return false;
    }
    switch (this.value) {
    case 'Hotel':
        var stars = data.tags['stars'];
        if (stars) {
            data.subTitle += ' (' + stars + ' stars)';
        };
        break;
    case 'Information':
        var information = data.tags['information'];
        if (information) {
            if (information == 'guidepost') {
                data.subTitle = 'Guidepost';
            }
            else if (information == 'map') {
                data.subTitle = 'Map';
            }
            else {
                data.subTitle += ' (' + information + ')';
            }
        }
    }
};

/**
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @returns {osml.preprocessors.SportPreprocessor}
 */osml.preprocessors.SportPreprocessor = function() {};
goog.inherits(osml.preprocessors.SportPreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.SportPreprocessor.prototype.process = function(data) {
    var sport = data.tags['sport'];
    if (!sport) return;
    sport = osml.capitalizeFirst(sport);
    sport = sport.replace('_', ' ');
    data.subTitle = sport;
};

osml.preprocessors.ShopPreprocessor = function() {};
goog.inherits(osml.preprocessors.ShopPreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.ShopPreprocessor.prototype.process = function(data) {
    var shop = data.tags['shop'];
    if (!shop) return;
    shop = osml.capitalizeFirst(shop);
    shop = shop.replace('_', ' ');
    data.subTitle = shop;
};

/**
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @returns {osml.preprocessors.LeisurePreprocessor}
 */osml.preprocessors.LeisurePreprocessor = function() {};
goog.inherits(osml.preprocessors.LeisurePreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.LeisurePreprocessor.prototype.process = function(data) {
    var leisure = data.tags['leisure'];
    if (!leisure) return;
    leisure = osml.capitalizeFirst(leisure);
    leisure = leisure.replace('_', ' ');
    data.subTitle = leisure;
};

/**
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @returns {osml.preprocessors.HighwayPreprocessor}
 */osml.preprocessors.HighwayPreprocessor = function() {};
goog.inherits(osml.preprocessors.HighwayPreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.HighwayPreprocessor.prototype.process = function(data) {
    var highway = data.tags['highway'];
    if (!highway) return;
    highway = osml.capitalizeFirst(highway);
    highway = highway.replace('_', ' ');
    data.subTitle = highway;
};

/**
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @returns {osml.preprocessors.HistoricPreprocessor}
 */osml.preprocessors.HistoricPreprocessor = function() {};
goog.inherits(osml.preprocessors.HistoricPreprocessor, osml.preprocessors.Preprocessor);

/**
  * @param data
 */
osml.preprocessors.HistoricPreprocessor.prototype.process = function(data) {
    var historic = data.tags['historic'];
    if (!historic) return;
    historic = osml.capitalizeFirst(historic);
    historic = historic.replace('_', ' ');
    data.subTitle = historic;
};

/**
 * @constructor
 * @extends osml.preprocessors.Preprocessor
 * @returns {osml.preprocessors.ManMadePreprocessor}
 */
osml.preprocessors.ManMadePreprocessor = function() {};
goog.inherits(osml.preprocessors.ManMadePreprocessor, osml.preprocessors.Preprocessor);

osml.preprocessors.ManMadePreprocessor.prototype.process = function(data) {
    var manMade = data.tags['man_made'];
    if (!manMade) return;
    manMade = osml.capitalizeFirst(manMade);
    manMade = manMade.replace('_', ' ');
    data.subTitle = manMade;
};
