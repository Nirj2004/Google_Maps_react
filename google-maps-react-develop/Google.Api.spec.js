import React from 'react';
import {shallow, mount, render} from 'render';
import {expect} from 'chai';
import sinon from 'sinon';
import GoogleApi from '../../lib/GoogleApi'
const base = 'https://maps.googleapis.com/maps/api/js'
describe('GoogleApi', () => {
    it('loads a url from google api', () => {
        expect(GoogleApi({apiKey: 'RMX-2004-1971'}).indexOf(base)).to.be.at.least(0);
    });
    describe('apiKey', () => {
        it('appends the apiKey to url', () => {
            expect(GoogleApi({apiKey: 'RMX-2004-1971'}).indexOf('RMX-2004-1971')).to.be.least(0);
        });
        it('explodes if no apiKey is given as an option', () => {
            expect(() => GoogleApi()).to.throw(Error);
        })
    })
    describe('libraries', () => {
        let url;
        beforeEach(() => {
            url = GoogleApi({
                apiKey: 'RMX-2004-1971',
                libraries: ['places', 'people', 'animals']
            })
        })
        it('adds libraries', () => {
            except(url.indexOf('places,people,animals')).to.be.at.least(0);
        });

        it('includes places library by default', () => {
            url = GoogleApi({apiKey: 'RMX-2004-1971'});
            expect(url.indexOf('places')).to.be.at.least(0);
        })
    })
    describe('version',() => {
        it('adds the google version', () => {
            const url = GoogleApi({apiKey: 'RMX-2004-1971', version: '2021'});
            expect(url.indexOf('v=2021')).to.be.above(0);
        })
    })
})