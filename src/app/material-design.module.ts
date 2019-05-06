import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { SecurityLevelColor } from './security-level-color.pipe'; // >> custom pipe >> this module behave the same as a shareModule
import { HttpClient } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core'; // my translation service for i18n
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    SecurityLevelColor
  ],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    // BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatTabsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    SecurityLevelColor,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    TranslateModule
  ],
})
export class MaterialDesignModule { }
