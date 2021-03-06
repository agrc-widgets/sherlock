define(['dojo/_base/declare', 'esri/tasks/QueryTask', 'esri/tasks/support/Query', 'sherlock/providers/_ProviderMixin'], function (declare, QueryTask, Query, _ProviderMixin) {
    var defaultWkid = 3857;

    return declare([_ProviderMixin], {
        /**
         * @property {string} searchField - The Field name that is to be searched.
         */
        searchField: '',

        /**
         * @property {string} contextField - The context field
         */
        contextField: null,

        /**
         * @property {Query} _query
         * @private
         */
        _query: null,

        /**
         * @property {QueryTask} _queryTask
         * @private
         */
        _queryTask: null,

        /**
         * A provider class for Sherlock that searches a layer within a mapservice.
         * @name MapService
         * @param {string} url - The URL to the map service layer that you want to search.
         * e.g. http://mapserv.utah.gov/arcgis/rest/services/SomeService/MapServer/1
         * @param {string} searchField - The name of the field that you want to search on.
         * @param options {object}
         * @param {string[]} [options.outFields] - A list of the fields that you want returned from the search.
         * If undefined then the searchField and contextField (if provided) will be used.
         * @param {string} [options.contextField] - A second field to display in the results table to
         * give context to the results in case of duplicate results.
         * @param {string} [options.token] - Token for working with secured services
         * @param {number} [options.wkid] - WKID for spatial reference. Defaults to 3857.
         */
        constructor: function constructor(url, searchField, options) {
            console.log('sherlock.providers.MapService:constructor', arguments);

            this.searchField = searchField;
            var outFields;
            if (options) {
                this.contextField = options.contextField;
                outFields = options.outFields;
                // add token for secured services
                if (options.token) {
                    url += '/?token=' + this.token;
                }
            }

            this._query = new Query();
            this._query.returnGeometry = false;
            this._query.outFields = this._getOutFields(outFields, this.contextField, this.searchField);
            var wkid = options.wkid || defaultWkid;
            this._query.outSpatialReference = { wkid: wkid };

            this._queryTask = new QueryTask(url);
        },
        /**
         * Initiates a search for features
         * @param {string} searchString - The text to search for
         * @returns {Deferred}
         */
        search: function search(searchString) {
            console.log('sherlock.providers.MapService:search', arguments);

            this._query.returnGeometry = false;
            this._query.where = this._getSearchClause(searchString);

            this._deferred = this._queryTask.execute(this._query).then(function handleQueryTaskResponse(featureSet) {
                return featureSet.features;
            }, function handleQueryTaskError(er) {
                this.emit('error', er);
            }.bind(this));

            return this._deferred;
        },
        /**
         * Queries for the geometry of a specific feature or select of features matching the search criteria
         * @param {string} searchValue - The value of the data in the search field of the feature that you want
         * @param {string} [contextValue] - The value of the data in the context field of the feature that you want
         * @returns {Promise} - A promise that resolves with a list of matching features
         */
        getFeature: function getFeature(searchValue, contextValue) {
            console.log('sherlock.providers.MapService:getFeature', arguments);

            this._query.returnGeometry = true;
            this._query.where = this._getFeatureClause(searchValue, contextValue);

            this._deferred = this._queryTask.execute(this._query).then(function handleQueryTaskResponse(featureSet) {
                return featureSet.features;
            });

            return this._deferred;
        }
    });
});
//# sourceMappingURL=MapService.js.map
