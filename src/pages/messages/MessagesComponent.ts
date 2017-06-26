import { Component, ViewChild} from '@angular/core';
//import necessary ionic components
import { NavController,NavParams,AlertController,Content} from 'ionic-angular';
//import rxjs
import { Subscription } from 'rxjs/Subscription';

//import necessay services
import {AuthenticationService} from "../../services/AuthenticationService";
import {ChatService} from "../../services/ChatService";
import {UserInfoService} from "../../services/UserInfoService";
import {MessagingService} from "../../services/MessagingService";
@Component({
    selector:"messagesComponent",
    templateUrl:"./MessagesComponent.html"
})

export class MessagesComponent
{
    chatName:string;
    chatId:string;
    chatMembers:Object;
    messages:Array<any>; // will contain objects {from:"username",message:"blah blah"}
    message:string; // message user types in input field..
    usernameObservable:Subscription;
    messagesObservable:Subscription;
    usernameOfLoggedInUser:string;//username of logged in user.
    idOfLoggedInUser:string;//id of logged in user.
    @ViewChild(Content) content: Content;
    constructor(private alertController:AlertController,private authService:AuthenticationService,
    private userInfoService:UserInfoService,
    private messagingService:MessagingService,
    private navParams:NavParams)
    {
        this.messages = [];
        this.usernameObservable = null;
    }

    ionViewWillEnter()
    {
        this.chatName = this.navParams.get("chatName");
        this.chatId = this.navParams.get("chatId");
        this.chatMembers = this.navParams.get("chatMembers");
        this.message = "";
    }

    ionViewDidEnter()
    {
        this.idOfLoggedInUser = this.userInfoService.getUserId();
        this.getUserNameOfLoggedInUser();
        this.getMessages();
        
    }

    ionViewDidLeave()
    {
        if(this.usernameObservable != null && this.messagesObservable != null)
        {
            this.messagesObservable.unsubscribe();
            this.usernameObservable.unsubscribe();
        }
    }
    getMessages()
    {
        this.messagesObservable = this.messagingService.getMessagesFromDatabase(this.chatId).
        subscribe((allMessages)=>
        {
            this.messages = allMessages;
        });
    }
    getUserNameOfLoggedInUser()
    {
        this.usernameObservable = this.userInfoService.getUserNameById(this.idOfLoggedInUser).subscribe((theUsersName)=>
        {
            this.usernameOfLoggedInUser = theUsersName;
        });
    }

    showErrorAlertIfTheresError(feedback:Object)
    {
        let errorAlert = null;
        if(!feedback["isSuccessfull"]) // if theres anything wrong with pushing message to db.
        {
            errorAlert = this.alertController.create(
            {
                title:"Error:",
                subTitle:feedback["message"],
                buttons:["OK"]
            });
            errorAlert.present();
        }
    }
    sendMessage()
    {
        //message is an object that contains chatId,fromUsername,fromId,message. We need chatId to
        //figure out what chat this message belongs to. fromUsername is the username of the logged in user
        //(person who sent the message) and fromId is the id of logged in user(person who sent the message)
        //message is the message itself the logged in user is sending.
        let message = {chatId:this.chatId,fromUsername:this.usernameOfLoggedInUser,fromId:this.idOfLoggedInUser,message:this.message}; 
        this.messagingService.pushMessageToDatabase(message).then((feedback)=>
        {
            this.content.scrollToBottom(); // scroll to bottom, so user can see new messages.
            this.showErrorAlertIfTheresError(feedback);
        });

        this.message = ""; // clear input after sending message.
    }
}