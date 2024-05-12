import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, Profile } from "../interfaces/user.interface.js";
import { BACKEND } from "../config/Config.js";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private path: string = BACKEND + "/api/users";

    constructor(private http: HttpClient) { }

    getUser(id: string | null): Observable<Profile> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<Profile>(this.path + '/' + id, httpOptions);
    }

    updateUser(body: Profile) {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.put<Profile>(this.path + '/' + id, body, httpOptions);
    }

    getUsers(): Observable<User[]> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<User[]>(this.path + "/notequal/" + localStorage.getItem('id'), httpOptions);
    }
}