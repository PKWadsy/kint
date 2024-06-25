import { DuvetExport } from "src/core/common/DuvetExport";
import { DuvetEndpoint } from "src/core/endpoint-builder/DuvetEndpoint";

export const dudEndpoint: DuvetExport<
  DuvetEndpoint<unknown, unknown, unknown, unknown>
> = {
  builtByDuvet: true,
  data: {
    config: {},
    exportType: "DuvetEndpoint",
    handler: (request) => {
      return request;
    },
  },
};
