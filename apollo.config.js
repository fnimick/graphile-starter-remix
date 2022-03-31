module.exports = {
  client: {
    includes: [
      `${__dirname}/@app/next-client/src/**/*.graphql`,
      `${__dirname}/@app/client/src/**/*.graphql`,
    ],
    service: {
      name: "postgraphile",
      localSchemaFile: `${__dirname}/data/schema.graphql`,
    },
  },
};
