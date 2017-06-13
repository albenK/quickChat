import { Component } from '@angular/core';
//import necessary ionic components
import { NavController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { LoadingController,Loading} from 'ionic-angular';

//import necessary services
import {AuthenticationService} from "../../services/AuthenticationService";
import {ChatService} from "../../services/ChatService";
//import necessary components
import {SignInComponent} from "../signIn/SignInComponent";
import {NewChatComponent} from "../../assetComponents/NewChatComponent";
import {MessagesComponent} from "../messages/MessagesComponent";

//import rxjs
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector:"chatsComponent",
  templateUrl: "./ChatsComponent.html"
})
export class ChatsComponent 
{
  allChats:Array<any>;
  getChats:Subscription;
  loader:Loading;
  constructor(private modalController:ModalController,
  private authenticationService:AuthenticationService, private chatService:ChatService,
  public navController: NavController,private loadingController:LoadingController) 
  {
    

  }

  ionViewWillEnter()
  {
    
  }

  ionViewDidEnter()
  {
    if(!this.authenticationService.isUserSignedIn())
    {
      this.navController.setRoot(SignInComponent);
      return;
    }
    this.loader = this.loadingController.create(
      {content:"<h2>Loading Chats. Please wait...</h2>",dismissOnPageChange:true});
    this.loader.present().then(()=>{this.loadChatData()});
  }

  ionViewDidLeave()
  {
    if(this.getChats != null)
    {
      this.getChats.unsubscribe();
    }
  }
  loadChatData()
  {
    let idOfUser = this.authenticationService.getUserId();
    this.getChats = this.chatService.getChatsByUserId(idOfUser).subscribe((chats)=>
    {
      this.allChats = chats;
      this.loader.dismiss();
    },(error:Error)=>{console.log(error.message)});
  }
  
  goToMessages(chat)
  {
    this.navController.push(MessagesComponent,
    {chatId:chat.$key,chatName:chat.name,chatMembers:chat.members});
  }

  openChatModal()
  {
    // let modal = this.modalController.create(NewChatModalComponent);
    // modal.present();
    this.navController.push(NewChatComponent);
  }

  

}
