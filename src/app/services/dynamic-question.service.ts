import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection,getDocs, getDoc, doc, query, where, DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CollectionsDB, ImageQuestion, MultipleQuestion, Question, QuestionDownloadDTO } from '../models/questions.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicQuestionService {

  constructor(private firestore: Firestore) {}  


  private get questionsCollectionRef() {
    return collection(this.firestore, this.questionsCollectionName);
  }

  private get questionsCollectionName(): string {
    return CollectionsDB.Questions;
  }

  async getQuestionsByDifficulty(levelColumn: number, levelRow: number) {
    const collectionRef = collection(this.firestore, this.questionsCollectionName);
    const querySnap = query(collectionRef, where('difficultLevelColumn', '==', levelColumn), where('difficultLevelRow', '==', levelRow));
    const querySnapshot = await getDocs(querySnap);
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



}
