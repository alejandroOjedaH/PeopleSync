import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { BACKEND } from "../config/Config.js";

@Injectable({
    providedIn: 'root'
})
export class MessageApiService {
    private path: string = BACKEND + "/api/message";

    constructor(private http: HttpClient) { }

    sendMessage(body: any): Observable<any> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.post<any>(this.path, body, httpOptions);
    }

    getMessages(): Observable<any> {
        const token = localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }
        return this.http.get<any>(this.path + '/' + localStorage.getItem('chatId'), httpOptions);
    }

}