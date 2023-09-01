import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../servicios/usuario/user.service';
import { ChatService } from '../../servicios/chat/chat.service';
import { ToastService } from '../../servicios/toast/toast.service';
import * as moment from 'moment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any = null;
  newMessage: string = '';
  messageListA: any = [];
  messageListB: any = [];
  pressedButton: boolean = false;
  chat: number = 0;
  showSpinner1: boolean = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private chatService: ChatService,
    private authAf: AngularFireAuth,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController

  ) {}

   // end of constructor

  ngOnInit(): void {
    this.user = this.userService.getEmailUser();

    this.chatService.getMessagesA().subscribe((messagesA: any) => {
      if (messagesA !== null) {
        this.messageListA = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
    this.chatService.getMessagesB().subscribe((messagesB: any) => {
      if (messagesB !== null) {
        this.messageListB = messagesB;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
  } // end of ngOnInit


  logoutUser() {
    this.userService.logout();
  }

  // async presentToast(message: string) {
  //   const toast = await this.toastCtrl.create({
  //     message: message,
  //     duration: 2000,
  //     color: 'success',
  //   });
  //   toast.present();
  // }

  showChat4A() {
    this.newMessage = '';
    this.showSpinner(1);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4A

  showChat4B() {
    this.newMessage = '';
    this.showSpinner(2);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4B

  goToClassrooms() {
    this.newMessage = '';
    this.showSpinner(0);
  } // end of goToClassrooms

  // playSoundTransicion() {
  //   const path = '../../../assets/transicion.mp3';
  //   const audio = new Audio(path);
  //   audio.play();
  // }

  // playSoundLogout() {
  //   const path = '../../../assets/logout.mp3';
  //   const audio = new Audio(path);
  //   audio.play();
  // }
  sendMessageA() {
    if (this.newMessage.trim() == '') {
      this.toastService.CrearToast('Debes escribir un mensaje', 'bottom', 'warning');
      return;
    } else if (this.newMessage.trim().length > 21) {
      this.toastService.CrearToast(
        'El mensaje no puede tener más de 21 caracteres',
        'bottom',
        'warning'
      );
      return;
    }
    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageA(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
  } // end of sendMessageA

  sendMessageB() {
    if (this.newMessage.trim() == '') {
      this.toastService.CrearToast('Debes escribir un mensaje', 'bottom', 'warning');
      return;
    } else if (this.newMessage.trim().length > 21) {
      this.toastService.CrearToast(
        'El mensaje no puede tener más de 21 caracteres',
        'bottom',
        'warning'
      );
      return;
    }

    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageB(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
  } // end of sendMessageB


  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const contenedorMensajes = document.getElementById('contenedor-mensajes');
    let toppos: any = [];
    if (lastElement != null) {
      toppos = lastElement.offsetTop;
    }
    if (contenedorMensajes != null) {
      contenedorMensajes.scrollTop = toppos;
    }
  } // end of scrollToTheLastElementByClassName
  
  showSpinner(chatOption: number) {
    this.pressedButton = true;
    this.showSpinner1 = true;
    // this.playSoundTransicion();
    setTimeout(() => {
      this.showSpinner1 = false;
      this.pressedButton = false;
      this.chat = chatOption;
    }, 2000);
  } // end of showSpinner
}