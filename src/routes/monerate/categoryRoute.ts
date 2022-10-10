import { Router } from "express"

const categoryRoute = Router()

// categoryRoute.post('/', authMiddleware, async (req: MyAuthRequest, res) => {
//     const sentCategory = req.body as Category
//     const user = req.user
//     const categoryRepo = getCustomRepository(CategoryRepository)

//     try {
//         if (sentCategory.id) {
//             const results = await categoryRepo.find({ id: sentCategory.id, user })
//             if (!results.length) {
//                 return res.status(400).json(new MyErrorsResponse('User is not owner of this category.'))
//             }
//         }

//         await categoryRepo.save({
//             id: sentCategory.id,
//             user: user,
//             name: sentCategory.name,
//             bgColor: sentCategory.bgColor,
//             icon: sentCategory.icon
//         })
//         const categories = await categoryRepo.getCategoriesFromUser(user)

//         return res.json(categories)
//     } catch (err) {
//         myConsoleError(err.message)
//         return res.status(400).json(new MyErrorsResponse(err.message))
//     }
// })

// categoryRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
//   const categoryRepo = getCustomRepository(CategoryRepository)

//   const user = req.user

//   try {
//     const categories = await categoryRepo.getCategoriesFromUser(user)
//     return res.json(categories)
//   } catch (err) {
//     myConsoleError(err.message)
//     return res.status(400).json(new MyErrorsResponse(err.message))
//   }
// })

// categoryRoute.delete(
//   "/:id",
//   authMiddleware,
//   async (req: MyAuthRequest, res) => {
//     const categoryRepo = getCustomRepository(CategoryRepository)
//     const { user } = req
//     const categoryId = parseFloat(req.params.id)

//     try {
//       const result = await categoryRepo.delete({ id: categoryId, user })
//       if (result.affected) {
//         const categories = await categoryRepo.getCategoriesFromUser(user)
//         return res.status(200).json(categories)
//       } else {
//         return res
//           .status(400)
//           .json(
//             new MyErrorsResponse("Category id not found, or user is not owner.")
//           )
//       }
//     } catch (err) {
//       myConsoleError(err.message)
//       return res.status(400).json(new MyErrorsResponse(err.message))
//     }
//   }
// )

export default categoryRoute
