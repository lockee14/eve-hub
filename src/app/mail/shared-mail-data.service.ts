import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subscription, of, Subject, BehaviorSubject, zip, forkJoin, combineLatest } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap, share, take } from 'rxjs/operators';

import { MailService } from './../eve-angular-client/api/mail.service';
import { CharacterService } from './../eve-angular-client/api/character.service';

import { DataProviderService } from './../data-provider.service';

@Injectable({
  providedIn: 'root'
})

export class SharedMailDataService implements OnDestroy {

  private userData: any; // plutot que de faire ça souscrire à dataProvider.cookieObj$ et recup les donnée à chaque appel de fonctions
  public characterData: any; // idem que pour userdata?
  public headers = new BehaviorSubject<any>(null);
  public labels = new BehaviorSubject<any>(null);
  public currentLabel = new BehaviorSubject<any>(null);
  public moreMail = new BehaviorSubject<any>(false);
  public userData$: Observable<any>;
  public mailData: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private dataProviderService: DataProviderService,
    private mailService: MailService,
    private characterService: CharacterService
    ) {
    const subUserData = this.dataProviderService.userData$;
    const subCharacterData = this.dataProviderService.characterData$;
    // this.userData$ = zip(subUserData, subCharacterData); // .pipe(share());
    this.userData$ = combineLatest(subUserData, subCharacterData); // .pipe(share());
    const sub = this.userData$.subscribe( data => {
      // console.log('nouvelle valeur de userdata dans sharedMailDataService: ', data);
      this.userData = data[0];
      this.characterData = data[1];
    });
    // const sub = this.userData$.subscribe( data => {
    //     console.log('nouvelle valeur de userdata dans sharedMailDataService: ', data);
    //     this.userData = data[0];
    //     this.characterData = data[1];
    //   });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  uniq(id) {
    const seen = {};
    return id.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }

  getMailingListsHeaders(label, lastMailId: number) {
    const mailHeaders$ = this.mailService.getCharactersCharacterIdMail(
      this.characterData.CharacterID,
      undefined, undefined,
      undefined,
      lastMailId, // lastMailId
      this.userData.access_token
    );
    mailHeaders$.pipe(
      map((headers: any[]) => {
        const result = [];
        for (const header in headers) {
          if (headers[header].labels.length === 0) { // mailing list n'a pas de label_id et ses mail non plus
            headers[header].labelName = 'Mailing_Lists';
            headers[header].from = {name: ''};
            result.push(headers[header]);
          }
        }
        return result;
      }),
      take(1)
    );
    return mailHeaders$;
  }

  getMailsHeaders(label, lastMailId?: number) {
    let mailHeaders$: Observable<any>;
    if (lastMailId === undefined) {
      mailHeaders$ = this.mailService.getCharactersCharacterIdMail(
        this.characterData.CharacterID,
        undefined, undefined,
        [label.label_id],
        undefined,
        this.userData.access_token
      );
    } else {
      mailHeaders$ = this.mailService.getCharactersCharacterIdMail(
        this.characterData.CharacterID,
        undefined, undefined,
        [label.label_id],
        lastMailId,
        this.userData.access_token
      );
    }
    mailHeaders$ = mailHeaders$.pipe(
      switchMap( headers => {
        headers = JSON.parse(JSON.stringify(headers));
        let userId = [];
        headers.forEach(element => {
          userId.push(element.from);
        });
        userId = this.uniq(userId);
        const charaData = [];
        userId.forEach(element => {
          charaData.push(this.characterService.getCharactersCharacterId(element));
        });
        return zip(of([headers, userId]), ...charaData);
      }),
      map(x => {
        const temp: any = {};
        const headers = x[0][0];
        const userId = x[0][1];
        const userIdLength = userId.length;
        for (let i = 0; i < userIdLength; i++) {
          temp[userId[i]] = x[1 + i];
        }
        for (const header in headers) {
          headers[header].labelName = label.name;
          headers[header].from = temp[headers[header].from];
        }
        return headers;
      }),
      take(1)
    );
    return mailHeaders$;
  }
  setHeaders(label, lastMailId?: number) { // c'est DEGUEULASSE peu mieu faire?
    // 2 truc different un pour mailing_lists et le reste
    // lasmailid? ou pas?
    // console.log('setHeaders', label, lastMailId);
    let sub;
    if (label.name === 'Mailing_Lists') {

      if (lastMailId !== undefined && label.moreMail) {
        sub = this.getMailingListsHeaders(label, lastMailId);
      } else {
        this.headers.next(label.mailHeaders);
        this.moreMail.next(label.moreMail);
        this.currentLabel.next(label);
      }

    } else {

      if (label.moreMail) {
        sub = this.getMailsHeaders(label, lastMailId);
      } else {
        this.headers.next(label.mailHeaders);
        this.moreMail.next(label.moreMail);
        this.currentLabel.next(label);
      }

    }
    if (sub === undefined) {
      return;
    } else {
      sub.subscribe(headers => {
        const labels = this.labels.getValue();
        const headersLength = headers.length;
          for (const l in labels) {
            if (labels[l].mailHeaders === undefined) { labels[l].mailHeaders = []; }

            if (labels[l].name === label.name) {

              labels[l].mailHeaders.push(...headers);
              if (headersLength < 50 && label.name !== 'Mailing_Lists') {
                labels[l].moreMail = false;
              } else if (headersLength === 0 && label.name === 'Mailing_Lists') {
                labels[l].moreMail = false;
              } else {
                labels[l].moreMail = true;
                labels[l].lastMailId = headers[headersLength - 1].mail_id;
              }

              this.moreMail.next(labels[l].moreMail);
              this.headers.next(labels[l].mailHeaders);
              this.currentLabel.next(labels[l]);
            }
          }
          this.labels.next(labels);
      });
    }
  }

  getLabels() {
    const mailHeaders$ = this.mailService.getCharactersCharacterIdMail(
      this.characterData.CharacterID,
      undefined, undefined, undefined, undefined,
      this.userData.access_token
    );
    const labels$ = this.mailService.getCharactersCharacterIdMailLabels(
      this.characterData.CharacterID,
      undefined, undefined,
      this.userData.access_token
    );

    const sub = forkJoin(mailHeaders$, labels$).pipe(
      map((data: any[]) => {
        const headers = data[0];
        const headersLenght = headers.length;
        const labels = data[1]['labels'];
        const labelsLength = labels.length;
        labels[labelsLength] = {
          color: '#ffffff',
          name: 'Mailing_Lists',
          unread_count: 0,
        };

        let inbox;
        for (const label in labels) { // a degager?
          labels[label].mailHeaders = []; // test
          labels[label].lastMailId = null;
          labels[label].moreMail = true;
          if (labels[label]['name'] === 'Inbox') {
            inbox = label;
          }
        }

        for (const header in headers) { // tri les mail appartenant à des mailing_lists
          if (headers[header].labels.length === 0) { // mailing list n'a pas de label_id et ses mail non plus
            headers[header].labelName = 'Mailing_Lists';
            headers[header].from = {name: ''};
            labels[labelsLength].mailHeaders.push(headers[header]);
            if (headers[header]['is_read'] === undefined || false) {
              labels[labelsLength]['unread_count'] += 1;
            }
          }
        }
        labels[labelsLength].lastMailId = headers[headersLenght - 1].mail_id;
        this.setHeaders(labels[inbox]);
        return labels || [];
      }),
      take(1)
    ).subscribe(data => {
      this.labels.next(data);
    });
    this.subscriptions.push(sub); // inutile car take(1)
  }

  getMailContent(mailId): Observable<any> {
    return this.mailService.getCharactersCharacterIdMailMailId(
        this.characterData.CharacterID,
        mailId,
        undefined, undefined,
        this.userData.access_token
        );
  }

  updateMetadata(mailId, header) {
    const labelName = header.labelName;
    const labels = this.labels.getValue();
    const headers = this.headers.getValue();
    for (const h in headers) {
      if (~~mailId === ~~headers[h].mail_id) {
        headers[h].is_read = true;
      }
    }
    for (const l in labels) {
      if (labels[l].name === labelName) {
        for (const m in labels[l].mailHeaders) {
          if (~~mailId === ~~labels[l].mailHeaders[m].mail_id) {
            labels[l]['unread_count'] -= 1;
          }
        }
      }
    }
    this.headers.next(headers);
    this.labels.next(labels);
    const contents = {
      labels: header.labels,
      read: true
    };
    this.mailService.putCharactersCharacterIdMailMailId(
      this.characterData.CharacterID,
      contents,
      mailId,
      undefined,
      this.userData.access_token
    ).pipe(take(1)).subscribe();
  }

  delete(mailTrash?, mail_id?, labelName?) {
    let headers, labels, deleteReq;
    if (mail_id !== undefined) {
      deleteReq = this.mailService.deleteCharactersCharacterIdMailMailId(
        this.characterData.CharacterID,
        mail_id,
        undefined,
        this.userData.access_token,
        undefined,
        true
      );
      headers = this.headers.getValue();
      for (const h in headers) {
        if (~~mail_id === ~~headers[h].mail_id) {
          headers.splice(h, 1);
        }
      }
      labels = this.labels.getValue();
      for (const l in labels) {
        if (labels[l].name === labelName) {
          for (const m in labels[l].mailHeaders) {
            if (~~mail_id === ~~labels[l].mailHeaders[m].mail_id) {
              labels[l].mailHeaders.splice(m, 1);
            }
          }
        }
      }
    } else {
      const Obs = [];
      for (const t in mailTrash) {
        Obs.push(this.mailService.deleteCharactersCharacterIdMailMailId(
          this.characterData.CharacterID,
          ~~t,
          undefined,
          this.userData.access_token,
          undefined,
          true
        ));
      }
      deleteReq = zip(...Obs);
      headers = this.headers.getValue();
      for (const t in mailTrash) {
        for (const h in headers) {
          if (~~t === ~~headers[h].mail_id) {
            headers.splice(h, 1);
          }
        }
      }
      labels = this.labels.getValue();
      for (const t in mailTrash) {
        for (const l in labels) {
          if (mailTrash[t] === labels[l].name) {
            for (const m in labels[l].mailHeaders) {
              if (~~t === labels[l].mailHeaders[m].mail_id) {
                labels[l].mailHeaders.splice(m, 1);
              }
            }
          }
        }
      }
    }
    this.headers.next(headers);
    this.labels.next(labels);
    deleteReq.pipe(take(1)).subscribe();
  }


}
