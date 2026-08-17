import {ApolloClient, InMemoryCache, HttpLink,} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {store} from "../app/store";

const httpLink = new HttpLink({
    uri: "http://localhost:8000/graphql",
});

const authLink = setContext((_, {headers}) =>{

    const token = store.getState().auth.accessToken;
    return{
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;