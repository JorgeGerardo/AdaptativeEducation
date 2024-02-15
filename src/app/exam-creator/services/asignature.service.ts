import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from '@angular/fire/firestore';
import { Asignature, AsignatureDTO } from 'src/app/models/asignature.model';
import { CollectionsDB } from 'src/app/models/questions.model';
import { FirebaseError } from '@angular/fire/app';

@Injectable()
export class AsignatureService {
  constructor(private firestore: Firestore) {}

  private get collectionRef() {
    return collection(this.firestore, this.asignaturesCollectionName);
  }

  async addAsignature(asignatureName: AsignatureDTO) {
    const collectionRef = this.collectionRef;
    var docRef: DocumentReference<DocumentData> | undefined;
  
    await addDoc(collectionRef, asignatureName)
      .then((ref) => {
        docRef = ref;
        console.log('Document written with ID: ', ref.id);
      })
      .catch((error: FirebaseError) => {
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
      });
  
    return docRef?.id;
  }
  
  // async addAsignature(asignatureName: AsignatureDTO) {
  //   const collectionRef = this.collectionRef;
  //   var isCorrect = false;
  //   await addDoc(collectionRef, asignatureName)
  //     .then(() => (isCorrect = true))
  //     .catch((error: FirebaseError) => {
  //       console.log('Error code:', error.code);
  //       console.log('Error message:', error.message);
  //       isCorrect = false;
  //     });
  //   return isCorrect;
  // }

  async getDocAsignatures(): Promise<Asignature[]> {
    const collectionRef = await collection(
      this.firestore,
      this.asignaturesCollectionName
    );
    const querySnapshot = await getDocs(collectionRef);
    var asignatures: Asignature[] = [];
    querySnapshot.docs.forEach((doc) => {
      const document = doc.data();
      if ('name' in document) {
        let asignature: Asignature = {
          name: document['name'],
          id: doc.id,
        };
        asignatures.push(asignature);
      }
    });
    return asignatures;
  }

  async deleteAsignature(asignature: Asignature): Promise<boolean> {
    var isCorrectly = false;

    const docRef = doc(
      this.firestore,
      `${this.asignaturesCollectionName}/${asignature.id}`
    );
    await deleteDoc(docRef)
      .then((resolve) => (isCorrectly = true))
      .catch((error) => (isCorrectly = false));
    return isCorrectly;
  }

  public get asignaturesCollectionName(): string {
    return CollectionsDB.Asignatures;
  }
}
