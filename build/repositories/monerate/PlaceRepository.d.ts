import { Repository } from 'typeorm';
import Place from '../../entities/monerate/Place';
import { User } from '../../entities/User';
export default class PlaceRepository extends Repository<Place> {
    getPlacesFromUser(user: User): Promise<Place[]>;
}
