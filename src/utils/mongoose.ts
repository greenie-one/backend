import { ErrorEnum } from "@/exceptions/errorCodes"
import { HttpException } from "@/exceptions/httpException"
import { getModelWithString, mongoose } from "@typegoose/typegoose"
import { Schema } from "mongoose"

function validateRefPlugin(schema: Schema) {
  const refToValidate: { path: string, ref: string }[] = []
  for (const [path, value] of Object.entries(schema.paths ?? {})) {
    if (value.options.ref) {
      refToValidate.push({ path, ref: value.options.ref })
    }
  }

  schema.pre("save", async function (next) {
    for (const r of refToValidate) {
      const value = this[r.path]
      if (value) {
        const model = getModelWithString(r.ref)
        const found = await model.exists({ _id: value })
        if (!found) {
          next(new HttpException(ErrorEnum.DB_REF_VALIDATION_FAILED, `${r.ref} for path ${r.path} for value ${value}`))
        }
      }
    }
    next()
  })
}

mongoose.plugin(validateRefPlugin)
