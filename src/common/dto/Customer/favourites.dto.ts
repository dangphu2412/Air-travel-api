import {ApiProperty} from "@nestjs/swagger";
import {IsArray} from "class-validator";

export class CustomerFavouriteServiceDto {
    @IsArray()
    @ApiProperty({
      example: [1, 2, 3]
    })
    favouriteServiceIds: number[];
}
