import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class NotifyToken {
    @ApiProperty()
    @IsString()
    nofifyToken: string;
}
