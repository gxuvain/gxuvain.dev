const formatter = new Intl.DateTimeFormat("en", { dateStyle: "long" })

export const formatDate = (date: string) => formatter.format(new Date(date))
