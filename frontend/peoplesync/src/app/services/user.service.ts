import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Profile } from "../interfaces/user.interface.js";
import { BACKEND } from "../config/Config.js";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private path: string = BACKEND + "/api/users";

    constructor(private http: HttpClient) { }

    getUser(username: string | null): Observable<Profile> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<Profile>(this.path + '/' + username, httpOptions);
    }

    updateUser(body: Profile) {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('user');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.put<Profile>(this.path + '/' + username, body, httpOptions);
    }
}