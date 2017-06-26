import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { IonicApp, IonicErrorHandler, IonicModule,NavController } from 'ionic-angular';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//firebase
import {AngularFireModule} from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
//services
import {AuthenticationService} from "../services/AuthenticationService";
import {ChatService} from "../services/ChatService";
import {UserInfoService} from "../services/UserInfoService";
import {MessagingService} from "../services/MessagingService";

//import necessary components
import { MyApp } from "./app.component";
import {SignInComponent} from "../pages/signIn/SignInComponent";
import {SignUpComponent} from "../pages/signUp/SignUpComponent";
import {ChatsComponent} from "../pages/chats/ChatsComponent";
import {NewChatComponent} from "../assetComponents/NewChatComponent";
import {UserProfileComponent} from "../pages/userProfile/UserProfileComponent";
import {MessagesComponent} from "../pages/messages/MessagesComponent";

const appConfigurations = 
{
  apiKey: "AIzaSyAXdNZmS_upkrGeLzYvPF0Eghs4FyLNtFs",
  authDomain: "quickchat-ae035.firebaseapp.com",
  databaseURL: "https://quickchat-ae035.firebaseio.com",
  projectId: "quickchat-ae035",
  storageBucket: "quickchat-ae035.appspot.com",
  messagingSenderId: "111687359673"
};
@NgModule({
  declarations: [
    MyApp,
    SignInComponent,
    SignUpComponent,
    ChatsComponent,
    NewChatComponent,
    UserProfileComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(appConfigurations),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInComponent,
    SignUpComponent,
    ChatsComponent,
    NewChatComponent,
    UserProfileComponent,
    MessagesComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationService,
    UserInfoService,
    ChatService,
    MessagingService
  ]
})
export class AppModule {}
