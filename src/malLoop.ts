import { notify } from "node-notifier"
import { dataSource } from "./dataSource"
import { scrapeMal } from "./utils/mal/scrapeMal"

dataSource.initialize().then(async () => {
  while (true) {
    await scrapeMal().catch((e) => {
      notify("Error while scraping")
    })
  }
})
