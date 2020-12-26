import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsNumber} from "class-validator";
import {IsRequired} from "src/common/decorators/isRequired.decorator";

export class UpdateRoleDto {
    @ApiProperty()
    @IsRequired()
    name: string;

    /**
     * Map relation keys
     */
    @ApiProperty({writeOnly: true, example: [2, 3]})
    @IsOptional()
    @IsNumber({}, {each: true})
    permissionIds: Array<number>;
}
