import { Component } from '@angular/core';
import { UserComponent } from "./user/user.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'ECClient';
}
