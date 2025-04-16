export function isEmail(string) {
    return (string.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))

}

export function isValidPassword(string) {
    return string.match(/^(?=.{6,16})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/)

}