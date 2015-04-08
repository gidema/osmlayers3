/**
 * Widgets for the Netherlands
 */
goog.require('osml.widgets.Widget');
goog.provide('osml.widgets.nl');
goog.provide('osml.widgets.nl.ViewBagViewer');
goog.provide('osml.widgets.nl.ViewOpenKvk');
goog.provide('osml.widgets.nl.ViewKvk');
goog.provide('osml.widgets.nl.ViewDeHollandseMolen');
goog.provide('osml.widgets.nl.ViewMolendatabase');
goog.provide('osml.widgets.nl.Departures');

// Add the namespace
osml.widgets.nl = osml.widgets.nl || {};

/**
 * Link to bagviewer. A website for viewing Dutch buildings and addresses.
 */
osml.widgets.nl.ViewBagViewer = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.nl.ViewBagViewer, osml.widgets.Widget);

osml.widgets.nl.ViewBagViewer.prototype.prepare = function(data) {
    this.bagId = data.tags['ref:bag'];
    this.pc = data.tags['addr:postcode'];
    this.housenr = data.tags['addr:housenumber'];
    if (this.bagId) {
        this.useTags(data, ['ref:bag']);
        this.setActive();
    }
    else if (this.pc && osml.widgets.nl.isDutchPostcode(this.pc) && this.housenr) {
        this.setActive();
    }
};
osml.widgets.nl.ViewBagViewer.prototype.render = function(parent) {
    var doc = parent.ownerDocument;
    var a = doc.createElement('a');
    a.setAttribute('href', '#');
    a.innerHTML = 'BAG Viewer';
    parent.appendChild(a);
    $(a).on('click', this, this.onclick);
};
osml.widgets.nl.ViewBagViewer.prototype.onclick = function(e, data) {
    var self = e.data;
    if (self.bagId) {
        // The id is known
        self.bagViewerId();
    }
    else {
        // Dutch postcode and housenr are known
        self.bagViewerPcHnr();
    };
};
osml.widgets.nl.ViewBagViewer.prototype.bagViewerId = function() {
    var params = {
        searchQuery : OpenLayers.Number.zeroPad(this.bagId, 16)
    };
    var url = osml.formatUrl('https://bagviewer.kadaster.nl/lvbag/bag-viewer/index.html#/', params);
    window.open(url);
};
osml.widgets.nl.ViewBagViewer.prototype.bagViewerPcHnr = function() {
    var numericHnr = parseInt(this.housenr);
    var params = {
        count : 10,
        offset : 0,
        searchQuery : this.pc.substr(0, 4) + '+' + this.pc.substr(4, 2) + '+' + numericHnr
    };
    var url = osml.formatUrl('https://bagviewer.kadaster.nl/lvbag/bag-viewer/api/search', params);
    $.getJSON(url, function(data, status, jqXHR) {
        if (status == 'succes') {
            var results = data.result;
            if (results.length == 1) {
                var result = results[0];
            }
        }
    });
};

/**
 * Link to Openkvk.nl. A Dutch open-source site for viewing chamber of commerce data.
 * Selection is currently only supported on postcode level. 
 */
osml.widgets.nl.ViewOpenKvk = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.nl.ViewOpenKvk, osml.widgets.Widget);

osml.widgets.nl.ViewOpenKvk.prototype.prepare = function(data) {
    this.pc = data.tags['addr:postcode'];
    if (this.pc && osml.widgets.nl.isDutchPostcode(this.pc)) {
        var url = 'https://openkvk.nl/zoeken/' + this.pc;
        this.setHtml(osml.makeLink(url, 'Open KvK (Chambre of commerce)'));
    }
};

/**
 * Link to the Dutch KvK (Chamber of commerce) site.
 * selection is based on postcode and housenumber
 * 
 */
osml.widgets.nl.ViewKvk = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.nl.ViewKvk, osml.widgets.Widget);

osml.widgets.nl.ViewKvk.prototype.prepare = function(data) {
    this.pc = data.tags['addr:postcode'];
    this.housenr = data.tags['addr:housenumber'];
    if (this.pc && osml.widgets.nl.isDutchPostcode(this.pc)) {
        var params = {
            q : this.pc + (this.housenr ? ' ' + this.housenr : '')
        };
        var url = osml.formatUrl('http://www.kvk.nl/orderstraat/', params);
        this.setHtml(osml.makeLink(url, 'KvK (Chambre of commerce)'));
    }
};

/**
 * Link to the (wind)mill site 'De hollandse Molen'
 * 
 * @param data
 * @returns {osml.widgets.ViewDeHollandseMolen}
 */
osml.widgets.nl.ViewDeHollandseMolen = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.nl.ViewDeHollandseMolen, osml.widgets.Widget);

osml.widgets.nl.ViewDeHollandseMolen.prototype.prepare = function(data) {
    this.dhm_id = data.tags['dhm_id'];
    if (this.dhm_id) {
        this.useTags(data, ['dhm_id']);
        var params = {
            v : '1',
            mid : this.dhm_id,
            molenid : this.dhm_id
        };
        var url = osml.formatUrl('http://www.molens.nl/site/dbase/molen.php', params);
        this.setHtml(osml.makeLink(url, 'De Hollandsche Molen'));
    }
};

osml.widgets.nl.ViewMolendatabase = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.nl.ViewMolendatabase, osml.widgets.Widget);

osml.widgets.nl.ViewMolendatabase.prototype.prepare = function(data) {
    this.mdb_id = data.tags['mdb_id'];
    if (this.mdb_id) {
        this.useTags(data, ['mdb_id']);
        var params = {
            nummer : this.mdb_id
        };
        var url = osml.formatUrl('http://www.molendatabase.nl/nederland/molen.php', params);
        this.setHtml(osml.makeLink(url, 'Molendatabase'));
    };
};

osml.widgets.nl.Departures = function() {
    goog.base(this);
};
goog.inherits(osml.widgets.nl.Departures, osml.widgets.Widget);

osml.widgets.nl.Departures.prototype.prepare = function(data) {
    var cxx = data.tags['cxx:code'];
    if (cxx && !isNaN(cxx)) {
        this.setActive();
        // Fetch the first code in case of multiple codes.
        cxx = cxx.split(';')[0];
        // Convert the code to a number to prevent JavaScript injection
        this.cxx = new Number(cxx);
        this.useTags(data, ['cxx:code']);
    };
};
osml.widgets.nl.Departures.prototype.render = function(parent) {
    var div = document.createElement('div');
    div.id ='departuresbutton';
    div.setAttribute('class', 'buttonclass');
    parent.appendChild(div);
    var button = document.createElement('button');
    button.innerHTML = 'Departures';
    div.appendChild(button);
    var self = this;
    button.addEventListener("click", function(event) {
        self.onClick(event);
    });
};
osml.widgets.nl.Departures.prototype.onClick = function(event) {
    var self = this;
    var url = 'http://v0.ovapi.nl/tpc/' + this.cxx;
    $.getJSON(url, function(data, status) {
        if (status == 'success') {
            var stop = data[self.cxx];
            var map = osml.site.map;
            // TODO Remove popup if closed.
            var popup = new osml.Popup( {
                popupId: 'departures',
                closeMode: 'delete',
                position: map.getView().getCenter()});
            popup.setHTML(self.getDeparturesHtml(stop));
            map.addOverlay(popup);
        };
    });
};
    // TODO Create departures Popup
osml.widgets.nl.Departures.prototype.getDeparturesHtml = function(data) {
    var html = '<h3>' + data.Stop.TimingPointName + ' (' + data.Stop.TimingPointCode + ')</h3>' +
        '<table>' +
        '<tr><th>Direction</th><th>Line</th><th>Departure</th></tr>';
    var timeTable = [];
    for (var key in data.Passes) {
        var pass = data.Passes[key];
        var tzOffset = (new Date().getTimezoneOffset() == -60 ? '+0100' : '+0200');
        timeTable.push({
            destination : pass.DestinationName50,
            lineNumber : pass.LinePublicNumber,
            departure : new Date(pass.ExpectedDepartureTime + tzOffset)
        });
    };
    // Sort the timeTable
    timeTable.sort(function(a, b) {
        if (a.departure == b.departure) return 0;
        return (a.departure < b.departure ? -1 : 1);
    });
    for (var i=0; i<timeTable.length; i++) {
        var row = timeTable[i];
        html += '<tr>';
        html += '<td>' + row.destination + '</td>';
        html += '<td>' + row.lineNumber + '</td>';
        html += '<td>' + row.departure.toLocaleTimeString() + '</td>';
        html += '</tr>';
    };
    html += '</table>';
    return html;
};

/**
 * Does the given postcode match the Dutch postcode format 
 */
osml.widgets.nl.isDutchPostcode = function(pc) {
    return pc.match('^[0-9]{4}[A-Z]{2}$');
};