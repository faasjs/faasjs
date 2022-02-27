import { transform } from '@faasjs/ts-transform'
import { extname } from 'path'

const skipTypes = /(css|less|sass|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)/

function process (src: string, filename: string, options: any) {
  if (skipTypes.test(extname(filename)))
    return ''

  return transform(src, { filename, })
}

export default { process }
