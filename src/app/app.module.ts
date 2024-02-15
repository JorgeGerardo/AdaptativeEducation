import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment.development';
import { TestComponent } from './components/test/test.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserNavbarComponent } from './components/user-navbar/navbar.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { SwiperModule } from 'swiper/angular';
import { HomeComponent } from './components/home/home.component';
import { MessageModalComponent } from './modals/message-modal/message-modal.component';
import { ModalRequestService } from './services/modal-request.service';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
  declarations: [AppComponent, TestComponent, LoginComponent, UserNavbarComponent, HomeComponent, MessageModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    OverlayModule,
    // Quitame:
    SwiperModule,
    ReactiveFormsModule,
    DialogModule
  ],
  exports: [
    MessageModalComponent
  ],
  providers: [ModalRequestService],
  bootstrap: [AppComponent],
})
export class AppModule {}
