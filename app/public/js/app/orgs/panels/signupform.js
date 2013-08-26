goog.provide('app.org.panel.SignUp');

goog.require('bad.ui.Form');
goog.require('exp.productMap');
goog.require('goog.ui.CustomButton');

/**
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.org.panel.SignUp = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);

    this.productButtons_ = {};
};
goog.inherits(app.org.panel.SignUp, bad.ui.Form);

app.org.panel.SignUp.prototype.enterDocument = function() {
    app.org.panel.SignUp.superClass_.enterDocument.call(this);

    if (this.dom_.getElement('mapCanvas')) {
        this.loadGoogleMaps();
    }
};

app.org.panel.SignUp.prototype.initDom = function() {
    bad.utils.makeButton('orgFormCancel', this,
        goog.bind(this.onCancel, this)
    );

    bad.utils.makeButton('orgFormSubmit', this,
        goog.bind(this.submitSignUp, this)
    );

    if (this.dom_.getElement('bill')) {

        goog.object.forEach(exp.productMap, function(product, key) {
            this.productButtons_[key] = bad.utils.makeToggleButton(key, this,
                goog.bind(this.choosePlan_, this, key)
            );
        }, this);

        this.ccardEl = goog.dom.getElement('card');
        goog.style.setElementShown(this.ccardEl, false);

        this.planType = goog.dom.getElement('billPlan');
        this.choosePlan_(this.planType.value || 'free');
    }

    var el = goog.dom.getElement('remove-account');
    if (el) {
        bad.utils.makeButton('remove-account', this,
            goog.bind(this.dispatchActionEvent, this,
                app.org.EventType.DELETE)
        );
    }
};

app.org.panel.SignUp.prototype.choosePlan_ = function(plan) {
    goog.dom.forms.setValue(this.planType, plan);
    goog.object.forEach(this.productButtons_, function(button, key) {
        if (key === plan) {
            goog.dom.classes.add(button.getElement(),
                'goog-css3-button-checked');
        } else {
            goog.dom.classes.remove(button.getElement(),
                'goog-css3-button-checked');
        }
    }, this);

    if (plan !== 'free') {
        this.makeCCardFieldsRequired(true);
        goog.style.setElementShown(this.ccardEl, true);

    } else {
        this.makeCCardFieldsRequired(false);
        goog.style.setElementShown(this.ccardEl, false);
    }

};

app.org.panel.SignUp.prototype.submitSignUp = function() {
    this.checkCreditCardNumberValidity();
    this.checkValidation();
    var form = this.getForm();
    if (form.checkValidity()) {
        var content = goog.dom.forms.getFormDataMap(form).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            this.getUri(),
            this.getPostContentFromForm(form),
            goog.bind(this.onSubmitSignUp, this, queryData)
        );
    }
};

/**
 * Internally check validity of the credit card number.
 * @return {!boolean}
 */
app.org.panel.SignUp.prototype.checkCreditCardNumberValidity = function() {
    var billPlan = document.getElementById('billPlan');
    var cardType = document.getElementById('crdType');
    var cardNumber = document.getElementById('crdNumber');

    if (billPlan && billPlan.value !== 'free') {
        if (cardType && cardType.value === 'none') {
            cardType.setCustomValidity('Please select a card type');
            return false;
        } else {
            cardType.setCustomValidity('');
            if (cardType && cardNumber) {
                var number = cardNumber.value;
                var type = cardType.value;
                var isValid = bad.utils.creditCardValidator(number, type);
                if (!isValid) {
                    cardNumber.setCustomValidity(
                        'This is not a valid card number');
                    return false;
                } else {
                    cardNumber.setCustomValidity('');
                    return true;
                }
            }
        }
    }
    return true;
};

/**
 * @param {string} queryData
 * @param {goog.events.EventLike} e Event object.
 */
app.org.panel.SignUp.prototype.onSubmitSignUp = function(queryData, e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        var orgId = data['data']['_id'];
        var orgData = data['data'];
        this.dispatchActionEvent(app.org.EventType.UPDATE_SUCCESS, {org: orgData});
    } else {
        this.displayErrors(data);
    }
};

app.org.panel.SignUp.prototype.makeCCardFieldsRequired = function(bool) {
    var fields = ['crdName', 'crdType', 'crdNumber', 'crdExpDate', 'crdCvv'];
    if (bool) {
        goog.array.forEach(fields, function(id) {
            var field = this.dom_.getElement(id);
            field.setAttribute('required', 'required');
        }, this);
    } else {
       goog.array.forEach(fields, function(id) {
            var field = this.dom_.getElement(id);
            field.removeAttribute('required');
        }, this);
    }
};

app.org.panel.SignUp.prototype.onCancel = function() {
    this.clearAlerts();
    this.dispatchActionEvent(app.org.EventType.CANCEL);
};

app.org.panel.SignUp.prototype.loadGoogleMaps = function() {

    // Makes a random name for the callback in the global scope
    var randName = bad.utils.makeId();

    // The callback below is placed in the global scope so the call to google
    // maps can access it on callback. It is destroyed
    // immediately inside the callback;
    goog.global[randName] = goog.bind(this.renderMap, this, randName);

    // the 'google.maps' namespace may already be in the document.
    // If it is, there is no need to get the namespace again.
    try {
        goog.isDefAndNotNull(google.maps);
        this.renderMap();
    } catch (e) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
            '&sensor=false' +
            '&callback=' + randName;
        document.body.appendChild(script);
    }
};

app.org.panel.SignUp.prototype.renderMap = function(randName) {
    delete goog.global[randName];
    var latInput = document.getElementById('geoLat');
    var lngInput = document.getElementById('geoLng');
    var geoAddressInput = document.getElementById('geoAddress');
    var geoZoomInput = document.getElementById('geoZoom');

    var landLat = latInput.value || 0;
    var landLng = lngInput.value || 0;
    var landZoom = geoZoomInput.value || 13;

    var geocoder = new google.maps.Geocoder();

    function geocodePosition(pos) {
        geocoder.geocode({latLng: pos}, function(responses) {
            var result = '';
            if (responses && responses.length > 0) {
            result = responses[0].formatted_address;
            }
            updateMarkerAddress(result);
        });
    }

    function updateMarkerPosition(latLng) {
        latInput.value = latLng.lat();
        lngInput.value = latLng.lng();
    }

    function updateMarkerAddress(str) {
        geoAddressInput.value = str;
    }

    function updateZoomLevel(num) {
        geoZoomInput.value = num;
    }

    function initialize() {
      var latLng = new google.maps.LatLng(landLat, landLng);
      var map = new google.maps.Map(document.getElementById('mapCanvas'), {
        zoom: parseInt(landZoom, 10),
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      var marker = new google.maps.Marker({
        position: latLng,
        title: 'Point A',
        map: map,
        draggable: true
      });

      // Update current position info.
      updateMarkerPosition(latLng);

      // Add dragging event listeners.
      google.maps.event.addListener(marker, 'dragstart', function() {
        updateMarkerAddress('Dragging...');
      });

      google.maps.event.addListener(marker, 'drag', function() {
        updateMarkerPosition(marker.getPosition());
      });

      google.maps.event.addListener(marker, 'dragend', function() {
        geocodePosition(marker.getPosition());
      });

      google.maps.event.addListener(map, 'dragend', function() {
        updateZoomLevel(map.getZoom());
      });

      google.maps.event.addListener(map, 'zoom_changed', function() {
          updateZoomLevel(map.getZoom());
      });
    }
    initialize();
};






