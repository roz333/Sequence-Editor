import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SequencesService } from '../shared/services/sequences.service';

@Component({
  selector: 'app-sequence-line',
  templateUrl: './sequence-line.component.html',
  styleUrls: ['./sequence-line.component.scss']
})
export class SequenceLineComponent implements OnInit, AfterViewInit {

  public firstRectFLag: boolean;
  public secondRectFlag: boolean;
  public thirdRectFLag: boolean;

  @ViewChild('firstRect') firstRect: ElementRef;
  @ViewChild('secondRect') secondRect: ElementRef;
  @ViewChild('thirddRect') thirdRect: ElementRef;
  @ViewChild('textEl') svgText: ElementRef;
  @Input() firstIndexOfLine;
  @Input() sequence;

  private textWidth: number;
  private _indexToDelete: number;
  private lastIndexOfLine: number;
  private checkTheRangeAnnotation: number;
  private _annotations: any;
  private flag: boolean;


  @Input('annotations')
  set annotations(value: any) {
    this._annotations = value;
    this.sequencesService.delAnnotations(this._annotations, this._indexToDelete);
    this._annotations = this.sequencesService.getAnnotations();
    console.log('Input: annotations get-service', this._annotations);
    const AnnotationlastIndex = this._annotations[this._annotations.length - 1].index;
    console.log('AnnotationlastIndex', AnnotationlastIndex);

    if (this.flag && (this.checkIndexInRangeOfRow(AnnotationlastIndex))) {

      const annotationStartPoint = AnnotationlastIndex - this.firstIndexOfLine;
      const calcInPx = (annotationStartPoint + 1) * 17;
      const widthFirstRect = this._annotations[this._annotations.length - 1].length * 17;
      this.showRect(this.firstRect.nativeElement, widthFirstRect, calcInPx, this.firstRectFLag);

    }


  }


  @Input('indexToDelete')
  set indexToDelete(value: any) {
    this._indexToDelete = value;

    this._annotations.forEach(item => {
      const deleteIndex = Number(this._indexToDelete);
      if ((item.index === deleteIndex && this.flag && (this.checkIndexInRangeOfRow(deleteIndex)))) {

        if ((item.index + item.length) < this.lastIndexOfLine) {
          this.firstRectFLag = false;
          this.renderer.setStyle(this.firstRect.nativeElement, 'display', 'none');
        } else if ((item.index + item.length) > this.lastIndexOfLine) {

          this.secondRectFlag = false;
          this.thirdRectFLag = false;
          this.rectSetStyleDisplay(this.secondRect.nativeElement, 'none');
          this.rectSetStyleDisplay(this.thirdRect.nativeElement, 'none');

        }


        setTimeout(() => {
          this.sequencesService.delAnnotations(this._annotations, this._indexToDelete);
          this._annotations = this.sequencesService.getAnnotations();
        }, 0);

      }
    });

  }

  constructor(private renderer: Renderer2, private sequencesService: SequencesService) {
  }



  ngOnInit() {
    this.firstRectFLag = false;
    this.secondRectFlag = false;
    this.thirdRectFLag = false;
    this.textWidth = 840;
    this.flag = false;
    this.lastIndexOfLine = this.firstIndexOfLine + this.sequence.length;

    this._annotations.forEach(item => {
      const letterWidth = 17;
      this.checkTheRangeAnnotation = item.index + item.length;
      const annotationStartPoint = item.index - this.firstIndexOfLine;
      if (this.checkIndexInRangeOfRow(item.index)) {

        if (this.checkTheRangeAnnotation < this.lastIndexOfLine) {
          const calcInPx = (annotationStartPoint + 1) * letterWidth;
          const widthFirstRect = item.length * letterWidth;
          this.showRect(this.firstRect.nativeElement, widthFirstRect, calcInPx, this.firstRectFLag);
        }
        if (this.checkTheRangeAnnotation > this.lastIndexOfLine) {
          const shownLetters = this.lastIndexOfLine - item.index;
          const leftLettersToShow = item.length - shownLetters;
          const widthSecondRect = shownLetters * letterWidth;
          const widthThirdRect = (leftLettersToShow + 1) * letterWidth;
          const calcXpT = (annotationStartPoint + 1) * letterWidth;

          this.thirdRectFLag = true;
          this.renderer.setStyle(this.thirdRect.nativeElement, 'display', 'block');
          this.showRect(this.secondRect.nativeElement, widthSecondRect, calcXpT, this.secondRectFlag);
          this.rectSetAtrribute(this.thirdRect.nativeElement, 'width', widthThirdRect);
        }  // do refactoring
      }
    });

    this.flag = true;
  }
  rectSetAtrribute(rectNum, att, val) {
    this.renderer.setAttribute(rectNum, att, val.toString());
  }
  rectSetStyleDisplay(rectNum, val) {
    this.renderer.setStyle(rectNum, 'display', val);
  }
  showRect(rectNum, width, xPt, flag) {
    flag = true;
    this.rectSetStyleDisplay(rectNum, 'block');
    this.rectSetAtrribute(rectNum, 'width', width);
    this.rectSetAtrribute(rectNum, 'x', xPt);
  }

  ngAfterViewInit() {
    this.svgTextWidth(this.textWidth);
  }

  svgTextWidth(textWidth) {
    this.svgText.nativeElement.textLength.baseVal.newValueSpecifiedUnits(
      SVGLength.SVG_LENGTHTYPE_PX, textWidth);
  }

  checkIndexInRangeOfRow(index: number): boolean {
    if ((index > (this.firstIndexOfLine - 1)) && index < this.lastIndexOfLine) {
      return true;
    }
    return false;
  }


}




