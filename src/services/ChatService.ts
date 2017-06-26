import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
//import necessary services..
import {AuthenticationService} from "./AuthenticationService";

//import rxjs.
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
/*
    NOTES: This is just a service to be used within ChatsComponent and NewChatComponent.
    This service has helpfull methods that we will call to enable the users to create chats(NewChatsComponent)
    and to load their current chats(ChatsComponent).
    This is to be injected into the ChatsComponent and NewChatComponent.
    This service has nothing to do with getting messages, or creating messages in db.
    MessagingService will take care of messaging.
*/
@Injectable()
export class ChatService
{
    constructor(private authService:AuthenticationService
    ,private firebaseDatabase:AngularFireDatabase)
    {
    }

    searchInDatabase(nameOfUser:string):Observable<any> // search in db for username
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

    createChatInDatabase(chat):firebase.Promise<any> // used to create a chat object in db
    {
        return this.firebaseDatabase.list("/chats").push(chat).
        then((newChat)=> 
        {
            let idOfNewChat = newChat.path.o[1]; // get the $key of this newly created chat. 
            this.addChatRefForEachUser(idOfNewChat,chat["members"]); // each user has to know all of the chats their in..
            return true;
        }).
        catch((error:Error)=>{return error});
    }

    private addChatRefForEachUser(idOfNewChat:string,chatMembers:Object)
    {
        for(let thisUserId in chatMembers)
        {
            this.firebaseDatabase.object("/users/"+thisUserId+"/chats/"+idOfNewChat).set(true);
        }
    }
    private getChatsInfo(listOfChatId):Array<Object> // called within this.getChatsByUserId()
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