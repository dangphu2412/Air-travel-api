import {CrudConfigService} from "@nestjsx/crud";

CrudConfigService.load({
  query: {
    limit: 10
    // cache: 2000,
  },
  params: {
    id: {
      field: "id",
      type: "number",
      primary: true
    }
  },
  routes: {
    updateOneBase: {
      allowParamsOverride: true
    },
    deleteOneBase: {
      returnDeleted: true
    }
  }
});
