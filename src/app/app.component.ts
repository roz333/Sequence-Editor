import { Component, OnInit } from '@angular/core';
import { SequencesService } from './shared/services/sequences.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'twistBio';
  private sequences: any;
  public arrSequences: string[];
  public index: number[];
  public annotations: any;
  private flagAnn: boolean;
  public indexToDelete: number;
  signupForm: FormGroup;

  constructor(private sequencesService: SequencesService) { }

  ngOnInit() {

    this.signupForm = new FormGroup({
      'index': new FormControl(null, [Validators.required]),
      'length': new FormControl(null, [Validators.required]),
      'tooltip': new FormControl(null, [Validators.required])
    });

    this.indexToDelete = -1;
    this.annotations = this.sequencesService.getAnnotations();
    this.index = [];
    this.arrSequences = [];
    this.getSequences();
  }

  getSequences() {
    this.sequencesService.getSequences().subscribe(data => {
      this.sequences = data;
      this.sequences = this.sequences.text;
      this.sequences = this.sequences.split('');
      for (let i = 0; i < this.sequences.length; i = i + 50) {
        this.index.push(i + 1);
        this.arrSequences.push(this.sequences.slice(i, i + 50));
      }
    });
  }

  deleteIndexAnnotation(deleteIndex) {
    this.indexToDelete = deleteIndex;
  }

  onSubmit() {
    // this.addAnnotationObject(this.signupForm.value);
    this.sequencesService.addAnnotationToservice(this.signupForm.value);
    console.log('submit : this.annotations before', this.annotations);
    this.annotations = this.sequencesService.getAnnotations();
    console.log('submit : this.annotations after get', this.annotations);
  }
  AddAnnotationFromLine(ann) {
    console.log('ann', ann);
  }

  deleteAnnotation(index) {
    console.log('index', index);

    if (/\S/.test(index)) {

      this.indexToDelete = index;
    }
  }

  onFocusMethod(deleteInput: HTMLInputElement): void {
    deleteInput.value = '';
  }

}

// this.annotations = this.annotations.filter(item => item.index !== myIndex);
// console.log('delete', this.annotations);
