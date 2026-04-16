import { ApolloClient, InMemoryCache, from } from '@apollo/client';

import authLink from '@src/services/apollo/links/authLink';
import refreshLink from '@src/services/apollo/links/refreshLink';
import httpLink from '@src/services/apollo/httpLink';
import typenameLink from '@src/services/apollo/links/typenameLink';

const cache = new InMemoryCache({
  addTypename: true,
  typePolicies: {
    ImageObjectType: {
      keyFields: false, // Prevent Apollo cache errors on pagination when ImageObjectType has id: null
      fields: {
        sizes: {
          merge(existing, incoming) {
            // If incoming is missing or null, return existing or null
            // This prevents cache write errors when API doesn't return sizes
            return incoming ?? existing ?? null;
          },
          read(existing) {
            // Provide default value when reading if field is missing
            return existing ?? null;
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
  link: from([typenameLink, refreshLink, authLink.concat(httpLink)]),
  cache
});

export default client;
