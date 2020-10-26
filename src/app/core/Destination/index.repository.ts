import {Repository, EntityRepository} from "typeorm";
import {Destination} from "src/common/entity";

@EntityRepository(Destination)
export class DestinationRepository extends Repository<Destination> {
}
