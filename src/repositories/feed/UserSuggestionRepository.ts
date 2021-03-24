import { EntityRepository, Repository } from 'typeorm';
import { UserSuggestionDto } from '../../dtos/feed/UserSuggestionDto';
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
          		   pro."fullName",
          		   pro."pictureUrl"
        	  from "user_suggestion" 	sug 
      inner join "user" 				    usu on usu.id = sug."suggestedUserId"
      inner join "profile"			    pro on pro."userId" = usu."id"
           where sug."userId" = $1
        order by sug."id"`, [forUser.id])
  }
}