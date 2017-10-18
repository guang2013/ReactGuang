/**
 * Created by Guangwen on 2017/8/13.
 */
import React, { Component } from 'react';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import App from '../App';
import BasicAnimations from '../components/animation/BasicAnimations';
import ExampleAnimations from '../components/animation/ExampleAnimations';
import List from '../components/product/List'

export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { store } = this.props;
        const { auth } = store.getState().httpData;
        if (!auth || !auth.data.permissions.includes(permission)) hashHistory.replace('/404');
        return component;
    };
    render() {
        return (
            <Router history={hashHistory}>
                <Route path={'/'}>
                    <Route path={'app'} component={App}>
                        <Route path={'product'}>
                            <Route path={'list'} component={List} />
                        </Route>
                        <Route path={'animation'}>
                            <Route path={'basicAnimations'} component={BasicAnimations} />
                            <Route path={'exampleAnimations'} component={ExampleAnimations} />
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}