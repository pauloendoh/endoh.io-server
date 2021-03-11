import { EntityRepository, Repository } from 'typeorm';
import { FollowerDto } from '../../dtos/feed/FollowerDto';
import { FollowingUserDto } from '../../dtos/feed/FollowingUserDto';
import { MostFollowedUser } from '../../dtos/feed/MostFollowedUser';
import { UserSuggestionDto } from '../../dtos/feed/UserSuggestionDto';
import { FollowingTag } from '../../entities/feed/FollowingTag';
import { UserSuggestion } from '../../entities/feed/UserSuggestion';
import { User } from '../../entities/User';

@EntityRepository(UserSuggestion)
export default class UserSuggestionRepository extends Repository<UserSuggestion>{

  async getUserSuggestions(forUser: User): Promise<UserSuggestionDto[]> {
    return this.query(`
        	select sug."id",
          		   sug."suggestedUserId",
          		   sug."description", 
          		   usu."username",
          		   pro."fullName"
        	  from "user_suggestion" 	sug 
      inner join "user" 				    usu on usu.id = sug."suggestedUserId"
      inner join "profile"			    pro on pro."userId" = usu."id"
           where sug."userId" = $1
        order by sug."id"`, [forUser.id])
  }
}