import React, {Component} from 'React';

import GitHubForkRibbon from 'react-github-fork-ribbon';
import PropTypes from 'prop-types';
import {withRRouter, Switch, Link, Redirect, Route} from 'react-router-dom';


import styles from'./styles.module.css';


const GoogleApiWrapper = __IS_DEV__
  ? require('../src/index').GoogleApiWrapper
  : require('../dist').GoogleApiWrapper;


class Container extends Component {
    static PropTypes = {};

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        const {children, routes, routeDef} = this.props;


        return (
            <div className={styles.container}>
                <GitHubForkRibbon
                  href="//github.com/fullstackreact/google-maps-react"
                  position="right"
                  target="_blank">
                  Fork me on Github
                </GitHubForkRibbon>


                <div className={styles.wrapper}>
                    <div className={styles.list}>
                        <ul>
                            {routes.map(route => {
                                <Link key={route.path} to={route.path}>
                                    <li>{route.name}</li>
                                </Link>
                            })}
                        </ul>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h1>{routeDef && routeDef.name} Example</h1>


                            <h2>
                                <a href="https://github.com/fullstackreact/google-maps-react/README.md">  
                                </a>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}