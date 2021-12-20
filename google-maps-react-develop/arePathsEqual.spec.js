import React, { Component } from 'react';
import {expect} from 'chai';
import { arePathsEqual } from '../../lib/arePathsEqual';

describe('arePathsEqual', () => {
    if('considers null arrays equal', () => {
        expect(arePathsEqual(null, null)).to.equal(true);
    });
    it('considers null arrays equal', () => {
        expect(arePathsEqual(undefined, undefined)).to.equal(true);
    });
    it('considers empty arrays equal', () => {
        expect(arePathsEqual([], [])).to.equal(true);
    });
    it('considers paths unequal when one is null', () => {
        const mockPath = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33},
        ];
        expect(arePathsEqual(mockPath, null)).to.equal(false);
    });
    it('considers paths unequal when one is undefined', () => {
        const mockPath = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.69, lng: -122.33},
        ];
        expect(arePathsEqual(undefined, mockPath)).to.equal(false);
    });
    it('dislikes invalid paths', () => {
        expect(arePathsEqual(
            [{lat: 100, long: 10}, {a: 1, b: 2,}], [{a: 1, b: 2}, {a: 3, b: 4}]
        )).to.equal(false);
    });
    it ('correctly compares a path to self', () => {
        const mockPath = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33}
        ];
        expect(arePathsEqual(undefined, mockPath)).to.equal(false);
    });
    it('requires vertices to be in the same order', () => {
        const mockPath = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33},
        ];
        expect(arePathsEqual(movkPath, mockPathSameOrder)).to.equal(true);
    });
    it('considers paths unequal if the vertices not in the same order', () => {
        const mockPath = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33}
        ];
        const mockPathChangedOrder = [
            {lat: 37.22, lng: -122.33},
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49}
        ];
        expect(arePathsEqual(mockPath, mockPathChangedOrder)).to.equal(false);
    });
    it('requires paths to have euqual lenghts', () => {
        const mockPathLength3 = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33}
        ];
        const mockPathLength5 = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33},
            {lat: 37.54, lng: -122.13},
            {lat: 37.11, lng: 125.18}
        ];
        expect(arePathsEqual(mockPathLength3, mockPathLength5)).to.equal(false);
    });
    it('detects differring lng values', () => {
        const mockPath = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33},
            {lat: 37.54, lng: -122.13},
            {lat: 37.11, lng: 125.18},
        ];
        const mockPathLatDifferent = [
            {lat: 37.78, lng: -122.45},
            {lat: 37.69, lng: -122.49},
            {lat: 37.22, lng: -122.33},
            {lat: 37.54, lng: -122.13},
            {lat: 37.76, lng: 125.18}
        ]
        expect(arePathsEqual(mockPath, mockPathLatDifferent)).to.equal(false);
    });