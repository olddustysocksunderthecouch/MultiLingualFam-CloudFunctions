export const Validators = {
  exists: (variable: any): boolean => {
    const doesExist: boolean = !!variable && variable !== null && variable !== undefined
    if (!doesExist) console.log(`Exists?: ${doesExist}`)
    return doesExist
  },
  isType: (variable: any, type: string): boolean => {
    const hasType = typeof variable === type
    if (!hasType) console.log(`Has type '${type}'?: ${hasType}, it is ${typeof variable}`)
    return hasType
  }
}
