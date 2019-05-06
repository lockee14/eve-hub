import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Subscription, BehaviorSubject} from 'rxjs';

import { DataProviderService } from '../../data-provider.service';
import { AppraisalService } from '../appraisal.service';
import { i18n_REGIONS } from '../../i18n_regions-list';

@Component({
  selector: 'app-appraisal-content',
  templateUrl: './appraisal-content.component.html',
  styleUrls: ['./appraisal-content.component.css']
})
export class AppraisalContentComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  // public i18n_regions = i18n_REGIONS;
  public i18n_regions = JSON.parse(JSON.stringify(i18n_REGIONS)); // temporary solution before implementing all regions in the backend
  public i18n_selectedRegion: number = 10000002;
  private appraisal: string = '';
  public contentError = new BehaviorSubject({error: false, type: ''});
  private itemfield;
  public lang: BehaviorSubject<any>;

  constructor(
    private appraisalService: AppraisalService,
    private route: ActivatedRoute,
    private dataProviderService: DataProviderService
    ) { }

  ngOnInit() {
    this.lang = this.dataProviderService.lang;
    delete this.i18n_regions['10000000']; // temporary solution before implementing all regions in the backend
    const sub = this.route.firstChild.paramMap.subscribe((params: ParamMap) => {
      if (params.get('hash')) {
        this.appraisalService.getOldAppraisal(params.get('hash'));
      }
    });
    this.subscription.push(sub);
    this.itemfield = document.getElementById('itemfield');
  }

  ngOnDestroy() {
    this.subscription.forEach(element => element.unsubscribe());
  }

  clear() {
    this.itemfield.value = '';
  }

  submit() {
    const t = <HTMLInputElement>document.getElementById('itemfield');
    if ( t.value === '') {
      this.contentError.next({error: true, type: 'this field is required'});
    } else if (t.value.trim() !== this.appraisal) {
      this.contentError.next({error: false, type: ''});
      this.appraisal = t.value.trim(); // pour verifier qu'une estimation n'a pas deja été faites
      this.appraisalService.handleData({
        id: this.i18n_selectedRegion,
        name: this.i18n_regions[this.i18n_selectedRegion][this.lang.getValue()]
      }, t.value);

    }
  }

  byId(item1: any, item2: any) {
    return item1 && item2 ? ~~item1 === ~~item2 : false;
  }
}
