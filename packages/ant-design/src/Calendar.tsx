import { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/es/generate/dayjs'
import generateCalendar from 'antd/es/calendar/generateCalendar'
import 'antd/es/calendar/style'

export const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig)
