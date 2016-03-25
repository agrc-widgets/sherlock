require([
    'sherlock/Sherlock',

    'dojo/dom-construct'
], function (
    WidgetUnderTest,

    domConstruct
) {
    describe('sherlock/Sherlock', function () {
        var widget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };
        var map = {
            on: function () {},
            loaded: true,
            removeLayer: function () {},
            setExtent: function () {}
        };
        var feature = {
            geometry: {
                getExtent: function () {}
            },
            setSymbol: function () {}
        };

        beforeEach(function () {
            map.addLayer = jasmine.createSpy('addLayer');
            widget = new WidgetUnderTest({
                map: map
            }, domConstruct.create('div', null, document.body));
        });

        afterEach(function () {
            if (widget) {
                destroy(widget);
            }
        });

        describe('constructor', function () {
            it('creates a valid widget', function () {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('_setUpGraphicsLayer', function () {
            it('can preserve the graphics on map navigation', function () {
                spyOn(map, 'on');

                widget.preserveGraphics = true;

                widget._setUpGraphicsLayer();

                expect(map.on).not.toHaveBeenCalled();
            });
            it('can accept a graphicsLayer instead of creating a new one', function () {
                // defaults
                expect(map.addLayer).toHaveBeenCalled();

                var gl = {};
                new WidgetUnderTest({
                    map: map,
                    graphicsLayer: gl
                });

                expect(map.addLayer.calls.count()).toBe(1);
            });
        });
        describe('_zoomToMultipleFeatures', function () {
            it('fires zoomed event', function () {
                var spy = jasmine.createSpy('zoomedCallback');
                widget.on('zoomed', spy);

                widget._zoomToMultipleFeatures([feature]);

                expect(spy).toHaveBeenCalled();
            });
        });
        describe('_zoom', function () {
            it('fires zoomed event', function () {
                var spy = jasmine.createSpy('zoomedCallback');
                widget.on('zoomed', spy);

                widget._zoom(feature);

                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
