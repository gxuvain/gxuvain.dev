import { Array, Option, Schema, String } from 'effect'

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const MONTH_LENGTHS: ReadonlyArray<number> = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
]

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

const isCalendarDate = (value: string): boolean =>
  Option.match(String.match(ISO_DATE_PATTERN)(value), {
    onNone: () => false,
    onSome: ([, year = '', month = '', day = '']) => {
      const monthNumber = Number(month)
      const dayNumber = Number(day)
      const monthLength = Option.getOrElse(
        Array.get(MONTH_LENGTHS, monthNumber - 1),
        () => 0,
      )
      return (
        monthNumber >= 1 &&
        monthNumber <= 12 &&
        dayNumber >= 1 &&
        dayNumber <=
          (monthNumber === 2 && isLeapYear(Number(year)) ? 29 : monthLength)
      )
    },
  })

export const PostFrontmatter = Schema.Struct({
  title: Schema.String.check(Schema.isNonEmpty()),
  description: Schema.String.check(Schema.isNonEmpty()),
  author: Schema.String.check(Schema.isNonEmpty()),
  date: Schema.String.check(
    Schema.makeFilter(value =>
      isCalendarDate(value) ? undefined : 'expected a valid YYYY-MM-DD date',
    ),
  ),
  image: Schema.String.check(
    Schema.isPattern(
      /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/cover\.(?:svg|png|webp|jpe?g)$/,
    ),
  ),
  imageAlt: Schema.String.check(Schema.isNonEmpty()),
  imageWidth: Schema.String.check(Schema.isPattern(/^[1-9][0-9]*$/)),
  imageHeight: Schema.String.check(Schema.isPattern(/^[1-9][0-9]*$/)),
})
export type PostFrontmatter = typeof PostFrontmatter.Type
