goog.require('osml');
goog.require('goog.string.format');
goog.provide('osml.widgets.Widget');
goog.provide('osml.widgets.HtmlWidget');
goog.provide('osml.widgets.Title');
goog.provide('osml.widgets.Address');
goog.provide('osml.widgets.Phone');
goog.provide('osml.widgets.Email');
goog.provide('osml.widgets.Fax');
goog.provide('osml.widgets.Twitter');
goog.provide('osml.widgets.Facebook');
goog.provide('osml.widgets.Wikipedia');
goog.provide('osml.widgets.BrowseOsm');
goog.provide('osml.widgets.ViewOsm');
goog.provide('osml.widgets.ViewGoogle');
goog.provide('osml.widgets.ViewBing');
goog.provide('osml.widgets.ViewMtM');
goog.provide('osml.widgets.ViewMapillary');
goog.provide('osml.widgets.EditJosm');
goog.provide('osml.widgets.EditOnline');
goog.provide('osml.widgets.Directions');
goog.provide('osml.widgets.TabPane');
goog.provide('osml.widgets.Tab');
goog.provide('osml.widgets.WidgetGroup');


/**
 * osml.widgets namespace
 */
osml.widgets = osml.widgets || {};

/**
 * Basic widget. This is the base class for all widgets
 * @constructor
 */
osml.widgets.Widget = function() {
    this.html = '';
    this.active = false;
};
/**
 * Prepare the widget for rendering.
 * The preparation step provides the possibility to flag tags as used.
 * Used tags can be omitted in other widgets while rendering.
 * @param {osmlx.FeatureData} data
 */
osml.widgets.Widget.prototype.prepare = function(data) {
    return;
};
/**
 * Check if this widget should be rendered.
 * @returns {boolean}
 */osml.widgets.Widget.prototype.check = function() {
    return this.active;
};
/**
 * Render the widget.
 * Default behavior is to append this widgets html code to that of the parent.
 * When this method is overridden, rendering can also be done by adding DOM elements
 * to the parent element.
 *  
 * @param {Element} parent
 */osml.widgets.Widget.prototype.render = function(parent) {
    parent.innerHTML += this.html;
};
/**
 * Flag multiple tags as used, allowing other widgets to ignore that tag.
 * This method should be called from the prepare method.
 *  
 * @param {osmlx.FeatureData} data
 * @param tags
 */
osml.widgets.Widget.prototype.useTags = function(data, tags) {
    for (var i=0; i<tags.length; i++) {
        data.usedTags[tags[i]] = true;
    };
};
/**
 * Flag the widget as being active.
 * Active widgets will be rendered in the render fase.
 */
osml.widgets.Widget.prototype.setActive = function() {
    this.active = true;
};
/**
 * Set the html code for this widget and flag it as active.
 * 
 * @param {string} html
 */
osml.widgets.Widget.prototype.setHtml = function(html) {
    this.html = html;
    this.active = true;
};

/**
 * HtmlWidget. Simple widget using plain HTML code
 * @constructor
 * @extends osml.widgets.Widget
 * @param {{html: string}} options
 */
osml.widgets.HtmlWidget = function(options) {
    goog.base(this);
    this.setHtml(options.html);
};
goog.inherits(osml.widgets.HtmlWidget, osml.widgets.Widget);

/**
 * The title widget interacts with the Title preprocessor.
 * The widget renders the Title and Subtitle fields if available
 * 
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Title}
 */
osml.widgets.Title = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Title, osml.widgets.Widget);

osml.widgets.Title.prototype.prepare = function(data) {
    this.title = data.title;
    if (!this.title) {
        this.title = data.subTitle;
    }
    else {
        this.subTitle = data.subTitle;
    }
    var html = '';
    if (this.title) {
        this.useTags(data, ['name']);
        this.active = true;
        html += '<h2 class="title">' + this.title + '</h2>\n';
    };
    if (this.subTitle) {
        html += '<h3 class="subtitle">' + this.subTitle + '</h3>\n';
    };
    this.setHtml(html);
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Address}
 */
osml.widgets.Address = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Address, osml.widgets.Widget);

osml.widgets.Address.prototype.prepare = function(data) {
    var tags = data.tags;
    this.street = tags['addr:street'];
    this.number = tags['addr:housenumber'];
    if (this.street) {
        this.postcode = tags['addr:postcode'];
        this.city = tags['addr:city'];
        this.country = tags['addr:country'];
        this.useTags(data, ['addr:street', 'addr:housenumber',
             'addr:postcode', 'addr:city', 'addr:country']);
        this.setHtml(this.toHtml());
    };
},
osml.widgets.Address.prototype.toHtml = function() {
    var html = this.street + '&nbsp;' + 
        (this.number ? '&nbsp;' + this.number : '') + '<br />\n' +
        (this.postcode ? this.postcode + '&nbsp;&nbsp;' : '') +
        (this.city ? this.city : '') +
        (this.postcode || this.city ? '<br />\n' : '') +
        (this.country ? this.country + '<br />\n' : '');
    return '<div class="address">' + html + '</div>';
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @param {{type: string}} config
 * @returns {osml.widgets.Website}
 */
osml.widgets.Website = function(config) {
    goog.base(this);
    this.type = config.type;
    /** @type (string | undefined) */
    this.site;
};
goog.inherits(osml.widgets.Website, osml.widgets.Widget);

osml.widgets.Website.prototype.prepare = function(data) {
    this.site = data.tags[this.type];
    if (this.site) {
        this.useTags(data, [this.type]);
        var link = osml.makeLink(this.site, this.type);
        this.setHtml('<div class="website">' + link + '</div>');
    };
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Phone}
 */
osml.widgets.Phone = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Phone, osml.widgets.Widget);

osml.widgets.Phone.prototype.prepare = function(data) {
    this.phone = data.tags.phone;
    if (this.phone) {
        this.useTags(data, ['phone']);
        var link = osml.makeLink("tel:" + this.phone, this.phone);
        this.setHtml('<div class="phone">' + link + '</div>');
    }
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Email}
 */
osml.widgets.Email = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Email, osml.widgets.Widget);

osml.widgets.Email.prototype.prepare = function(data) {
    this.email = data.tags.email;
    if (this.email) {
        this.useTags(data, ['email']);
        var link = osml.makeLink("mailto:" + this.email, this.email);
        this.setHtml('<div class="email">' + link + '</div>');
    }
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Fax}
 */
osml.widgets.Fax = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Fax, osml.widgets.Widget);

osml.widgets.Fax.prototype.prepare = function(data) {
    this.fax = data.tags.fax;
    if (this.fax) {
        this.useTags(data, ['fax']);
        var link = osml.makeLink("fax:" + this.fax, this.fax);
        this.setHtml('<div class="fax">Fax:&nbsp;' + link + '</div>');
    }
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Twitter}
 */
osml.widgets.Twitter = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Twitter, osml.widgets.Widget);

osml.widgets.Twitter.prototype.prepare = function(data) {
    this.twitter = data.tags.twitter;
    if (this.twitter) {
        this.useTags(data, ['twitter']);
        var link = osml.makeLink('https://twitter.com/' + this.twitter, '@' + this.twitter);
        this.setHtml('<div class="twitter">Twitter:&nbsp;' + link + '</div>');
    }
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Facebook}
 */
osml.widgets.Facebook = function() {
    goog.base(this);
    /** @type (string | undefined) */
    this.fb;
};
goog.inherits(osml.widgets.Facebook, osml.widgets.Widget);

/**
 * @override
 */
osml.widgets.Facebook.prototype.prepare = function(data) {
    this.fb = data.tags['facebook'];
    if (this.fb) {
        this.useTags(data, ['facebook']);
        var link = '';
        if (this.fb.substr(0, 4) == 'http' || this.fb.substr(0, 3) == 'www'
            || this.fb.substr(0, 8) == 'facebook') {
            link = osml.makeLink(this.fb, this.fb);
        }
        else {
            link = osml.makeLink('https://www.facebook.com/' + this.fb, this.fb);
        };
        this.setHtml('<div class="facebook">Facebook:&nbsp;' + link + '</div>');
    }
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Wikipedia}
 */
osml.widgets.Wikipedia = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Wikipedia, osml.widgets.Widget);

osml.widgets.Wikipedia.prototype.prepare = function(data) {
    this.wiki = {};
    this.lang = '';
    var tags = data.tags;
    for (var key in tags) {
        if (key.substr(0, 9) == 'wikipedia') {
            this.wiki[key] = tags[key];
            this.useTags(data, [key]);
        };
    };
    var html = '';
    for (var key in this.wiki) {
        html = this.wikiToHtml(key);
    };
    if (html.length > 0) {
        this.setHtml(html);
    }
};
osml.widgets.Wikipedia.prototype.wikiToHtml = function(key) {
    var k = key.split(':');
    if (k.length == 2) {
        this.lang = k[1] + '.';
    }
    var value = this.wiki[key];
    var s = value.split(':'); // Subject
    if (s.length == 2) {
        this.lang = s[0] + '.';
        this.subject = s[1];
    } else {
        this.subject = value;
    }
    var href = 'http://' + this.lang + 'wikipedia.org/wiki/'
            + this.subject;
    return '<div class="wikipedia">' + osml.makeLink(href, 'Wikipedia') + '</div>';
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.BrowseOsm}
 */
osml.widgets.BrowseOsm = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.BrowseOsm, osml.widgets.Widget);

osml.widgets.BrowseOsm.prototype.prepare = function(data) {
    var url = goog.string.format('http://www.openstreetmap.org/browse/%s/%s/', data.type, data.id);
    var label = data.type + " " + data.id;
    this.setHtml(osml.makeLink(url, label));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @param config
 * @returns {osml.widgets.UnusedTags}
 */
osml.widgets.UnusedTags = function(config) {
    goog.base(this);
    this.format = config.format ? config.format : 'dl';
};
goog.inherits(osml.widgets.UnusedTags, osml.widgets.Widget);

osml.widgets.UnusedTags.prototype.prepare = function(data) {
    if (this.format === 'table') {
        this.setHtml(this.formatTable(data));
    }
    else {
        this.setHtml(this.formatDl(data));
    }
};
osml.widgets.UnusedTags.prototype.formatDl = function(data) {
    var html = '<dl>';
    $.each(data.tags, function(key, val) {
        if (!data.usedTags[key] && key != 'geometry') {
            var url = "http://wiki.openstreetmap.org/wiki/Key:}" + key;
            var link = osml.makeLink(url, key);
            html += goog.string.format('<dt>%s</dt><dd>%s</dd>\n', link, val);
        }
    });
    html += '</dl>';
    return html;
};
osml.widgets.UnusedTags.prototype.formatTable = function(data) {
    var html = '<table>';
    $.each(data.tags, function(key, val) {
        if (!data.usedTags[key] && key != 'geometry') {
            var url = "http://wiki.openstreetmap.org/wiki/Key:" + key;
            var link = osml.makeLink(url, key);
            html += goog.string.format('<tr><td>%s</td><td>%s</td></tr>\n', link, val);
        }
    });
    html += '</table>';
    return html;
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.ViewOsm}
 */
osml.widgets.ViewOsm = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.ViewOsm, osml.widgets.Widget);

osml.widgets.ViewOsm.prototype.prepare = function(data) {
    var params = {
        lat : data.lat,
        lon : data.lon,
        zoom : data.zoom
    };
    var url = osml.formatUrl('http://www.openstreetmap.org', params);
    this.setHtml(osml.makeLink(url, '<img src="/img/osm.gif">OSM'));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.ViewGoogle}
 */
osml.widgets.ViewGoogle = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.ViewGoogle, osml.widgets.Widget);

osml.widgets.ViewGoogle.prototype.prepare = function(data) {
    var params = {
        ll : data.lat + ',' + data.lon,
        zoom : data.zoom,
        t : 'h'
    };
    var url = osml.formatUrl('https://maps.google.nl/maps', params);
    this.setHtml(osml.makeLink(url, '<img src="/img/google.gif">Google'));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.ViewBing}
 */
osml.widgets.ViewBing = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.ViewBing, osml.widgets.Widget);

osml.widgets.ViewBing.prototype.prepare = function(data) {
    var params = {
        v : '2',
        cp : data.lat + '~' + data.lon,
        lvl : data.zoom,
        dir : '0',
        sty : 'h',
        form : 'LMLTCC'
    };
    var url = osml.formatUrl('http://www.bing.com/maps/', params);
    this.setHtml(osml.makeLink(url, '<img src="/img/bing.gif">Bing'));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.ViewMtM}
 */
osml.widgets.ViewMtM = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.ViewMtM, osml.widgets.Widget);

osml.widgets.ViewMtM.prototype.prepare = function(data) {
    var params = {
        map : 'roads',
        zoom : data.zoom,
        lat : data.lat,
        lon : data.lon,
        layers : 'B000000FFFFFFFFFFFFTFF'
    };
    var url = osml.formatUrl('http://mijndev.openstreetmap.nl/~allroads/mtm/', params);
    this.setHtml(osml.makeLink(url, '<img src="/img/osm.gif">MtM'));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.ViewUnesco}
 */
osml.widgets.ViewUnesco = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.ViewUnesco, osml.widgets.Widget);

osml.widgets.ViewUnesco.prototype.prepare = function(data) {
    this.ref_whc = data.tags['ref:whc'];
    if (this.ref_whc) {
        var url = 'http://whc.unesco.org/en/list/' + this.ref_whc;
        this.setHtml(osml.makeLink(url, 'UNESCO world heritage'));
        this.useTags(data, 'ref:whc');
    }
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.ViewMapillary}
 */
osml.widgets.ViewMapillary = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.ViewMapillary, osml.widgets.Widget);

osml.widgets.ViewMapillary.prototype.prepare = function(data) {
    var lat = data.lat;
    var lon = data.lon;
    var url = goog.string.format('http://www.mapillary.com/map/im/bbox/%s/%s/%s/%s',
        (lat - 0.005), (lat + 0.005), (lon - 0.005), (lon + 0.005));
    this.setHtml(osml.makeLink(url, '<img src="/img/mapillary.png">Mapillary'));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.EditJosm}
 */
osml.widgets.EditJosm = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.EditJosm, osml.widgets.Widget);

osml.widgets.EditJosm.prototype.prepare = function(data) {
    var area = 0.002; // was 0.01
    var top = data.lat + area;
    var left = data.lon - area;
    var params = {
        top : top,
        bottom : top - (2 * area),
        left : left,
        right : left + (2 * area),
        select : data.type + data.id
    };
    var url = osml.formatUrl('http://localhost:8111/load_and_zoom', params);
    this.setHtml(osml.makeLink(url, 'JOSM', this.getIFrame()));
};
osml.widgets.EditJosm.prototype.getIFrame = function() {
    var iFrame = document.body.querySelector("iframe[name='josm_frame']"); 
    if (!iFrame) {
        iFrame = document.createElement('iframe');
        iFrame.setAttribute('style', 'display:none');
        iFrame.setAttribute('height', '0');
        iFrame.setAttribute('width', '0');
        iFrame.setAttribute('name', 'josm_frame');
        document.body.appendChild(iFrame);
    };
    return 'josm_frame';
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @param config
 * @returns {osml.widgets.EditOnline}
 */osml.widgets.EditOnline = function(config) {
    goog.base(this);
    this.editor = config.editor;
};
goog.inherits(osml.widgets.EditOnline, osml.widgets.Widget);

osml.widgets.EditOnline.prototype.prepare = function(data) {
    var params = {
        editor : this.editor,
        lon : data.lon,
        lat : data.lat,
        zoom : data.zoom
    };
    var name = (this.editor == 'id' ? 'ID&nbsp;editor' : 'Potlatch&nbsp2');
    var url = osml.formatUrl('http://www.openstreetmap.org/edit', params);
    this.setHtml(osml.makeLink(url, name));
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @returns {osml.widgets.Directions}
 */osml.widgets.Directions = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.Directions, osml.widgets.Widget);

osml.widgets.Directions.prototype.prepare = function(data) {
    this.lonTo = data.lon;
    this.latTo = data.lat;
    this.setActive();
},
osml.widgets.Directions.prototype.render = function(parent) {
    var doc = parent.ownerDocument;
    var a = doc.createElement('a');
    a.setAttribute('href', '#');
    a.innerHTML = 'Get directions';
    parent.appendChild(a);
    $(a).on('click', this, this.onclick);
};
osml.widgets.Directions.prototype.onclick = function(e, data) {
    var self = e.data;
    var url = goog.string.format('http://www.openstreetmap.org/directions?engine=osrm_car&route=;%s,%s', self.latTo, self.lonTo);
    window.open(url);
//    var self = e.data;
//    navigator.geolocation.getCurrentPosition(function (position) {
//        self.getDirections(position.coords);
//    });
};
//osml.widgets.Directions.prototype.callback = function(result) {
//    if (typeof result == 'Position') {
//        var latFrom = result.coords.lattitude;
//        var lonFrom = result.coords.longitude;
//        var url = goog.string.format('http://www.openstreetmap.org/directions?engine=osrm_car&route=%s,%s;%s,%s',
//            latFrom, lonFrom, this.latTo, this.lonTo);
//    };
//};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @param tabData
 * @returns {osml.widgets.TabPane}
 */
osml.widgets.TabPane = function(tabData) {
    goog.base(this);
    this.tabData = tabData;
};
goog.inherits(osml.widgets.TabPane, osml.widgets.Widget);

osml.widgets.TabPane.prototype.prepare = function(data) {
    this.tabs = [];
    for (var i = 0; i<this.tabData.tabs.length; i++) {
        var tabConfig = this.tabData.tabs[i];
        this.tabs[i] = new osml.widgets.Tab(tabConfig);
        this.tabs[i].prepare(data);
    }
};
osml.widgets.TabPane.prototype.check = function() {
    var check = false;
    for (var i = 0; i<this.tabs.length; i++) {
        check = check || this.tabs[i].check();
    };
    return check;
};
osml.widgets.TabPane.prototype.render = function(parent) {
    var ul = document.createElement('ul');
    parent.appendChild(ul);
    for (var i = 0; i<this.tabs.length; i++) {
        var tab = this.tabs[i];
        if (tab.check()) {
            var li = document.createElement('li');
            li.innerHTML = '<a href="#' + tab.id + '">' + tab.name + '</a>';
            parent.firstChild.appendChild(li);
            var tabDiv = document.createElement('div');
            tabDiv.id = tab.id;
            tabDiv.setAttribute('class', tab['class']);
            tab.render(tabDiv);
            parent.appendChild(tabDiv);
        }
    };
    if ($(parent).filter(".ui-tabs").length > 0) {
        $(parent).tabs("destroy");
    };
    $(parent).tabs();
};

/**
 * @constructor
 * @extends osml.widgets.Widget
 * @param options
 * @returns {osml.widgets.Tab}
 */
osml.widgets.Tab = function(options) {
    goog.base(this);
    this.name = options.name;
    this.id = options.id;
    this['class'] = options.cssClass;
    this.contentConfig = options.contentConfig;
};
goog.inherits(osml.widgets.Tab, osml.widgets.Widget);

osml.widgets.Tab.prototype.prepare = function(data) {
    this.contentWidget = osml.widgets.createWidget(this.contentConfig);
    this.contentWidget.prepare(data);
};
osml.widgets.Tab.prototype.check = function() {
    return this.contentWidget.check();
};
osml.widgets.Tab.prototype.render = function(parent) {
    this.contentWidget.render(parent);
};

/**
 * Widget composed of a group of other widgets
 * @constructor
 * @extends osml.widgets.Widget
 * @param {Object} widgetCfg
 *     widget configuration
 *   format:
 *     'ul' : Wrap the widgets in a <ul><li> structure
 *     'div' : Wrap each widget in a <div> element and concatenate them
 *     'plain' : Just concatenate the widgets
 * @returns {osml.widgets.WidgetGroup}
 */
osml.widgets.WidgetGroup = function(widgetCfg) {
    goog.base(this);
    this.format = widgetCfg.format;
    var widgetsCfg = widgetCfg.widgets;
    this.widgets = [];
    for (var i=0; i<widgetsCfg.length; i++) {
        this.widgets.push(osml.widgets.createWidget(widgetsCfg[i]));
    };
};
goog.inherits(osml.widgets.WidgetGroup, osml.widgets.Widget);
osml.widgets.WidgetGroup.prototype.prepare = function(data) {
    for (var i = 0; i<this.widgets.length; i++) {
        this.widgets[i].prepare(data);
    }
},
osml.widgets.WidgetGroup.prototype.check = function() {
    var check = false;
    for (var i = 0; i<this.widgets.length; i++) {
        check = check || this.widgets[i].check();
    }
    return check;
};
osml.widgets.WidgetGroup.prototype.render = function(parent) {
    switch (this.format) {
    case 'plain':
        this.renderPlain(parent);
        break;
    case 'ul':
        this.renderUl(parent);
        break;
    }
};
osml.widgets.WidgetGroup.prototype.renderPlain = function(parent) {
    for (var i = 0; i<this.widgets.length; i++) {
        var widget = this.widgets[i];
        if (widget.check()) {
            widget.render(parent);
        };
    };
};
osml.widgets.WidgetGroup.prototype.renderUl = function(parent) {
    var ul = document.createElement('ul');
    parent.appendChild(ul);
    for (var i = 0; i<this.widgets.length; i++) {
        var widget = this.widgets[i];
        if (widget.check()) {
            var li = document.createElement('li');
            widget.render(li);
            ul.appendChild(li);
        };
    };
};

/**
 * @param widgetCfg (Object|String)
 *   Configuration object for a widget.
 *   The 'widgetType' property containing the full name of the widget is required.
 *   Some widgets require extra properties. The should be documented in the widgets' documentation.
 *   For widgets that don't require extra properties, widgetCfg can be provided as a
 *   string value containing the widget type.
 */
osml.widgets.createWidget = function(widgetCfg) {
    if (typeof widgetCfg === 'string') {
        widgetCfg = {widgetType : widgetCfg};
    }
    var widgetType = widgetCfg.widgetType;
    var path = widgetType.split('.');
    var fx = window;
    for (var i=0; i<path.length; i++) {
        fx = fx[path[i]];
        if (!fx) {
            return new osml.widgets.HtmlWidget({ 
                html: '<div>Missing widget: ' + widgetType +'</div>'
            });
        }
    };
    return new fx(widgetCfg);
};