import {CrudConfigService} from "@nestjsx/crud";

const LIMIT_PREFIX = 10;
const MAX_LIMIT_PREFIX = 50;
const IS_PAGINATE = true;

CrudConfigService.load({
  query: {
    limit: LIMIT_PREFIX,
    maxLimit: MAX_LIMIT_PREFIX,
    alwaysPaginate: IS_PAGINATE
  }
});
