import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";

import { store } from "../app/store";
import { handleSessionExpired } from "../utils/session";

const httpLink = new HttpLink({
    uri: "http://localhost:8000/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = store.getState().auth.accessToken;

    return {
        headers: {
            ...headers,
            ...(token
                ? { authorization: `Bearer ${token}` }
                : {}),
        },
    };
});

const errorLink = new ErrorLink(({ error }) => {
    const isHttpUnauthorized =
        ServerError.is(error) &&
        error.statusCode === 401;

    const isGraphQLUnauthorized =
        CombinedGraphQLErrors.is(error) &&
        error.errors.some((graphQLError) => {
            const code = graphQLError?.extensions?.code;
            const message = String(graphQLError?.message ?? "").toLowerCase();

            return (
                code === "UNAUTHENTICATED" ||
                code === "UNAUTHORIZED" ||
                message.includes("unauthorized") ||
                message.includes("unauthenticated") ||
                message.includes("authentication is required")
            );
        });

    if (isHttpUnauthorized || isGraphQLUnauthorized) {
        handleSessionExpired();
    }
});

const client = new ApolloClient({
    link: errorLink.concat(authLink).concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
