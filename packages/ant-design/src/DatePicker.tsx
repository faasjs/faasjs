import type { Dayjs } from 'dayjs'
import type { PickerDateProps } from 'antd/es/date-picker/generatePicker'

import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'

import 'antd/es/date-picker/style'

export type DatePickerProps = PickerDateProps<Dayjs>
export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)
