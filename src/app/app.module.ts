import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SequencesService } from './shared/services/sequences.service';
import { SequenceLineComponent } from './sequence-line/sequence-line.component';
import { TooltipModule } from 'ngx-tooltip';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SequenceLineComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TooltipModule,
    ReactiveFormsModule
  ],
  providers: [SequencesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
