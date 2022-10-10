import { Router } from "express"
import { getCustomRepository } from "typeorm"
import FollowingTagRepository from "../repositories/feed/FollowingTagRepository"
import ResourceRepository from "../repositories/relearn/ResourceRepository"
import UserRepository from "../repositories/UserRepository"

const aws = require("aws-sdk")

const multer = require("multer")

const userRoute = Router()

const userRepo = getCustomRepository(UserRepository)
const resourceRepo = getCustomRepository(ResourceRepository)
const followingTagsRepo = getCustomRepository(FollowingTagRepository)

//  PE 2/3
// userRoute.get(
//   "/:username/all",
//   authMiddleware,
//   async (req: MyAuthRequest, res) => {
//     const username = req.params["username"];

//     const userInfo: UserInfoDto = newUserInfo();

//     try {
//       // username exists?
//       const user = await userRepo.findOne({ username });
//       if (!user) {
//         return res
//           .status(404)
//           .json(new MyErrorsResponse("User not found", "username"));
//       }

//       // get all resources (if req.user === user); otherwise, just get from public lists
//       userInfo.resources = await resourceRepo.getRatedResourcesFromUser(
//         user,
//         user.id === req.user.id
//       );

//       // profile
//       userInfo.profile = await getRepository(Profile).findOne({
//         userId: user.id,
//       });

//       // public lists
//       userInfo.publicLists = await getRepository(Tag).find({
//         userId: user.id,
//         isPrivate: false,
//       });

//       // private tags
//       if (user.id === req.user.id) {
//         userInfo.privateLists = await getRepository(Tag).find({
//           userId: user.id,
//           isPrivate: true,
//         });
//       }

//       userInfo.followingUsers = await followingTagsRepo.getFollowingUsers(user);
//       userInfo.followers = await followingTagsRepo.getFollowers(user);

//       userInfo.publicSkills =
//         await getSkillRepository().findPublicSkillsFromUser(user.id);

//       return res.json(userInfo);
//     } catch (err) {
//       myConsoleError(err.message);
//       return res.status(400).json(new MyErrorsResponse(err.message));
//     }
//   }
// );

//  PE 2/3
// userRoute.get(
//   "/:username/rated-resources",
//   authMiddleware,
//   async (req: MyAuthRequest, res) => {
//     const username = req.params["username"]

//     try {
//       // username exists?
//       const user = await userRepo.findOne({ username })

//       const resources = await resourceRepo.getRatedResourcesFromUser(
//         user,
//         user.id === req.user.id
//       )
//       return res.json(resources)
//     } catch (err) {
//       myConsoleError(err.message)
//       return res.status(400).json(new MyErrorsResponse(err.message))
//     }
//   }
// )

//  PE 2/3
// userRoute.put("/profile", authMiddleware, async (req: MyAuthRequest, res) => {
//   const profile: Profile = req.body

//   // picture will be saved one request later (also, we don't want empty picture strings)
//   delete profile["pictureName"]
//   delete profile["pictureUrl"]

//   try {
//     const profileRepo = getRepository(Profile)
//     await profileRepo.save(profile)

//     // do this so we can retrieve the profile picture altogether
//     const savedProfile = await profileRepo.findOne({ userId: req.user.id })
//     return res.json(savedProfile)
//   } catch (err) {
//     myConsoleError(err.message)
//     return res.status(400).json(new MyErrorsResponse(err.message))
//   }
// })

// when you follow many tags from an username
// userRoute.post(
//   "/:username/followingTags",
//   authMiddleware,
//   async (req: MyAuthRequest, res) => {
//     try {
//       const username = req.params["username"]
//       const tagFollows = req.body as TagFollowPostDto[]

//       const repo = getRepository(FollowingTag)

//       const foundOwner = await userRepo.findOne({ username })

//       const tagFollowsToNotify = await getFollowingTagRepo().saveTagFollows(
//         req.user.id,
//         foundOwner.id,
//         tagFollows
//       )

//       // notify user
//       if (tagFollowsToNotify.length > 0) {
//         const notification = await getCustomRepository(
//           NotificationRepository
//         ).createFollowingNotification(req.user, foundOwner, tagFollowsToNotify)
//       }

//       const userFollowingTags = await repo.find({
//         where: { follower: req.user },
//       })
//       return res.json(userFollowingTags)
//     } catch (err) {
//       myConsoleError(err.message)
//       return res.status(400).json(new MyErrorsResponse(err.message))
//     }
//   }
// )

//  PE 2/3
// userRoute.get(
//   "/:username/followingTags",
//   authMiddleware,
//   async (req: MyAuthRequest, res) => {
//     const username = req.params["username"]

//     try {
//       // username exists?
//       const user = await userRepo.findOne({ username })

//       const followingTags = await followingTagsRepo.find({
//         where: { follower: user },
//       })
//       return res.json(followingTags)
//     } catch (err) {
//       myConsoleError(err.message)
//       return res.status(400).json(new MyErrorsResponse(err.message))
//     }
//   }
// )

//  PE 2/3 >
// userRoute.post(
//   "/picture",
//   multer(multerConfig).single("file"),
//   authMiddleware,
//   async (req: MyAuthRequest, res) => {
//     const { key, location } = req.file as any

//     const profileRepo = getRepository(Profile)

//     try {
//       const profile = await profileRepo.findOne({
//         where: { userId: req.user.id },
//       })

//       // deletando a imagem anterior do usuário
//       const s3 = new S3()
//       const deletePromise = s3
//         .deleteObject({
//           Bucket: "endoh",
//           Key: profile.pictureName,
//         })
//         .promise()

//       // continuando..
//       profile.pictureName = key
//       profile.pictureUrl = location

//       const savedProfile = await profileRepo.save(profile)
//       return res.status(200).json(savedProfile.pictureUrl)
//     } catch (err) {
//       myConsoleError(err.message)
//       return res.status(400).json(new MyErrorsResponse(err.message))
//     }
//   }
// )

export default userRoute
