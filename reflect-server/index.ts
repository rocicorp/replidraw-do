import type { ReflectServerOptions } from "@rocicorp/reflect/server";
import { serverMutators, M } from "../src/datamodel/mutators.js";

function makeOptions(): ReflectServerOptions<M> {
  return {
    mutators: serverMutators,
    maxMutationsPerTurn: 1000,
  };
}

export { makeOptions as default };
