export interface User {
    username: string,
    email: string,
    password: string
}

export interface Profile {
    username: string,
    email: string,
    password?: string,
    profileImage: string
}