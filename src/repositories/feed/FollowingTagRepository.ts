import { EntityRepository, Repository } from 'typeorm';
import { FeedResourceDto } from '../../dtos/feed/FeedResourceDto';
import { FollowerDto } from '../../dtos/feed/FollowerDto';
import { FollowingUserDto } from '../../dtos/feed/FollowingUserDto';
import { MostFollowedUser } from '../../dtos/feed/MostFollowedUser';
import { FollowingTag } from '../../entities/feed/FollowingTag';
import { User } from '../../entities/User';

@EntityRepository(FollowingTag)
export default class FollowingTagRepository extends Repository<FollowingTag>{

  async getFollowingUsers(follower: User): Promise<FollowingUserDto[]> {
    return this.query(`
        SELECT json_build_object('userId', FUS.id, 
                                 'username', FUS.username, 
                                 'fullName', PRO."fullName") AS "followingUser", 
	 	       (SELECT JSON_AGG(B) FROM "following_tag" A 
		                     INNER JOIN "tag"		    B ON B.id = A."tagId"
		                          WHERE A."followingUserId" = FUS.id 
                                    AND A."followerId" = $1)  AS "tags"
    	  FROM "following_tag" 	FTG
    INNER JOIN "user"			FUS ON FUS.id = FTG."followingUserId"
    INNER JOIN "profile"		PRO	ON PRO."userId" = FUS."id"
         WHERE FTG."followerId" = $1
      GROUP BY FUS.id, PRO."fullName"`, [follower.id])
  }

  async getFollowers(user: User): Promise<FollowerDto[]> {
    return this.query(`
        SELECT json_build_object('userId', FUS.id, 
                                 'username', FUS.username, 
                                 'fullName', PRO."fullName") AS "follower", 
	 	       (SELECT JSON_AGG(B) FROM "following_tag" A 
		                     INNER JOIN "tag"		    B ON B.id = A."tagId"
		                          WHERE A."followerId" = FUS.id 
                                    AND A."followingUserId" = $1)  AS "tags"
    	  FROM "following_tag" 	FTG
    INNER JOIN "user"			FUS ON FUS.id = FTG."followerId"
    INNER JOIN "profile"		PRO	ON PRO."userId" = FUS."id"
         WHERE FTG."followingUserId" = $1
      GROUP BY FUS.id, PRO."fullName"`, [user.id])
  }

  async getMostFollowedUsersByUsersYouFollow(you: User, returnUpTo: number = 40): Promise<MostFollowedUser[]> {
    return this.query(`
        select (select json_build_object('userId', "user".id, 'username', "user".username) 
                  from "user" where "id" = "followingUserId") as user,
	             count("followingUserId")                       as "count" 
	        from (select distinct -- Todas os usuários seguidos pelos usuários q vc segue
	   	   		           "followerId",
	   	   		           "followingUserId"
	    	          from "following_tag" 
	    	         where "followerId" in (select id  -- Todos os usuários que o usuário segue
	   						                          from "user" 
	   						                         where "id" in (select "followingUserId" 
                                                          from "following_tag" 
                                                         where "followerId" = $1))) as todos_usuarios
         -- não pode recomendar usuários q vc já segue, nem recomendar seu próprio usuário
	       where "followingUserId" not in (select "followingUserId" 
                                           from "following_tag" where "followerId" = $1) 
                                            and "followingUserId" != $1
	    group by "followingUserId" order by "count" desc
	    limit $2
  `, [you.id, returnUpTo])
  }

  async getMostFollowedUsersByUsersYouDONTFollow(you: User, returnUpTo: number = 10): Promise<MostFollowedUser[]> {
    return this.query(`
        select (select json_build_object('userId', "user".id, 'username', "user".username)
	                from "user" 
                 where "id" = "followingUserId") as user, 
               count("followingUserId") 
          from "following_tag" 
         where "followerId" not in (select id  -- Todos os usuários que o usuário segue
	   						                      from "user" 
	   						                     where "id" in (select "followingUserId" 
                                                      from "following_tag" 
                                                     where "followerId" = $1))
           and "id" != $1
      group by "followingUserId" 
			order by count("followingUserId") desc
				 limit $2
  `, [you.id, returnUpTo])
  }

  async getFeedResources(user: User): Promise<FeedResourceDto[]> {
    return this.query(`
    select reso."id", 
  		     reso."title", 
  		     reso."url",
  		     reso."thumbnail",
  		     reso."estimatedTime",
  		     reso."dueDate",
  		     reso."rating",
  		     reso."completedAt",
  		     (select json_build_object('id', "user".id, 
                                     'username', "user".username)
  	          from "user" 
             where "id" = "followingUserId") as "user",
           (select json_build_object('id', "tag"."id", 
                                     'name', "tag"."name",
                                     'color', "tag"."color")
  	          from "tag" 
             where "id" = ftag."tagId") as "tag"
    	from "following_tag" ftag
inner join "resource"	   reso	on reso."tagId" = ftag."tagId"
	   where "followerId" = $1
	     and reso."rating" > 0
  order by reso."completedAt" desc
  `, [user.id])
  }
}