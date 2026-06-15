async function run() {
  try {
    const mod = await import("better-auth/adapters/drizzle");
    console.log("Keys in module:", Object.keys(mod));
    console.log("drizzleAdapter:", mod.drizzleAdapter);
  } catch (err) {
    console.error("Import error:", err);
  }
}
run();
