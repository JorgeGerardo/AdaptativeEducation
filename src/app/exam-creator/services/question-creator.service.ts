import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  where,
  query
} from '@angular/fire/firestore';
import {
  CollectionsDB,
  ImageQuestion,
  MultipleQuestion,
  Question,
  QuestionDownloadDTO,
  QuestionUploadDTO,
} from 'src/app/models/questions.model';

@Injectable()
export class QuestionCreatorService {
  constructor(private firestore: Firestore) {}

  async addQuestion(newQuestion: QuestionUploadDTO) {
    const collectionRef = this.questionsCollectionRef;
    var isCorrect = false;
    await addDoc(collectionRef, newQuestion)
      .then(() => (isCorrect = true))
      .catch((error: FirebaseError) => {
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        isCorrect = false;
      });
    return isCorrect;
  }

  async deleteQuestion(question: Question) {
    const docRef = doc(
      this.firestore,
      `${this.questionsCollectionName}/${question.id}`
    );

    var isCorrect = false;
    await deleteDoc(docRef)
      .then(() => (isCorrect = true))
      .catch((error: FirebaseError) => {
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        isCorrect = false;
      });
    return isCorrect;
  }


  async updateQuestion(updatedQuestion: QuestionDownloadDTO, id: string) {
    var isCorrect = false;
    try {
      if (updatedQuestion.id === null) {
        console.log('El id de la pregunta es null');
        return false;
      }
      console.log('ids: ', id);
      const docRef = doc(this.firestore, this.questionsCollectionName, id);
  
      const updatedQuestionPlainObject = JSON.parse(JSON.stringify(updatedQuestion));
      console.log('plane objet is: ', updatedQuestionPlainObject);
      await setDoc(docRef, updatedQuestionPlainObject, { merge: true })
        .then(() => (isCorrect = true))
        .catch((error: FirebaseError) => {
          console.log('Error code:', error.code);
          console.log('Error message:', error.message);
          isCorrect = false;
        });
  
    } catch (error) {
      console.log('El error es: ',error);
    }
    return isCorrect;
  }

  async getQuestionById(id: string): Promise<QuestionDownloadDTO | null> {
    const docRef = doc(this.firestore, this.questionsCollectionName, id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const question = this.verifyQuestionType(docSnap);
      return question;
    } else {
      console.log('No such document!');
      return null;
    }
  }

  async getQuestionsByDifficulty(levelColumn: number, levelRow: number) {
    const collectionRef = collection(this.firestore, this.questionsCollectionName);
    const query1 = query(collectionRef, where('difficultLevelColumn', '==', levelColumn), where('difficultLevelRow', '==', levelRow));
    const querySnapshot = await getDocs(query1);
    var questions: QuestionDownloadDTO[] = [];
    querySnapshot.docs.forEach((doc) => {
      const question = this.verifyQuestionType(doc);
      questions.push(question);
    });
  
    return questions;
  }
  
  
  async getQuestions() {
    const collectionRef = await collection(
      this.firestore,
      this.questionsCollectionName
    );
    const querySnapshot = await getDocs(collectionRef);
    var questions: QuestionDownloadDTO[] = [];
    querySnapshot.docs.forEach((doc) => {
      const question = this.verifyQuestionType(doc);
      questions.push(question);
    });

    return questions;
  }

  private verifyQuestionType(
    doc: QueryDocumentSnapshot<DocumentData, DocumentData>
  ): QuestionDownloadDTO {
    const document = doc.data();

    let question: Question = {
      id: doc.id,
      questionInstruction: document['questionInstruction'],
      asignature: document['asignature'],
      difficultLevelRow: document['difficultLevelRow'],
      difficultLevelColumn: document['difficultLevelColumn'],
      correctAnswer: document['correctAnswer'],
      type: document['type'],
    };

    if (document['type'] === 'multiple') {
      let multipleQuestion: MultipleQuestion = {
        ...question,
        posibleAnwers: document['posibleAnwers'],
      };
      return multipleQuestion;
    } else {
      let imageQuestion: ImageQuestion = {
        ...question,
        images: document['images'],
      };
      return imageQuestion;
    }
  }

  private get questionsCollectionRef() {
    return collection(this.firestore, this.questionsCollectionName);
  }

  private get questionsCollectionName(): string {
    return CollectionsDB.Questions;
  }
}