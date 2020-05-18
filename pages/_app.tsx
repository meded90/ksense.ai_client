import App from 'next/app';
import 'mobx-react-lite/batchingOptOut'
import initializeStore from "../stores/stores";
import { Provider } from "mobx-react";
import isServer from "../utils/isServer";
import LayoutPage from "../components/LayoutPage/LayoutPage";
import React from "react";
import { SaveStoreToLocalStorageProvider } from "../utils/saveStoreToLocalStorage";


class CustomApp extends App {
  mobxStore: any;

  static async getInitialProps(appContext) {
    const mobxStore = initializeStore();
    appContext.ctx.mobxStore = mobxStore;
    const appProps = await App.getInitialProps(appContext);
    return {
      ...appProps,
      initialMobxState: mobxStore,
    };
  }

  constructor(props) {
    super(props);
    this.mobxStore = isServer() ? props.initialMobxState : initializeStore();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider {...this.mobxStore}>
        <SaveStoreToLocalStorageProvider />
        <LayoutPage>
          <Component {...pageProps} />
        </LayoutPage>
      </Provider>
    );
  }
}

export default CustomApp;
