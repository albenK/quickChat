import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';

//import ionic components
import { LoadingController,Loading} from 'ionic-angular';

//import firebase authentication service.
import {AuthenticationService} from "../../services/AuthenticationService";
import * as firebase from 'firebase/app';

//import necesary components
import {SignUpComponent} from "../signUp/SignUpComponent";
import {ChatsComponent} from "../chats/ChatsComponent";

@Component
({
    selector:"signIn",
    templateUrl:"./SignInComponent.html"
})
export class SignInComponent
{
    email:string; //used with ngModel
    password:string; //used with ngModel
    feedbackMessage:string;
    isLoading:boolean; //for slow connections,to display loading
    loader:Loading;
    constructor(private loadingController:LoadingController, 
    private navController:NavController,
    private authenticationService:AuthenticationService)
    {
        
        this.resetValues();
    }
    ionViewDidEnter()
    {
        this.checkForUserLogin(); //if user is logged in, then redirect them.
    }

    ionViewDidLeave()
    {
        this.resetValues();
    }
    resetValues()
    {
        this.email = "";
        this.password = "";
        this.isLoading = false;
        this.feedbackMessage = "";
    }
    checkForUserLogin()
    {
        if(this.authenticationService.isUserSignedIn())
        {
            this.goToChatsPage();
        }
        return;
    }

    goToChatsPage()
    {
        this.navController.setRoot(ChatsComponent);
        return;
    }

    goToSignUpPage()
    {
        //this.resetValues();
        this.navController.push(SignUpComponent);
    }

    displayLoading()
    {
        this.isLoading = true;
        this.loader = this.loadingController.create
        ({
            content:"<h2>Please wait...</h2>",
            dismissOnPageChange:true,
            duration:5000
        });
        this.loader.present();
    }

    signIn()
    {
        
        this.displayLoading();
        this.authenticationService.login(this.email,this.password).
        then((feedback)=> 
        {
            (feedback === true)?(this.goToChatsPage()):
            (this.feedbackMessage = feedback.message);
            this.isLoading = false;
            this.loader.dismiss();
        });
    }
}