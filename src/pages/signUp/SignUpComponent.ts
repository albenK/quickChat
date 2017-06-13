import { Component } from '@angular/core';
import * as firebase from 'firebase/app';

//import ionic components
import { LoadingController,Loading} from 'ionic-angular';
import { NavController} from 'ionic-angular';
//import rxjs
import { Subscription } from 'rxjs/Subscription';

//import necesary services
import {AuthenticationService} from "../../services/AuthenticationService";
//import necessary components.
import {ChatsComponent} from "../chats/ChatsComponent";
@Component
({
    selector:"signUp",
    templateUrl:"./SignUpComponent.html"
})
export class SignUpComponent
{
    email:string; //used with ngModel
    username:string;//used with ngModel
    password:string; //used with ngModel
    feedbackMessage:string;
    isLoading:boolean; //for sign Up disabled property.
    loader:Loading;
    searchNameInDb:Subscription;
    constructor(private loadingController:LoadingController,
    private navigationController:NavController,
    private authenticationService:AuthenticationService)
    {
         //this.resetValues();
    }

    ionViewDidEnter()
    {
        this.resetValues();
    }

    ionViewDidLeave()
    {
        if(this.searchNameInDb != null)
        { 
            this.searchNameInDb.unsubscribe();
        }
       
    }

     resetValues()
    {
        this.email = "";
        this.username = "";
        this.password = "";
        this.isLoading = false;
        this.feedbackMessage = "";
        this.searchNameInDb = null;
    }

    displayLoadingAndSignUserUp()
    {
        this.isLoading = true; //signUp button is disabled.
        this.loader = this.loadingController.create
        ({
            content:"<h2>Please wait...</h2>",
            dismissOnPageChange:true
        });
        this.loader.present().then(()=>{this.signUp()}); //display loader and sign user up
    }

    signUp()
    {
        this.username = this.username.toLowerCase();
        this.searchNameInDb = this.authenticationService.checkUsername(this.username).subscribe((isUnique)=>
        {
           if(isUnique)
            {
                this.authenticationService.addUserInfoToDatabase(this.email,this.username,this.password).
                then((feedback)=>
                {
                    (feedback === true)?(this.navigationController.setRoot(ChatsComponent))
                    :(this.feedbackMessage = feedback.message);
                });
            }
            else{this.feedbackMessage = "Username already exists!";}
            this.isLoading = false;
            this.loader.dismiss();
        });
    }
}