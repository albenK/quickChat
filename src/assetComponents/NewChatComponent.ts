import { Component } from '@angular/core';


//import necessary services..
import {ChatService} from "../services/ChatService";
//import rxjs.
import { Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
//import necessary ionic components
import { LoadingController,Loading} from 'ionic-angular';
@Component({
    selector:"newChatComponent",
    templateUrl:"./NewChatComponent.html"
})

export class NewChatComponent
{
    chatName:string; // used with ngModel.represents chat name.
    memberName:string; // used with ngModel. represents user search.
    errorMessage:string;// if user types same name again, or other errors.
    searchResult:{username,id};
    members:Array<any>;
    searchInDb:Subscription;
    isDisabled:boolean //for disabling create chat button
    loader:Loading;
    constructor(private chatService:ChatService,
    private loadingController:LoadingController)
    {
    }
    resetValues()
    {
        this.isDisabled = true;
        this.chatName = "friendly chat";
        this.memberName = "";
        this.errorMessage = "";
        this.searchResult = null;
        this.members = [];
        this.searchInDb = null;
        this.loader = null;
        
    }

    ionViewDidEnter()
    {
        this.resetValues();
    }
    ionViewDidLeave()
    {
        if(this.searchInDb != null)
        {
            this.searchInDb.unsubscribe();
        }
        this.resetValues();
        
    }
    isAlreadyAMember():boolean //check to see if user already exists in members array.
    {
        let isMember = false;
        for(let i = 0; i < this.members.length; i++)
        {
            if(this.members[i].username === this.searchResult.username)
            {
                isMember = true;
                break;
            }
        }
        return isMember;
    }
    checkToEnableSubmitButton() //for create chat button
    {
        (this.members.length >= 2)?
        (this.isDisabled = false):
        (this.isDisabled = true);
    }
    addMember()
    {
        
        (this.isAlreadyAMember())?(this.errorMessage = "You've already added "+this.searchResult.username):
        (this.members.push(this.searchResult));
        this.checkToEnableSubmitButton();
        this.searchResult = null;
    }
    search()
    {
        this.searchInDb = this.chatService.searchInDatabase(this.memberName).subscribe((user)=>
        {
            if(user != null)
            {
                this.searchResult = {username:user.username,id:user.$key};
                this.errorMessage = "";
                this.memberName = ""; //clear input
            }else{this.errorMessage = "No results for "+this.memberName; this.searchResult = null;}
            
        }, (error:Error)=>
            { 
                if(error)
                {
                    this.errorMessage = error.message;
                }
            });
    }
    createNewChatObject() //for submitting to database
    {
        let newChat = {"members":{},"name":this.chatName};
        for(let i = 0; i<this.members.length; i++)
        {
            let id = this.members[i].id;
            newChat["members"][id] = true;
        }
        return newChat;
    }


    submit()
    {
        let newChat = this.createNewChatObject();
        this.chatService.createChatInDatabase(newChat).then((chat)=>
        {
            
            this.loader.dismiss();
        });
    }
    displayLoadingAndSubmitData()
    {
       this.loader = this.loadingController.create
        ({
            content:"<h2>Please wait...</h2>",
            dismissOnPageChange:true
        });
        this.loader.present().then(()=>{this.submit()});
    }    
    removeUser(member)
    {
        console.log("you want to remove "+member.username);
        this.checkToEnableSubmitButton();
    }
}