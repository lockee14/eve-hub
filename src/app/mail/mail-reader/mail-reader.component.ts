import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FocusMonitor} from '@angular/cdk/a11y';
import { trigger, state, style, animate, transition } from '@angular/animations';
// import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable, Subscription, of, Subject, BehaviorSubject, timer, zip, from, forkJoin} from 'rxjs';
import { catchError, map, tap, first, distinctUntilChanged, switchMap, mergeMap, merge, concat, take} from 'rxjs/operators';

import { SharedMailDataService } from './../shared-mail-data.service';
import { DataProviderService } from './../../data-provider.service';

/*
pour plus tard, mettre cette interface dans fichier separer (pour pouvoir l'importer ailleurs)
verifier qu'elle est correcte
faire les autres
*/
interface Header {
    from: {
      ancestry_id?: number;
      birthday?: string;
      bloodline_id?: number;
      corporation_id?: number;
      description?: string;
      gender?: string;
      name?: string;
      race_id?: number;
      security_status?: number;
    };
    is_read: boolean;
    labelName: string;
    labels: number[];
    mail_id: number;
    recipients: {
      recipient_id: number;
      recipient_type: string;
    }[];
    subject: string;
    timestamp: string;
}

@Component({
  selector: 'app-mail-reader',
  templateUrl: './mail-reader.component.html',
  styleUrls: ['./mail-reader.component.css'],
  animations: [ // for an unknow raison the transition don't work... because <mat-expansion-panel [disabled]="false">
    trigger('openClose', [
      state('open', style({
        transform: 'rotateZ(180deg)'
      })),
      state('closed', style({
        transform: 'rotateZ(0deg)'
      })),
      transition('open <=> closed', animate('225ms ease'))
    ]),
  ]
})

export class MailReaderComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  public OpenSelectedMail: number;
  public headers$: Observable<any>;
  private mailTrash: any = {};
  public moreMail$: Observable<any>;
  private currentLabel$: Observable<any>;
  public showWarning: boolean; // get this from cookie through DataProviderService

  constructor(
    private sharedMailDataService: SharedMailDataService,
    public dialog: MatDialog,
    private dataProviderService: DataProviderService
    ) { }

  ngOnInit() {
    this.fetchData();
    this.dataProviderService.mailPreference$.pipe(first()).subscribe(x => this.showWarning = x !== null ? x.showWarning : true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  openDialog(mail_id?, labelName?): void {
    if (mail_id === undefined && Object.keys(this.mailTrash).length === 0) { return; }

    if (this.showWarning) {
      const dialogRef = this.dialog.open(DialogTemplateComponent, {
        id: 'dialog-box',
        ariaDescribedBy: 'deleteMailId',
        // width: '35vw',
        width: '300px',
        // height: '600px',
        panelClass: 'warn-mail-dialog-box',
        data: {delete: false}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (this.showWarning !== result.showWarning) {
          this.showWarning = result.showWarning;
          const prefObj: string = JSON.stringify({showWarning: result.showWarning});
          document.cookie = `mailPreference=${prefObj}; expires=Thu, 01 Jan 2050 00:00:01 GMT;path=/`;
        }

        if (result.delete) {
          this.delete(mail_id, labelName);
        }
      });

    } else {
      this.delete(mail_id, labelName);
    }
  }

  fetchData(): void {
    this.headers$ = this.sharedMailDataService.headers.asObservable().pipe(
      tap(() => {
        this.OpenSelectedMail = 0;
      })// pour eviter qu'un mail figurant dans plusieurs label reste ouvert lors d'un changement de label
    );

    this.moreMail$ = this.sharedMailDataService.moreMail.asObservable();
    this.currentLabel$ = this.sharedMailDataService.currentLabel.asObservable();
  }

  getNextMail() {
    this.currentLabel$.pipe(take(1)).subscribe(label => this.sharedMailDataService.setHeaders(label, label.lastMailId));
  }

  getMailContent(event, mailId: number, header: Header) { // si je veux recuperer l'element qui contient le (click) >> event.currentTarget
    const regexp = /mat-checkbox+/gm;
    const mailContent = event.currentTarget.querySelector('.mat-expansion-panel-content');
    const contain = mailContent.contains(event.target);
    if (!regexp.test(event.target.className) && !contain) { // pourquoi je fais ça deja? pour ne pas trigger le panel si click sur checkbox ou le contenue
      const div = event.currentTarget.querySelector('#mail-content');
      const spinner = div.querySelector('.mat-spinner');

      if (header.is_read === undefined || false) {
        this.sharedMailDataService.updateMetadata(mailId, header);
      }

      if (div.contains(spinner)) {
        this.sharedMailDataService.getMailContent(mailId).pipe(take(1)).subscribe(x => {
          div.innerHTML = this.mailParser(x.body);
        });
      }
      this.OpenSelectedMail = this.OpenSelectedMail === mailId ? 0 : mailId;
    }
  }

  private mailParser(body) { // ça a l'air de fonctionner correctement
    let regex: RegExp;
    body = body.replace(/<font ((size=('|"|)\d{1,2}('|"|) color=('|"|)(#\w{6,8}|\w+)('|"|))|(color=('|"|)(#\w{6,8}|\w+)('|"|) size=('|"|)\d{1,2}('|"|))|(size=('|"|)\d{1,2}('|"|)|color=('|"|)(#\w{6,8}|\w+)('|"|)))>/g, function(match) {
      // (?:size=(?:"|'|))(\d{1,2})(?=(?:"|'|))
      // (?<=size=("|'|))\d{1,2}(?=("|'|)) >> ?<= pose problemes car pas pris en charge par tout les navigateur
      match = match.replace(/(?:size=(?:"|'|))(\d{1,2})(?=(?:"|'|))/, (m, p1) => {
        const p = ~~p1 / 4;
        return p;
      });
      // (?<=color=('|"|)#)\w{8}(?=('|"|)) // old
      // (?:color=(?:'|"|)#)(\w{8})(?=(?:'|"|)) // new
      match = match.replace(/(?:color=(?:'|"|)#)(\w{8})(?=(?:'|"|))/, (m, p1) => p1.substring(2));
      return match;
    });
    regex = /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    body = body.replace(/<a href="\S+">/g, function(match) {
      if (regex.test(match)) {
        return match;
      } else {
        return '';
      }
    });
    // (?<=<)url(?==(((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))>) // old
    // (?:<)(url)(?==(((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))>) // new
    regex = /(?:<)(url)(?==(((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))>)/g;
    // body = body.replace(/(?<=<)url=(?=\S+>)/g, 'a href=');
    body = body.replace(regex, '<a href='/*'a href='*/);
    // (?<=<\/)url(?=>) // old
    // (?:<\/)(url)(?=>) // new
    body = body.replace(/(?:<\/)(url)(?=>)/g, '</a'/*'a'*/);
    return body;
  }

  putToTrash(event, mailId, labelName): void {
    if (mailId in this.mailTrash) {
      delete this.mailTrash[mailId];
    } else {
      this.mailTrash[mailId] = labelName;
    }
  }

  delete(mail_id?, labelName?) {
    this.sharedMailDataService.delete(this.mailTrash, mail_id, labelName);
  }

  newMail(event, type, header?) {
    let mailContent, subject, data;
    switch (type) {
      case 'reply':
        mailContent = event.currentTarget.parentElement.querySelector('#mail-content');
        subject = `RE: ${header.subject}`;
        data = {
          to: header.from.name,
          subject: subject,
          date: header.timestamp,
          from: this.sharedMailDataService.characterData.CharacterName,
          content: mailContent.innerHTML
        };
        this.sharedMailDataService.mailData = data;
        break;
      case 'forward':
        mailContent = event.currentTarget.parentElement.querySelector('#mail-content');
        subject = `RE: ${header.subject}`;
        data = {
          to: '',
          subject: subject,
          date: header.timestamp,
          from: this.sharedMailDataService.characterData.CharacterName,
          content: mailContent.innerHTML
        };
        this.sharedMailDataService.mailData = data;
        break;
      default:
        data = undefined;
        this.sharedMailDataService.mailData = data;
    }
  }
}

@Component({
  selector: 'app-dialog-template',
  templateUrl: './warn-delete-mail.component.html',
  styleUrls: ['./warn-delete-mail.component.css']
})
export class DialogTemplateComponent implements OnInit {

  showWarning: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private focusMonitor: FocusMonitor
    ) {}

  ngOnInit() {
    this.focusMonitor.stopMonitoring(document.getElementById('close-cross'));
  }

  choice(bool: boolean): void {
    this.data.delete = bool;
    this.onNoClick();
  }

  dontShowAgain() {
    this.showWarning = !this.showWarning;
  }

  onNoClick(): void {
    this.dialogRef.close({delete: this.data.delete, showWarning: this.showWarning});
  }

}
