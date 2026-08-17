import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import {store} from './app/store.js'
import {ApolloProvider} from "@apollo/client/react";
import client from './apollo/client';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
      <ApolloProvider client={client}>
    <App />
          </ApolloProvider>
      </Provider>
  </StrictMode>,
)
