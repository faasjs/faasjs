import type { Dayjs } from 'dayjs'
import type { CalendarProps as AntdProps } from 'antd'

import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generateCalendar from 'antd/es/calendar/generateCalendar'

import 'antd/es/calendar/style'

export type CalendarProps = AntdProps<Dayjs>
export const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig)
