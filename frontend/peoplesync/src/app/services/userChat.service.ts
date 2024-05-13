import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User, Profile } from "../interfaces/user.interface.js";
import { BACKEND } from "../config/Config.js";
import { Chat } from "../interfaces/chat.interface.js";

@Injectable({
    providedIn: 'root'
})
export class UserChatService {
    private path: string = BACKEND + "/api/userchat";

    constructor(private http: HttpClient) { }

    getUserChats(idUser: number): Observable<any> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<any>(this.path + "/" + idUser, httpOptions);
    }

    getUserChatsByChatId(idChat: number): Observable<any> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<any>(this.path + "/chat/" + idChat, httpOptions);
    }

    updateUserChat(body: any): Observable<any> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.put<any>(this.path + "/", body, httpOptions);
    }
}