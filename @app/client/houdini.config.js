/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  schemaPath: "../../data/schema.graphql",
  plugins: {
    "houdini-svelte": {},
  },
  scalars: {
    Datetime: {
      // the corresponding typescript type
      type: "Date",
      // turn the api's response into that type
      unmarshal(val) {
        return new Date(val);
      },
      // turn the value into something the API can use
      marshal(date) {
        return date.getTime();
      },
    },
    UUID: {
      type: "string",
    },
  },
  defaultCachePolicy: "NetworkOnly",
};

export default config;
