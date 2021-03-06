// Copyright 2002-2015, University of Colorado Boulder
define(function (require) {
    'use strict';

    // modules
    var inherit = require('PHET_CORE/inherit');
    var PropertySet = require('AXON/PropertySet');
    var CircuitModel = require('ELECTROLYSIS/electrolysis/model/CircuitModel');
    var RackModel = require('ELECTROLYSIS/electrolysis/model/RackModel');
    var CallOutModel = require('ELECTROLYSIS/electrolysis/model/CallOutModel');
    var LiquidModel = require('ELECTROLYSIS/electrolysis/model/LiquidModel');
    var Vector2 = require('DOT/Vector2');
    var Beaker = require('ELECTROLYSIS/electrolysis/model/Beaker');
    var Dimension2 = require('DOT/Dimension2');

    /**
     * @constructor
     */
    function ElectrolysisModel(environment) {
        PropertySet.call(this, {});

        var liquids = [
            new LiquidModel({name: 'Copper Sulhate', color: 'blue', conductor: true, location: new Vector2(30, 143)}),
            new LiquidModel({name: 'Distilled Water', color: 'cyan', conductor: false, location: new Vector2(60, 55)}),
            new LiquidModel({name: 'Salt Water', color: '#ddd', conductor: true, location: new Vector2(140, 55)})
        ];

        var beaker = new Beaker({
            location: new Vector2(151, 300),
            liquidFillLocation: new Vector2(15, 30),
            liquidFillSize: new Dimension2(150, 100)
        });

        this.circuitModel = new CircuitModel(beaker);
        this.rack = new RackModel(liquids);
        this.callOutModel = new CallOutModel();
        this.environment = environment;

        this.circuitModel.beaker.setParent(this.circuitModel);

        var callOut = function () {
            if (this.circuitModel.check()) {
                this.callOutModel.visibleProperty.set(true);
            } else {
                this.callOutModel.visibleProperty.set(false);
            }
        }.bind(this);

        beaker.electrolyteProperty.link(function () {
            this.circuitModel.checkCurrentFlow();
        }.bind(this));

        beaker.electrolyteProperty.link(function (electrolyte) {
            if (!electrolyte) {
                return;
            }
            this.callOutModel.liquidNameProperty.set(electrolyte.name);
            this.callOutModel.conductorProperty.set(electrolyte.conductor);
            callOut();
        }.bind(this));

        this.circuitModel.switchedOnProperty.link(function (on) {
            callOut();
        }.bind(this));


    }

    return inherit(PropertySet, ElectrolysisModel, {

        //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
        step: function (dt) {
            //TODO Handle model animation here.
        }
    });
});
