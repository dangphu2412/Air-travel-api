import {CrudConfigService} from "@nestjsx/crud";

CrudConfigService.load({
  query: {
    limit: 10,
    maxLimit: 50,
    alwaysPaginate: true
  }
});
