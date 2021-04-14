"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const FollowingTag_1 = require("../../entities/feed/FollowingTag");
let FollowingTagRepository = class FollowingTagRepository extends typeorm_1.Repository {
    async getFollowingUsers(follower) {
        return this.query(`
        SELECT json_build_object('userId', FUS.id,
                                 'username', FUS.username,
                                 'fullName', PRO."fullName",
								 'pictureUrl', PRO."pictureUrl") AS "followingUser",
	 	       (SELECT JSON_AGG(B) FROM "following_tag" A
		                     INNER JOIN "tag"		    B ON B.id = A."tagId"
		                          WHERE A."followingUserId" = FUS.id
                                    AND A."followerId" = $1)  AS "tags"
    	  FROM "following_tag" 	FTG
    INNER JOIN "user"			FUS ON FUS.id = FTG."followingUserId"
    INNER JOIN "profile"		PRO	ON PRO."userId" = FUS."id"
         WHERE FTG."followerId" = $1
      GROUP BY FUS.id,
	  		   PRO."fullName",
			   PRO."pictureUrl"`, [follower.id]);
    }
    async getFollowers(user) {
        return this.query(`
        SELECT json_build_object('userId', FUS.id,
                                 'username', FUS.username,
                                 'fullName', PRO."fullName",
								 'pictureUrl', PRO."pictureUrl") AS "follower",
	 	       (SELECT JSON_AGG(B) FROM "following_tag" A
		                     INNER JOIN "tag"		    B ON B.id = A."tagId"
		                          WHERE A."followerId" = FUS.id
                                    AND A."followingUserId" = $1)  AS "tags"
    	  FROM "following_tag" 	FTG
    INNER JOIN "user"			FUS ON FUS.id = FTG."followerId"
    INNER JOIN "profile"		PRO	ON PRO."userId" = FUS."id"
         WHERE FTG."followingUserId" = $1
      GROUP BY FUS.id,
	  		   PRO."fullName",
			   PRO."pictureUrl"`, [user.id]);
    }
    async getMostFollowedUsersByUsersYouFollow(you, returnUpTo = 40) {
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
  `, [you.id, returnUpTo]);
    }
    async getMostFollowedUsersByUsersYouDONTFollow(you, returnUpTo = 10) {
        return this.query(`
        select (select json_build_object('userId', "user".id, 'username', "user".username)
	                from "user" 
                 where "id" = "followingUserId") as user, 
               count("followingUserId") 
          from "following_tag" 
         where "followerId" not in (select "followingUserId"
                                      from "following_tag"
                                     where "followerId" = $1)
		       and "followerId" != $1
      group by "followingUserId" 
			order by count("followingUserId") desc
				 limit $2
  `, [you.id, returnUpTo]);
    }
    async getFeedResources(user) {
        return this.query(`
    select reso."id", 
  		     reso."title", 
  		     reso."url",
  		     reso."thumbnail",
  		     reso."estimatedTime",
  		     reso."dueDate",
  		     reso."rating",
  		     reso."completedAt",
  		     (select json_build_object('id', usu.id,
                                     'username', usu.username,
									                   'pictureUrl', pro."pictureUrl")
              from "user" 		usu
		    inner join "profile"	pro on pro."userId" = usu."id"
             where usu."id" = "followingUserId") as "user",
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
  `, [user.id]);
    }
};
FollowingTagRepository = __decorate([
    typeorm_1.EntityRepository(FollowingTag_1.FollowingTag)
], FollowingTagRepository);
exports.default = FollowingTagRepository;
//# sourceMappingURL=FollowingTagRepository.js.map