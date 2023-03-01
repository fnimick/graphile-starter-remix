#!/usr/bin/env node
(async () => {
  const { default: rimraf } = await import("rimraf");
  const { globSync } = await import("glob");
  try {
    await rimraf(globSync(`${__dirname}/../@app/*/dist`));
    await rimraf(globSync(`${__dirname}/../@app/*/tsconfig.tsbuildinfo`));
    await rimraf(globSync(`${__dirname}/../@app/client/.cache`));
    await rimraf(globSync(`${__dirname}/../@app/client/build`));
    console.log("Deleted");
  } catch (e) {
    console.error("Failed to clean up, perhaps rimraf isn't installed?");
    console.error(e);
  }
})();
