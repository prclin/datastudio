import { newAxios, newMutation } from "@services/common.ts";
import { CreateConfigCommand } from "@models/engine-config.ts";

const server = newAxios(process.env.API_BASE, "/api");

export const useNewConfig = newMutation<CreateConfigCommand, void>(
  server,
  "POST",
  "runtime/engine-config",
  true,
);
