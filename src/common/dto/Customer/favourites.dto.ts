import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class CustomerFavouriteServiceDto {
    @IsNumber()
    @ApiProperty({
      example: 1
    })
    favouriteServiceId: number;
}
