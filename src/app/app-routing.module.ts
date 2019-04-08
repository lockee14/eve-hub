import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* FROM ANGULAR DOC:
The order of the routes in the configuration matters and this is by design.
The router uses a first-match wins strategy when matching routes,
so more specific routes should be placed above less specific routes.
In the configuration above,
routes with a static path are listed first,
followed by an empty path route, that matches the default route.
The wildcard route comes last because it matches every URL and should be selected only if no other routes are matched first.
*/

const routes: Routes = [
  { path: '**', redirectTo: '', pathMatch: 'full'}
];


@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { enableTracing: true }) // { enableTracing: true } for debuging purpose
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
