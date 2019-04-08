import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MailService } from '../../eve-angular-client/api/mail.service';
// import { CharacterService } from '../../eve-angular-client/api/character.service';
import { SearchService } from '../../eve-angular-client/api/search.service';

import { Observable, Subscription, of, Subject, BehaviorSubject, timer, zip, from, forkJoin} from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap, mergeMap, merge, concat, take } from 'rxjs/operators';

import { SharedMailDataService } from './../shared-mail-data.service';
import { DataProviderService } from './../../data-provider.service';
import { ERR_MSG_NEW_MAIL } from './err-msg-new-mail';

declare var sceditor: any;

interface ErrMsgNeWMail {
  errorType: {
    lang: string
  };
}

@Component({
  selector: 'app-new-mail',
  templateUrl: './new-mail.component.html',
  styleUrls: ['./new-mail.component.css']
})
export class NewMailComponent implements OnInit, OnDestroy {

  public control: FormGroup;
  public recipient: FormControl;
  public subject: FormControl;
  public contentError = new BehaviorSubject({error: false, type: ''});
  public recipientError: string = '';
  private errMsgNeWMail: ErrMsgNeWMail = ERR_MSG_NEW_MAIL;

  private subscriptions: Subscription[] = [];
  private userData: any;
  private characterData: any;

  constructor(
    private sharedMailDataService: SharedMailDataService,
    private mailService: MailService,
    private dataProviderService: DataProviderService,
    private searchService: SearchService,
    private route: ActivatedRoute, // >> get paramMap method return un observable de urlparametre
    private router: Router,
    ) { }

  /*
    <loc></loc> ?? c'est quoi? propre au jeux probablement, voir pour les autres type de lien: location, character etc
    par ailleurs recupurer les code hexadecimal des autres couleurs, et voir si l'on peu mettre des custom color
      >> possible de definir des customs color mais les faire toute moi même sinon certain comme le noir n'ont pas d'hexa (default color)
  */
  ngOnInit() {
    this.fetchData();
    const mailData = this.sharedMailDataService.mailData;
    const x = document.getElementById('test');
    x.style.width = '100%';
    x.style.height = '300px';
    sceditor.create(x, {
      // format: 'xhtml', // fonctionne mieu avec la version en xhtml >> oui mais non car casse couille à parser
      format: 'bbcode', // pourquoi ai je fais le choix du bbcode en premier lieu? car le html est chient tag pas simple,
        // il faudrait que je modifie le code source
      toolbar: 'bold,italic,underline,size,color,link|source',
      // note: il est possible d'utiliser des couleurs personnalisé mais mieu vaux les faire sois même
      colors: `
      #ffffff,#b2b2b2,#4c4c4c,#000000|
      #ffff00,#00ff00,#ff0000,#0000ff|
      #7f7f00,#007f00,#7f0000,#00007f|
      #7f007f,#00ffff,#ff00ff,#007fff
      `,
      emoticonsEnabled: false,
      icons: 'monocons',
      style: '../text_editor/minified/themes/content/default.min.css'
    });
    if (mailData !== undefined) {
      this.recipient = new FormControl(mailData.to, [
        Validators.required,
        recipientLength
      ]);
      this.subject = new FormControl(mailData.subject, [
        Validators.required,
        subjectLength
      ]);
      const content = `<br>
        --------------------------------<br>
        ${mailData.subject}<br>
        From: ${mailData.to}<br>
        Sent ${mailData.date}<br>
        To: ${mailData.from},<br>
        <br>
        ${mailData.content}`;
      sceditor.instance(x).val('\n' + content, false); // le parser en bbcode
      // sceditor.instance(x).insertText('\n' + content);
    } else {
      this.recipient = new FormControl('', [
        Validators.required,
        recipientLength
      ]);
      this.subject = new FormControl('', [
        Validators.required,
        subjectLength
      ]);
    }
    const doc = document.getElementById('example').getElementsByTagName('iframe')[0].contentDocument;
    doc.getElementsByTagName('html')[0].style.height = '100%';
    doc.getElementsByTagName('body')[0].style.height = '90%';

    this.control = new FormGroup ({
      recipient: this.recipient,
      subject: this.subject,
    });

    function recipientLength(subject: FormGroup) {
      // console.log(subject, subject.value, subject.get('subject'));
      const rec = subject.value.split(',');
      if (rec.length > 50) {
        return {'recipientTooLong': true};
      } else {
        return null;
      }
    }

    function subjectLength(subject: FormGroup) {
      // console.log(subject, subject.value, subject.get('subject'));
      if (subject.value.length >= 1000) {
        return {'subjectTooLong': true};
      } else {
        return null;
      }
    }
  }

  get getSubject() { return this.control.get('subject'); }

  get getRecipient() { return this.control.get('recipient'); }

  errorMsg(inputName) {
    const lang = this.dataProviderService.lang.getValue();
    let error: any = null;
    if (this.control.get(inputName).errors !== null) {
      error = Object.keys(this.control.get(inputName).errors)[0];
    }
    switch (error) {
      case 'subjectTooLong':
        return `${this.errMsgNeWMail[error][lang]}`;
      case 'recipientTooLong':
        return `${this.errMsgNeWMail[error][lang]}`;
      case 'required':
        return `${this.errMsgNeWMail[error][lang]}`;
      case 'noIdForRecipient':
        return `${this.errMsgNeWMail[error][lang]} ${this.recipientError}`;
      default:
        return '';
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  send(event) {
    /*
      ici recuperer les character_id correspondant aux charactere name de To
      envoyé les emails, puis update le label 'sent'
      puis rediriger vers read 'inbox' et notifier que l'email a bien etait envoyé.
    */
    const test = document.getElementById('test');
    const body = sceditor.instance(test).getBody();
    let textValue = sceditor.instance(test).val();
    const to = document.getElementById('to').getElementsByTagName('input')[0].value;
    const subject = document.getElementById('subject').getElementsByTagName('input')[0].value;
    // voir la doc de sceditor pour les details de l'api
    const nameList = to.split(',');
    textValue = bbcodeParser(textValue);
    let error: boolean = false;
    if (textValue.replace(/(\[[a-z=#0-9]+\])|(\[\/[a-z]+\])/g, '').trim() === '') {
      const lang = this.dataProviderService.lang.getValue();
      this.contentError.next({error: true, type: this.errMsgNeWMail['emptyContent'][lang]});
      error = true;
    } else if (textValue.length > 10000) {
      const lang = this.dataProviderService.lang.getValue();
      this.contentError.next({error: true, type: this.errMsgNeWMail['contentTooLong'][lang]});
      error = true;
    } else {
      this.contentError.next({error: false, type: ''});
    }

    if (to.replace(/,+/g, '').trim() === '') {
      this.recipient.setErrors({required: true});
      this.recipient.markAsDirty();
      this.recipient.markAsTouched();
      this.control.updateValueAndValidity();
      error = true;
    } else if (nameList.length >= 50) {
      error = true;
    }

    if (subject.trim() === '') {
      this.subject.setErrors({required: true});
      this.subject.markAsDirty();
      this.subject.markAsTouched();
      this.control.updateValueAndValidity();
      error = true;
    } else if (subject.length >= 1000) {
      error = true;
    }

    if (error) { return; }
    const mail = {
      approved_cost: 0,
      body: textValue,
      recipients: [],
      subject: subject
    };
    const IdList = [];
    nameList.forEach(element => {
      IdList.push(this.searchService.getCharactersCharacterIdSearch(
        ['character', 'alliance', 'corporation'],
        this.characterData.CharacterID,
        element.trim(),
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        this.userData.access_token
      ));
    });
    const sub = zip(...IdList).pipe(
      switchMap(Id => { // ici error utiliser autre chose que switchmap?
        this.recipientError = '';
        Id.forEach((element, i) => { // chaque element doit etre testé, si pas d'id envoyer une erreur
          if (Object.keys(element).length === 0 && Object.keys(element)[0] === undefined) {
            this.recipientError += `${nameList[i]},`;
          } else {
            const tempObj = {
              recipient_id: element[Object.keys(element)[0]][0],
              recipient_type: Object.keys(element)[0]
            };
            mail.recipients.push(tempObj);
            // mailToSend = mail;
          }
        });
        if (this.recipientError !== '') {
          return Observable.create(function(observer) {
            observer.next({error: true});
          });
        } else {
          const sendtestmail = this.mailService.postCharactersCharacterIdMail(
            this.characterData.CharacterID,
            mail,
            undefined,
            this.userData.access_token,
            undefined,
            true
          );
          return sendtestmail;
        }
      })
    ).subscribe( x => {
      if (x['error'] === true) {
        // ici j'affiche les erreurs d'id
        this.recipient.setErrors({noIdForRecipient: true}); // ici le type est {'type':boolean}
        this.recipient.markAsDirty();
        this.recipient.markAsTouched();
        this.control.updateValueAndValidity();
      } else {
        // ici je notifie le succes, raffraichie le contenue de la mailbox et redirige vers inbox
        this.sharedMailDataService.getLabels();
        this.router.navigateByUrl('/mail');
      }
    }); // ici repond avec 372780932 aka le numero de l'email 372780932 oui j'ai verifié
    // donc dans subscribe lorsque je reçois le num le notifier et rediriger vers indox en rafraichissant les mails
    this.subscriptions.push(sub);

    function bbcodeParser(content) { // done? // quoi ça sert si j'utilise la version xhtml?
      content = content.replace(/\[(\/{0,1})([bui]{1})\]/g, (m, p1, p2) => {
        if (p1 === '') {
          return `<${p2}>`;
        } else {
          return `</${p2}>`;
        }
      });
      content = content.replace(/\[(color=#)(\w{6})\]|\[\/(color)\]/g, (m, p1, p2) => { // ici rajouté le bf si blanc ff pour le reste
        if (m === '[/color]') {
          return '</font>';
        } else {
          return p2 === 'ffffff' ? `<font ${p1}bf${p2}>` : `<font ${p1}ff${p2}>`;
          // return `<font ${p1}>`;
        }
      });
      content = content.replace(/\[size=(\d{1})\]|\[\/size\]/g, (m, p1) => {
        if (m === '[/size]') {
          return '</font>';
        } else {
          return `<font size=${p1 * 4}>`;
        }
      });
      content = content.replace(/\n|\r/g, '<br>');
      // const regex = /\[url=((?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)\]|\[\/url\]/g;
      const regex = /\[url=(((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))\]|\[\/url\]/g;
      content = content.replace(regex, (m, p1) => {
        if (m === '[/url]') {
          return '</a>';
        } else {
          return `<a href=${p1}>`;
        }
      });
      content = content.replace(/\[font=[a-zA-Z0-9 ,\-'"]+\]/g, '');
      content = content.replace(/\[\/font\]/g, '');
      content = content.replace(/&nbsp;/g, '');
      return content;
    }
  }

  clear() {
    const x = document.getElementById('test');
    sceditor.instance(x).val('');
  }

  fetchData(): void {
    const sub = this.sharedMailDataService.userData$.subscribe( data => {
      this.userData = data[0];
      this.characterData = data[1];
    });
    this.subscriptions.push(sub);
  }

}
