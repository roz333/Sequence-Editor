import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { SequencesService } from '../shared/services/sequences.service';
import { ISequence } from '../shared/interfaces/sequence.interface';
import { Annotations, IAnnotation } from '../shared/interfaces/annotation.interface';

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
  @ViewChild('myTooltip') rectTooltip: ElementRef;
  @ViewChild('myTooltip2') rectTooltip2: ElementRef;

  private annotations: Annotations;
  @Input() sequence: ISequence;

  private textWidth: number;
  private lastIndexOfLine: number;
  private checkTheRangeAnnotation: number;

  constructor(private renderer: Renderer2, private sequencesService: SequencesService) {
  }

  ngOnInit() {
    this.firstRectFLag = false;
    this.secondRectFlag = false;
    this.thirdRectFLag = false;
    this.textWidth = 840;
    this.lastIndexOfLine = this.sequence.index + this.sequence.arr.length;

    this.sequence.doChange = () => {
      this.annotations = this.sequence.annotations;
      this.drawAnnotations();
      return true;
    };
    this.annotations = this.sequence.annotations;
    this.drawAnnotations();
  }

  private drawAnnotations() {

    this.annotations.forEach((item: IAnnotation) => {
      const letterWidth = 17;
      this.checkTheRangeAnnotation = item.index + item.length;
      const annotationStartPoint = item.index - this.sequence.index;
      if (this.checkIndexInRangeOfRow(item.index)) {

        if (this.checkTheRangeAnnotation <= this.lastIndexOfLine) {

          const calcInPx = (annotationStartPoint + 1) * letterWidth;
          let widthFirstRect = item.length * letterWidth;
          if (this.sequence.deleteRect1) {
            item.index = 0;
            widthFirstRect = 0;
          }
          this.showRect(this.firstRect.nativeElement, widthFirstRect, calcInPx, this.firstRectFLag);
        } else if (this.checkTheRangeAnnotation > this.lastIndexOfLine) {

          const shownLetters = this.lastIndexOfLine - item.index;
          const leftLettersToShow = item.length - shownLetters;
          let widthSecondRect = shownLetters * letterWidth;
          let widthThirdRect = (leftLettersToShow + 1) * letterWidth;
          const calcXpT = (annotationStartPoint + 1) * letterWidth;
          this.thirdRectFLag = true;
          if (this.sequence.deleteRect2) {
            widthSecondRect = 0;
            widthThirdRect = 0;
            item.index = 0;
            this.thirdRectFLag = false;
          }
          this.renderer.setStyle(this.thirdRect.nativeElement, 'display', 'block');
          this.showRect(this.secondRect.nativeElement, widthSecondRect, calcXpT, this.secondRectFlag);
          this.rectSetAtrribute(this.thirdRect.nativeElement, 'width', widthThirdRect);
        }
      }
    });

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
    if ((index > (this.sequence.index - 1)) && index < this.lastIndexOfLine) {
      return true;
    }
    return false;
  }

  showTooltip(e) {

    this.rectTooltip.nativeElement.style.display = 'block';
    if (this.annotations.length > 1 && this.annotations[0].index < this.annotations[1].index) {
      this.rectTooltip.nativeElement.innerHTML = this.annotations[0].tooltip;
    } else {
      this.rectTooltip.nativeElement.innerHTML = this.annotations[this.annotations.length - 1].tooltip;
    }
    this.rectTooltip.nativeElement.style.left = e.pageX + 10 + 'px';
  }

  hideTooltip(e) {
    this.rectTooltip.nativeElement.style.display = 'none';
  }

  showTooltip2(e, third?) {
    this.rectTooltip2.nativeElement.style.display = 'block';
    if (this.annotations.length > 1 && this.annotations[0].index > this.annotations[1].index) {
      this.rectTooltip2.nativeElement.innerHTML = this.annotations[0].tooltip;
    } else {
      this.rectTooltip2.nativeElement.innerHTML = this.annotations[this.annotations.length - 1].tooltip;
    }

    if (this.thirdRect.nativeElement === third) {
      this.rectTooltip2.nativeElement.style.left = e.pageX + 10 + 'px';
    } else { this.rectTooltip2.nativeElement.style.left = e.pageX - 150 + 'px'; }
  }

  hideTooltip2(e) {
    this.rectTooltip2.nativeElement.style.display = 'none';
  }



}




