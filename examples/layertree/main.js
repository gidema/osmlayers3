goog.require('osml');
goog.require('osml.Site');

$(document).ready(function () {
    var mapOptions = {
        div : 'map',
        lat : 52.09,
        lon : 5.12,
        zoom : 14,
        baseLayers : [ new ol.layer.Tile({
            style : 'Road',
            source : new ol.source.MapQuest({
                layer : 'osm'
            })
        }) ]
    };
    
    var popups = {
        'default': {
            id: 'defaultFeaturePopup',
            cssClass: 'featurePopup',
            definition: defaultPopupDefinition()
        }
    };

    var layerData = {
        osmBench : {
            name : 'Bench',
            query : 'amenity=bench',
            icon : 'letter_b.png'
        },
        osmPostbox : {
            name : 'Post box',
            query : 'amenity=post_box',
            icon : 'letter_p.png'
        },
        osmPostoffice : {
            name : 'Post office',
            query : 'amenity=post_office',
            icon : 'postal.png'
        },
        osmPharmacy : {
            name : 'Pharmacy',
            query : 'amenity=pharmacy',
            icon : 'medicalstore.png'
        },
        osmToilets : {
            name : 'Toilets',
            query : 'amenity=toilets',
            icon : 'toilets.png'
        },
        osmPolice : {
            name : 'Police',
            query : 'amenity=police',
            icon : 'police.png'
        },
        osmFireStation : {
            name : 'Fire station',
            query : 'amenity=fire_station',
            icon : 'firemen.png'
        },
        osmPlaceOfWorship : {
            name : 'Place of worship',
            query : 'amenity=place_of_worship',
            icon : 'church-2.png'
        },
        osmATM : {
            name : 'ATM',
            query : '[amenity=atm],[amenity=bank][atm][atm!=no]',
            icon : 'atm-2.png'
        },
        osmFuel : {
            name : 'Fuel',
            query : 'amenity=fuel',
            icon : 'fillingstation.png'
        },
        osmSchool : {
            name : 'School/College',
            query : '[amenity=school],[amenity=college]',
            icon : 'school.png'
        },
        osmUniversity : {
            name : 'University',
            query : 'amenity=university',
            icon : 'university.png'
        },
        osmBicycleparking : {
            name : 'Bicycle parking',
            query : 'amenity=bicycle_parking',
            icon : 'parking_bicycle-2.png'
        },
        osmBicyclerental : {
           name : 'Bicycle rental',
            query : 'amenity=bicycle_rental',
            icon : 'number_1.png'
        },
        osmTaxi : {
            name : 'Taxi',
            query : 'amenity=taxi',
            icon : 'taxi.png'
        },
        osmParking : {
            name : 'Parking',
            query : 'amenity=parking',
            icon : 'parkinggarage.png'
        },
        osmArtscentre : {
            name : 'Arts centre',
            query : 'amenity=arts_centre',
            icon : 'artgallery.png'
        },
        osmTheatre : {
            name : 'Theatre',
            query : 'amenity=theatre',
            icon : 'theater.png'
        },
        osmCinema : {
            name : 'Cinema',
            query : 'amenity=cinema',
            icon : 'cinema.png'
        },
        osmInformation : {
            name : 'Information',
            query : 'tourism=information',
            icon : 'information.png'
        },
        osmMuseum : {
            name : 'Museum',
            query : 'tourism=museum',
            icon : 'museum_art.png'
        },
        osmArtwork : {
            name : 'Artwork',
            query : 'tourism=artwork',
            icon : 'number_2.png'
        },
        osmGallery : {
            name : 'Gallery',
            query : 'tourism=gallery',
            icon : 'artgallery.png'
        },
        osmPicnic : {
            name : 'Picnic',
            query : 'tourism=picnic_site',
            icon : 'picnic-2.png'
        },
        osmZoo : {
            name : 'Zoo',
            query : 'tourism=zoo',
            icon : 'zoo.png'
        },
        osmViewpoint : {
            name : 'Viewpoint',
            query : 'tourism=viewpoint',
            icon : 'sight-2.png'
        },
        osmAttraction : {
            name : 'Attraction',
            query : 'tourism=attraction',
            icon : 'letter_a.png'
        },
        osmHotel : {
            name : 'Hotel',
            query : 'tourism=hotel',
            icon : 'hotel_0star.png'
        },
        osmApartment : {
            name : 'Apartment',
            query : 'tourism=apartment',
            icon : 'apartment-3.png'
        },
        osmGuesthouse : {
            name : 'Guest house',
            query : 'tourism=guest_house',
            icon : 'bed_breakfast1-2.png'
        },
        osmHostel : {
            name : 'Hostel',
            query : 'tourism=hostel',
            icon : 'hostel_0star.png'
        },
        osmMotel : {
            name : 'Motel',
            query : 'tourism=motel',
            icon : 'motel-2.png'
        },
        osmCampsite : {
            name : 'Camp site',
            query : 'tourism=camp_site',
            icon : 'camping-2.png'
        },
        osmSoccer : {
            name : 'Soccer',
            query : 'sport=soccer',
            icon : 'soccer.png'
        },
        osmUsFootball : {
            name : 'American football',
            query : 'sport=american_football',
            icon : 'usfootball.png'
        },
        osmGolf : {
            name : 'Golf',
            query : 'leisure=golf_course',
            icon : 'golfing.png'
        },
        osmTennis : {
            name : 'Tennis',
            query : 'sport=tennis',
            icon : 'tennis.png'
        },
        osmVolleybal : {
            name : 'Volleybal',
            query : 'sport=volleybal',
            icon : 'volleyball.png'
        },
        osmBaseball : {
            name : 'Baseball',
            query : 'sport=baseball',
            icon : 'baseball.png'
        },
        osmBasketball : {
            name : 'Basketball',
            query : 'sport=basketball',
            icon : 'basketball.png'
        },
        osmIcehockey : {
            name : 'Ice hockey',
            query : '[sport=ice_hockey],[leisure=ice_rink]',
            icon : 'icehockey.png'
        },
        osmHockey : {
            name : 'Hockey',
            query : '[sport=hockey],[sport=field_hockey]',
            icon : 'hockey.png'
        },
        osmCycling : {
            name : 'Cycling',
            query : 'sport=cycling',
            icon : 'cycling.png'
        },
        osmHorseracing : {
            name : 'Horse racing',
            query : '[sport=horse_racing],[sport=equestrian]',
            icon : 'horseriding.png'
        },
        osmSwimming : {
            name : 'Swimming',
            query : 'sport=swimming',
            icon : 'swimming.png'
        },
        osmSurfing : {
            name : 'Surfing',
            query : 'sport=surfing',
            icon : 'surfing.png'
        },
        osmGymnastics : {
            name : 'Gymnastics',
            query : 'sport=gymnastics',
            icon : 'indoor-arena.png'
        },
        osmMall : {
            name : 'Mall/Shopping centre',
            query : 'shop=mall',
            icon : 'mall.png'
        },
        osmOtherShop : {
            name : 'Other shop',
            query : 'shop=general',
            icon : 'letter_s.png'
        },
        osmDepartmentstore : {
            name : 'Department store',
            query : 'shop=department_store',
            icon : 'departmentstore.png'
        },
        osmClothes : {
            name : 'Clothes',
            query : 'shop=clothes',
            icon : 'clothers_male.png'
        },
        osmFashion : {
            name : 'Fashion',
            query : 'shop=fashion',
            icon : 'clothers_female.png'
        },
        osmJewelry : {
            name : 'Jewelry',
            query : 'shop=jewelry',
            icon : 'jewelry.png'
        },
        osmLeather : {
            name : 'Leather',
            query : 'shop=leather',
            icon : 'bags.png'
        },
        osmShoes : {
            name : 'Shoes',
            query : 'shop=shoes',
            icon : 'shoes.png'
        },
        osmHairdresser : {
            name : 'Hairdresser',
            query : 'shop=hairdresser',
            icon : 'barber.png'
        },
        osmBeauty : {
            name : 'Beauty',
            query : 'shop=beauty',
            icon : 'beautysalon.png'
        },
        osmCosmetics : {
            name : 'Cosmetics',
            query : 'shop=cosmetics',
            icon : 'perfumery.png'
        },
        osmChemist : {
            name : 'Chemist',
            query : 'shop=chemist',
            icon : 'chemistry-2.png'
        },
        osmOpticien : {
            name : 'Opticien',
            query : 'shop=optician',
            icon : 'ophthalmologist.png'
        },
        osmBooks : {
            name : 'Books/Stationary',
            query : '[shop=books],[shop=stationery]',
            icon : 'library.png'
        },
        osmPhoto : {
           name : 'Photo',
            query : 'shop=photo',
            icon : 'photography.png'
        },
        osmToys : {
            name : 'Toys',
            query : 'shop=toys',
            icon : 'toys.png'
        },
        osmGift : {
            name : 'Gift',
            query : 'shop=gift',
            icon : 'gifts.png'
        },
        osmBicycle : {
            name : 'Bicycle',
            query : 'shop=bicycle',
            icon : 'bicycle_shop.png'
        },
        osmMusicalinstruments : {
            name : 'Musical instruments',
            query : 'shop=musical_instrument',
            icon : 'music.png'
        },
        osmRestaurant : {
           name : 'Restaurant',
            query : 'amenity=restaurant',
            icon : 'restaurant.png'
        },
        osmBar : {
            name : 'Bar',
            query : 'amenity=bar',
            icon : 'bar.png'
        },
        osmCafe : {
            name : 'Cafe',
            query : 'amenity=cafe',
            icon : 'cafetaria.png'
        },
        osmPub : {
            name : 'Pub',
            query : 'amenity=pub',
            icon : 'bar.png'
        },
        osmIcecream : {
            name : 'Ice cream',
            query : 'amenity=ice_cream',
            icon : 'icecream.png'
        },
        osmFastfood : {
            name : 'Fast food',
            query : 'amenity=fast_food',
            icon : 'fastfood.png'
        },
        osmSupermarket : {
            name : 'Supermarket',
            query : 'shop=supermarket',
            icon : 'supermarket.png'
        },
        osmBakery : {
            name : 'Bakery',
            query : 'shop=bakery',
            icon : 'bread.png'
        },
        osmConfectionery : {
            name : 'Chocolate/Confectionery',
            query : '[shop=chocolate],[shop=confectionery]',
            icon : 'candy.png'
        },
        osmDeli : {
            name : 'Deli',
            query : 'shop=deli',
            icon : 'patisserie.png'
        },
        osmDairy : {
            name : 'Dairy',
            query : 'shop=dairy',
            icon : 'milk_and_cookies.png'
        },
        osmCheese : {
            name : 'Cheese',
            query : 'shop=cheese',
            icon : 'cheese.png'
        },
        osmGreengrocer : {
            name : 'Greengrocer',
            query : 'shop=greengrocer',
            icon : 'fruits.png'
        },
        osmGrocery : {
            name : 'Grocery',
            query : 'shop=grocery',
            icon : 'grocery.png'
        },
        osmButcher : {
            name : 'Butcher',
            query : 'shop=butcher',
            icon : 'butcher-2.png'
        },
        osmCoffee : {
            name : 'Coffee',
            query : 'shop=coffee',
            icon : 'coffee.png'
        },
        osmSeafood : {
            name : 'Seafood',
            query : 'shop=seafood',
            icon : 'restaurant_fish.png'
        },
        osmOrganic : {
            name : 'Organic',
            query : 'shop=organic',
            icon : 'restaurant_vegetarian.png'
        },
        osmDrinkingwater : {
            name : 'Drinking water',
            query : 'amenity=drinking_water',
            icon : 'drinkingwater.png'
        },
        osmAlcohol : {
            name : 'Alcohol',
            query : 'shop=alcohol',
            icon : 'liquor.png'
        },
        osmWine : {
            name : 'Wine',
            query : 'shop=wine',
            icon : 'winebar.png'
        },
        osmBeverages : {
            name : 'Beverages',
            query : 'shop=beverages',
            icon : 'bar_coktail.png'
        },
        osmBusstop : {
            name : 'Bus stop',
            query : 'highway=bus_stop',
            icon : 'busstop.png'
        },
        osmTravelagency : {
            name : 'Travel agency',
            query : 'shop=travel_agency',
            icon : 'travel_agency.png'
        },
        osmCopyshop : {
            name : 'Copy shop',
            query : 'shop=copyshop',
            icon : 'printer-2.png'
        },
        osmDefibrilator : {
            name : 'Defibrilator/AED',
            query : '[emergency=defibrillator],[emergency=aed]',
            icon : 'aed-2.png'
        },
        osmFirehose : {
            name : 'Fire hose/extinguisher',
            query : '[emergency=fire_extinguisher],[emergency=fire_hose]',
            icon : 'fireexstinguisher.png'
        },
        osmAmbulanceStation : {
            name : 'Ambulance station',
            query : 'ambulance_station',
            icon : 'firstaid.png'
        },
        osmMemorial : {
            name : 'Memorial',
            query : 'historic=memorial',
            icon : 'memorial.png'
        },
        osmMonument : {
            name : 'Monument',
            query : 'historic=monument',
            icon : 'monument.png'
        },
        osmWindmill : {
            name : 'Windmill',
            query : 'man_made=windmill',
            icon : 'windmill-2.png'
        },
        osmWatermill : {
            name : 'Watermill',
            query : 'man_made=watermill',
            icon : 'watermill-2.png'
        },
        osmHeritage : {
            name : 'Heritage',
            query : '"ref:whc"',
            icon : 'worldheritagesite.png'
        }
    };
    var treeData = {
        facilities : {
            name : 'Facilities',
            children : {
                transport : {
                    name : 'Transport',
                    layers : [ 'osmBusstop', 'osmFuel', 'osmBicycleparking', 'osmBicyclerental',
                            'osmTaxi', 'osmParking' ]
                },
                education : {
                    name : 'Education',
                    layers : [ 'osmSchool', 'osmUniversity' ]
                },
                publicFacilities : {
                    name : 'Public',
                    layers : ['osmPostbox', 'osmPostoffice', 'osmPharmacy',
                            'osmToilets', 'osmPolice', 'osmATM' ]
                },
                health : {
                    name : 'Health',
                    layers : ['osmPharmacy']
                },
                leisure : {
                    name : 'Leisure',
                    layers : [ 'osmBench']
                },
                emergency : {
                    name: 'Emergency',
                    layers : ['osmDefibrilator', 'osmFirehose', 'osmAmbulanceStation',
                              'osmFireStation']
                },
                facilities : {
                    name : 'Food',
                    layers : [ 'osmRestaurant', 'osmBar', 'osmCafe', 'osmPub',
                            'osmIcecream', 'osmFastfood' ]
                },
            },
            layers :['osmPlaceOfWorship']
        },
        tourism : {
            name : 'Tourism',
            layers : ['osmInformation'],
            children : {
                attraction : {
                    name : 'Attraction',
                    layers : [ 'osmZoo', 'osmViewpoint', 'osmMemorial', 'osmMonument', 'osmWindmill',
                               'osmWatermill', 'osmPicnic', 'osmAttraction' ]
                },
                culture : {
                    name : 'Culture',
                    layers : [ 'osmArtscentre', 'osmTheatre', 'osmCinema',
                            'osmMuseum', 'osmArtwork', 'osmGallery', 'osmHeritage']
                },
                accomodation : {
                    name : 'Accomodation',
                    layers : [ 'osmHotel', 'osmApartment', 'osmGuesthouse',
                            'osmHostel', 'osmMotel', 'osmCampsite']
                }
            }
        },
        shopping : {
            name : 'Shopping',
            children : {
                food : {
                    name : 'Food',
                    layers : [ 'osmSupermarket', 'osmBakery', 'osmConfectionery',
                            'osmDeli', 'osmDairy', 'osmCheese', 'osmGreengrocer',
                            'osmGrocery', 'osmButcher', 'osmCoffee', 'osmSeafood',
                            'osmOrganic', 'osmDrinkingwater', 'osmAlcohol',
                            'osmWine', 'osmBeverages' ]
                },
                other : {
                    name : 'Other shops',
                    layers : [ 'osmMall', 'osmOtherShop', 'osmDepartmentstore',
                            'osmClothes', 'osmFashion', 'osmJewelry', 'osmLeather',
                            'osmShoes', 'osmHairdresser', 'osmBeauty',
                            'osmCosmetics', 'osmChemist', 'osmOpticien',
                            'osmBooks', 'osmPhoto', 'osmToys', 'osmGift',
                            'osmBicycle', 'osmMusicalinstruments', 'osmTravelagency', 'osmCopyshop' ]
                }
            }
        },
        sport : {
            name : 'Sport',
            layers : [ 'osmSoccer', 'osmUsFootball', 'osmGolf', 'osmTennis',
                    'osmVolleybal', 'osmBaseball', 'osmBasketball', 'osmIcehockey',
                    'osmHockey', 'osmCycling', 'osmHorseracing', 'osmSwimming',
                    'osmSurfing', 'osmGymnastics' ]
            }
    };

    osml.init({
        map : mapOptions,
        layerTreeControl : {
            div : 'osmlLayerSelector'
        },
        imgPath : 'examples/layer',
        layerData : layerData,
        treeData : treeData,
        popups : popups
    });
    
    function defaultPopupDefinition() {
        var mainGroup = {
            widgetType : 'osml.widgets.WidgetGroup',
            format : 'plain',
            widgets : [
                 'osml.widgets.Title',
                 'osml.widgets.nl.Departures',
                 'osml.widgets.Address',
                 'osml.widgets.Phone',
                 'osml.widgets.Email',
                 { widgetType : 'osml.widgets.Website', type : 'website'},
                 { widgetType : 'osml.widgets.Website', type : 'url'},
                 'osml.widgets.Twitter',
                 'osml.widgets.Facebook',
                 'osml.widgets.Wikipedia',
                 'osml.widgets.Directions'
             ]
        };
        var detailGroup = {
            widgetType : 'osml.widgets.WidgetGroup',
            format : 'plain',
            widgets : [
               'osml.widgets.BrowseOsm',
               'osml.widgets.UnusedTags'
            ]
        };
        var viewGroup = {
            widgetType : 'osml.widgets.WidgetGroup',
            format : 'ul',
            widgets : [
               'osml.widgets.ViewOsm',
               'osml.widgets.ViewGoogle',
               'osml.widgets.ViewBing',
               'osml.widgets.ViewMtM',
               'osml.widgets.ViewMapillary',
               'osml.widgets.nl.ViewDeHollandseMolen',
               'osml.widgets.nl.ViewMolendatabase',
               'osml.widgets.nl.ViewBagViewer',
               'osml.widgets.nl.ViewOpenKvk',
               'osml.widgets.nl.ViewKvk'
           ]
        };
        var editGroup = {
            widgetType : 'osml.widgets.WidgetGroup',
            format : 'plain',
            widgets : [
               { widgetType : 'osml.widgets.HtmlWidget', html : '<h2>Edit area with:</h2>'},
               { 
                   widgetType : 'osml.widgets.WidgetGroup',
                   format : 'ul',
                   widgets : [
                       'osml.widgets.EditJosm',
                       { widgetType : 'osml.widgets.EditOnline', editor : 'id'},
                       { widgetType : 'osml.widgets.EditOnline', editor : 'potlatch'}
                   ]
               }
            ]
        };
        return {
            widgetType : 'osml.widgets.TabPane',
            tabs : [
               {
                   id : 'popup-main',
                   name : 'General',
                   cssClass : 'feature-main',
                   contentConfig : mainGroup
               },
               {
//                   id : 'popup-detail',
                   name : 'Detail',
                   cssClass : 'feature-detail',
                   contentConfig : detailGroup
               },
               {
                   id : 'popup-view',
                   name : 'View',
                   cssClass : 'feature-view',
                   contentConfig : viewGroup
               },
               {
                   id : 'popup-edit',
                   name : 'Edit',
                   cssClass : 'feature-edit',
                   contentConfig : editGroup
               }
           ]
        };
    };
});
