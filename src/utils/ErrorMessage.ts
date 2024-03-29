export class MyErrorsResponse {
  private errors: MyError[]

  constructor(message = "", field = "") {
    this.errors = []
    if (message.length || field.length) {
      this.errors.push({ field, message })
    }
  }

  addError(message: string, field?: string) {
    this.errors.push({ message, field: field || "" })
  }

  addErrors(errors: MyError[]) {
    this.errors = this.errors.concat(errors)
    return this
  }
}

export interface MyError {
  message: string
  field: string
}
