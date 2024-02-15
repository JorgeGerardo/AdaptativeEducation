import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Firestore,addDoc,collection } from '@angular/fire/firestore';
import { MultipleQuestionUploadDTO } from 'src/app/models/questions.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  constructor(
    private auth: Auth,
    private authentication: AuthenticationService,
    private firestore: Firestore
  ) {}

  async set() {
    const res = await this.addQuestion({
      asignature: 'Mate',
      correctAnswer: '3',
      difficultLevelColumn: 0,
      difficultLevelRow: 0,
      posibleAnwers: ['p1','p2','p3'],
      questionInstruction: 'Cual es...',
      type: 'multiple',
    })
    
    if(res) console.log('its true');
    else console.log('its false');
    
  }

  async addQuestion( newQuestion:MultipleQuestionUploadDTO):Promise<boolean>{
    try {
      var collectionRef = await collection(this.firestore, newQuestion.asignature);
      await addDoc(collectionRef, newQuestion);  
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  ngOnInit() {
    // this.authentication.checkLoginState();
  }
}
