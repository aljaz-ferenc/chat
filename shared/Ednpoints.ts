const BASE_URL = '/api/v1'

export class Endpoints {
    public static users = (userId?: string) => `${BASE_URL}/users${userId ? `/${userId}` : ''}`
}