import { EntityRepository, Repository } from 'typeorm';
import PlacePostDto from '../../interfaces/dtos/monerate/PlacePostDto';
import Place from '../../entities/monerate/Place';
import { User } from '../../entities/User';

@EntityRepository(Place)
export default class PlaceRepository extends Repository<Place>{

    async getPlacesFromUser(user: User): Promise<Place[]> {
        return this.find({ userId: user.id })
    }

    // why did i created this for, anyway?
    // async savePlacePostDto(place: PlacePostDto, user: User): Promise<Place>{
    //     return this.save({
    //         user: user, 
    //         userId: user.id, 
    //         name: place.name, 
    //         bgColor: place.bgColor, 
    //         icon: place.icon
    //     })'
    // }
}