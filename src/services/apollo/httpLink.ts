import Config from 'react-native-config';
import { createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: Config.GRAPHQL_URI ?? 'https://backend-gateway-ms-testing.nmas.live/'
});

export default httpLink;
