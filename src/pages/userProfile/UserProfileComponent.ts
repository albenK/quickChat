import { Component } from '@angular/core';
import * as firebase from 'firebase/app';

//import ionic components
import { LoadingController,Loading} from 'ionic-angular';
import { NavController} from 'ionic-angular';

//import necesary services
import {AuthenticationService} from "../../services/AuthenticationService";


@Component({
    selector:"userProfileComponent",
    templateUrl:"./UserProfileComponent.html"
})

export class UserProfileComponent
{
    constructor(private authService:AuthenticationService,
    private navController:NavController)
    {

    }
}