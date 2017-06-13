import { Component } from '@angular/core';
//import necessary ionic components
import { NavController,NavParams} from 'ionic-angular';
//import necessay services
import {AuthenticationService} from "../../services/AuthenticationService";
import {ChatService} from "../../services/ChatService";

@Component({
    selector:"messagesComponent",
    templateUrl:"./MessagesComponent.html"
})

export class MessagesComponent
{
    chatName:string;
    chatId:string;
    chatMembers:Object;
    messages:Array<any>;
    message:string; // message user types in input field..
    constructor(private authService:AuthenticationService,private chatService:ChatService,
    private navParams:NavParams)
    {
    }

    ionViewWillEnter()
    {
        this.chatName = this.navParams.get("chatName");
        this.chatId = this.navParams.get("chatId");
        this.chatMembers = this.navParams.get("chatMembers");
        this.messages = [];
        this.message = "";

    }

    sendMessage()
    {
        this.messages.push(this.message);
        this.message = "";
    }
}