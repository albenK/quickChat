import {Injectable} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

//import rxjs.
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//import necessary services.
import {UserInfoService} from "./UserInfoService";
/*
    NOTES: This service is to be injected into MessagingComponent.
    The purpose of this service is to get all messages for a chat and
    users to push new messages into db.

*/
@Injectable()
export class MessagingService
{
    constructor(private firebaseDatabase:AngularFireDatabase,
    private userInfoService:UserInfoService)
    {

    }
    getMessagesFromDatabase(chatId:string):Observable<Array<Object>> //get messages based on chatId.
    {
        return this.firebaseDatabase.list("/chatMessages/"+chatId).map((messages)=>
        {
            return messages.map((eachMessageObject,index)=>
            {
                return {key:eachMessageObject.$key,fromId:eachMessageObject.fromId,fromUsername:eachMessageObject.fromUsername,message:eachMessageObject.message};
            });
        });
    }
    pushMessageToDatabase(messageInfo:Object):firebase.Promise<Object> // push message object to database.
    {
        let idOfTheChat = messageInfo["chatId"];
        let messageObject = {fromUsername:messageInfo["fromUsername"],fromId:messageInfo["fromId"],message:messageInfo["message"]};
        return this.firebaseDatabase.list("/chatMessages/"+idOfTheChat).push(messageObject).
        then((newMessage)=>
        {
            //just return this object since we successfully pushed new message to db.
           return {isSuccessfull:true};
        }).
        catch((error:Error)=> 
        {
            let feedbackObject = {isSuccessfull:false,message:error.message};
            return feedbackObject;
        });
    }



}