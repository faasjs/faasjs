import type { Dayjs } from 'dayjs'
import type { PickerDateProps } from 'antd/es/date-picker/generatePicker'

import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs.js'
import generatePicker from 'antd/es/date-picker/generatePicker/index.js'

import 'antd/es/date-picker/style/index.js'

export type DatePickerProps = PickerDateProps<Dayjs>
export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)
