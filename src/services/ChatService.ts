import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
//import necessary services..
import {AuthenticationService} from "./AuthenticationService";

//import rxjs.
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService
{
    constructor(private authService:AuthenticationService
    ,private firebaseDatabase:AngularFireDatabase)
    {
    }

    searchInDatabase(nameOfUser:string):Observable<any> // query by name
    {
        return this.firebaseDatabase.list("/users/",
        {
            query:{orderByChild:"username",limitToFirst:1,equalTo:nameOfUser}
        }).
        map((feedback)=> 
        {
            return (feedback.length > 0)?(feedback[0]):(null);
        });
    }

    createChatInDatabase(chat):firebase.Promise<any>
    {
        return this.firebaseDatabase.list("/chats").push(chat).
        then((newChat)=> 
        {
            let idOfNewChat = newChat.path.o[1];
            this.addChatRefForEachUser(idOfNewChat,chat["members"]);
            return true;
        }).
        catch((error:Error)=>{return error});
    }

    private addChatRefForEachUser(idOfNewChat:string,chatMembers:Object)
    {
        for(let thisMemberId in chatMembers)
        {
            this.firebaseDatabase.object("/users/"+thisMemberId+"/chats/"+idOfNewChat).set(true);
        }
    }
    private getChatsInfo(listOfChatId):Array<Object>
    {
        let chatsInfo = [];
        for(let index = 0; index < listOfChatId.length; index++)
        {
            this.firebaseDatabase.object("/chats/"+listOfChatId[index]).subscribe((thisChat)=>
            {
                chatsInfo.push(thisChat);
            },(error:Error)=>{});
        }
        return chatsInfo;
    }

    getChatsByUserId(userId:string):Observable<any>
    {
        return this.firebaseDatabase.list("/users/"+userId+"/chats/").
        map((allChats)=>
        {
            let chats = [];
            for(let i = 0; i < allChats.length; i++)
            {
                chats.push(allChats[i].$key);
            }
            return this.getChatsInfo(chats);
        });
    }


}