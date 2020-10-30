import {Repository, EntityRepository} from "typeorm";
import {Media} from "src/common/entity";

@EntityRepository(Media)
export class MediaRepository extends Repository<Media> {
}
