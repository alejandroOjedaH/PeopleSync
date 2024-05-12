import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, Profile } from "../interfaces/user.interface.js";
import { BACKEND } from "../config/Config.js";
import { Chat } from "../interfaces/chat.interface.js";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private path: string = BACKEND + "/api/chat";

    constructor(private http: HttpClient) { }

    createChat(body: any): Observable<Chat> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.post<Chat>(this.path, body, httpOptions);
    }

}