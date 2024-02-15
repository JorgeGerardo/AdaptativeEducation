import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AsignatureService } from '../../services/asignature.service';
import { Asignature } from 'src/app/models/asignature.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalRequestService } from 'src/app/services/modal-request.service';
import { debounceTime, fromEvent, throttleTime } from 'rxjs';
import { DataSourceAsignatures } from './DataSourceAsignatures.model';

@Component({
  selector: 'app-asignature-manager',
  templateUrl: './asignature-manager.component.html',
  styleUrls: ['./asignature-manager.component.scss'],
})
export class AsignatureManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('addButton') addButton: ElementRef<HTMLButtonElement>;
  // asignatures: Asignature[] = [];
  asignatures = new DataSourceAsignatures();

  cols = ['name', 'options'];
  form = new FormGroup({
    asignatureName: new FormControl('', Validators.required),
  });

  constructor(
    private asignatureService: AsignatureService,
    private modalRequestService: ModalRequestService
  ) {}

  ngAfterViewInit(): void {
    const obs = fromEvent<MouseEvent>(this.addButton.nativeElement, 'click')
      .pipe(throttleTime(3000))
      .subscribe((v) => {
        this.addAsignature();
      });
  }

  public get asignatureInvalid() {
    const field = this.form.get('asignatureName');
    return field?.invalid && field?.touched;
  }

  async ngOnInit() {
    const asignatures = await this.asignatureService.getDocAsignatures();
    this.asignatures.init(asignatures);
    // this.asignatures = await this.asignatureService.getDocAsignatures();
  }

  public get getAsignatureName() {
    const field = this.form.get('asignatureName');
    if (field?.touched && field.valid) return field.value;
    else return null;
  }

  async addAsignature() {
    const asignatureName = this.getAsignatureName;
    if (asignatureName !== null) {
      const id = await this.asignatureService.addAsignature({
        name: asignatureName,
      });

      console.log('El id es: ', id);

      if (id !== undefined) {
        this.modalRequestService.showDialog({
          message: 'Se ha agregado correcatemnte.',
          type: 'Confirm',
        });
        this.asignatures.addAsignature({ name: asignatureName, id: id });
      } else {
        this.modalRequestService.showDialog({
          message:
            'Ha ocurrido un error. No se han podido guardar los datos en el servidor.',
          type: 'Confirm',
        });
      }
    } else this.form.get('asignatureName')?.markAsTouched();
  }

  async deleteAsigature(asignature: Asignature) {
    const res = await this.asignatureService.deleteAsignature(asignature);
    if (res) this.asignatures.deleteAsignature(asignature);
  }
}
