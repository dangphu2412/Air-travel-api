import {applyDecorators} from "@nestjs/common";
import {ApiOperation} from "@nestjs/swagger";

export function CrudSwaggerFindMany(summary = "Get soft deleted") {
  return applyDecorators(
    ApiOperation({
      summary,
      parameters: [
        {
          in: "query",
          name: "page",
          allowEmptyValue: true,
          description: "Page to be paginated"
        },
        {
          in: "query",
          name: "offset",
          allowEmptyValue: true,
          description: "Offset to be paginated"
        },
        {
          in: "query",
          name: "limit",
          allowEmptyValue: true,
          description: "Limit to be paginated"
        }
      ]
    })
  )
}
