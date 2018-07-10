import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SequencesService } from './shared/services/sequences.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Sequences, ISequence } from './shared/interfaces/sequence.interface';
import { IAnnotation } from './shared/interfaces/annotation.interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sequence Editor';
  private sequences: any;
  public errorFlag: boolean;
  public errorFlagDel: boolean;
  public errorFlagDel2: boolean;
  public arrSequences: Sequences;
  public index: number[];
  signupForm: FormGroup;
  @ViewChild('scrollGoto') scrollGotoIndex: ElementRef;

  private offset = 50;

  constructor(private sequencesService: SequencesService) { }

  ngOnInit() {

    this.signupForm = new FormGroup({
      'index': new FormControl(null, [Validators.required]),
      'length': new FormControl(null, [Validators.required]),
      'tooltip': new FormControl(null, [Validators.required])
    });
    this.errorFlag = false;
    this.errorFlagDel = false;
    this.errorFlagDel2 = false;
    this.index = [];
    this.arrSequences = [];
    this.getSequences();
  }

  getSequences() {
    const annotations = this.sequencesService.getAnnotations();
    this.sequencesService.getSequences().subscribe(data => {
      this.sequences = data['text'].split('');
      for (let i = 0; i < this.sequences.length; i += this.offset) {
        this.arrSequences.push({
          index: i + 1,
          arr: this.sequences.slice(i, i + this.offset),
          from: i + 1,
          to: i + this.offset,
          deleteRect1: false,
          deleteRect2: false,
          // tslint:disable-next-line:no-shadowed-variable
          annotations: ((annotations) => {
            return annotations.filter((annotation: IAnnotation) => annotation.index >= i + 1 && annotation.index <= i + this.offset);
          })(annotations)
        });
      }
    });
  }

  onSubmit() {
    const newAnnotation = this.sequencesService.addAnnotationToservice(this.signupForm.value);
    const seq1: ISequence = this.arrSequences.find((seq: ISequence) => newAnnotation.index >= seq.from && newAnnotation.index <= seq.to);
    seq1.annotations.push(newAnnotation);
    if (seq1.annotations.length > 0) {
      seq1.deleteRect1 = false;
      seq1.deleteRect2 = false;
      seq1.doChange();
    }

  }

  deleteAnnotation(inputIndex) {
    this.errorFlagDel = false;
    this.errorFlagDel2 = false;
    const InputIndexNum = Number(inputIndex);
    if (!this.checksStringWithRegex(inputIndex) && this.checkNumberRange(InputIndexNum)) {
      const seq1: ISequence = this.arrSequences.find((seq: ISequence) => InputIndexNum >= seq.from && InputIndexNum <= seq.to);
      if (seq1.annotations.length > 0) {
        const seqAnn = seq1.annotations;
        for (let i = 0; i < seqAnn.length; i++) {
          this.errorFlagDel2 = false;
          const AnnRange = seqAnn[i].index + seqAnn[i].length;
          if (AnnRange > seq1.to && seqAnn[i].index === InputIndexNum) {
            seq1.deleteRect2 = true;
            this.deleteAnnINSeq(seq1, seqAnn, i, inputIndex);
          } else if (AnnRange <= seq1.to && seqAnn[i].index === InputIndexNum) {
            seq1.deleteRect1 = true;
            this.deleteAnnINSeq(seq1, seqAnn, i, inputIndex);
          } else {
            this.errorFlagDel2 = true;
          }
        }
      } else {
        this.errorFlagDel2 = true;
      }
    } else {
      this.errorFlagDel = true;
    }
  }

  deleteAnnINSeq(foundSeq, seqAnn, i, indexFromInput) {
    this.sequencesService.delAnnotations(seqAnn[i].index);
    foundSeq.doChange();
    seqAnn.splice(i, 1);
  }

  goToAnnotation(inputIndex) {
    this.errorFlag = false;
    const InputIndexNum = Number(inputIndex);
    if (this.checksStringWithRegex(inputIndex) || !(this.checkNumberRange(InputIndexNum))) {
      this.errorFlag = true;
    } else {
      const seq1: ISequence = this.arrSequences.find((seq: ISequence) => InputIndexNum >= seq.from && InputIndexNum <= seq.to);
      if (seq1.annotations.length > 0) {
        let flag = false;
        seq1.annotations.forEach(item => {
          if (item.index === InputIndexNum) {
            this.errorFlag = false;
            flag = true;
            this.scrollGotoIndex.nativeElement.scrollTop = this.arrSequences.indexOf(seq1) * 40;
            console.log('happy item.index', item.index);
          } else if (!flag) {
            this.errorFlag = true;
            console.log('else', item.index);
          }
        });
      } else {
        this.errorFlag = true;
      }

    }
  }
  checksStringWithRegex(index): boolean {
    const res = /^([a-z]{0,})$/.test(index); // checks if empty || only string
    const res2 = /\D+/.test(index); // checks if only digits
    if (res || res2) {
      return true;
    }
    return false;
  }
  checkNumberRange(index): boolean {
    if (index < 35152 && index > 0) {
      return true;
    }
    return false;
  }

  onFocusMethod(deleteInput: HTMLInputElement): void {
    deleteInput.value = '';

    switch (deleteInput['name']) {

      case 'delete':
        this.errorFlagDel = false;
        this.errorFlagDel2 = false;
        break;
      case 'goto':
        this.errorFlag = false;
        break;
    }
  }

}
