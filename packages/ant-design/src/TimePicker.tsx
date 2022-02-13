import { Dayjs } from 'dayjs'
import { DatePicker } from './DatePicker'
import { PickerTimeProps } from 'antd/es/date-picker/generatePicker'
import { forwardRef } from 'react'

export type TimePickerProps = Omit<PickerTimeProps<Dayjs>, 'picker'>

const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker
    { ...props }
    picker="time"
    mode={ undefined }
    ref={ ref } />
})

TimePicker.displayName = 'TimePicker'

export { TimePicker }
