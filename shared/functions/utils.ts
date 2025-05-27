const dateFormatterOptions = {month: 'long', day: 'numeric'}

export default function formatDate(date: Date){
    // @ts-ignore
    return date.toLocaleDateString('en-US', dateFormatterOptions)
}