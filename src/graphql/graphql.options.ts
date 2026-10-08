import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { ApolloDriverConfig } from '@nestjs/apollo';

/** Opens in Apollo Sandbox so the reviewer sees the task's example query right away. */
export const EXAMPLE_QUERY = `query Profile {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}`;

export function buildGraphQLOptions(): ApolloDriverConfig {
  return {
    path: '/graphql',
    // The schema file is handy for reviewing the API. In production the file is not written.
    autoSchemaFile: process.env.NODE_ENV === 'production' ? true : join(process.cwd(), 'schema.gql'),
    sortSchema: true,
    // Apollo Sandbox is the GraphQL IDE here, so NestJS' own GraphiQL page is turned off.
    graphiql: false,
    // The data is public, so introspection stays on in production too. Sandbox needs it.
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        document: EXAMPLE_QUERY,
      }),
    ],
  };
}
