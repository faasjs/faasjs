import React from 'react'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import { Dayjs } from 'dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'
import 'antd/es/date-picker/style'

export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)
