import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from './card/card.component';
import {CardHeaderComponent} from './card-header/card-header.component';
import {CardFooterComponent} from './card-footer/card-footer.component';
import {CardContentComponent} from './card-content/card-content.component';
import {DataComponent} from './data/data.component';
import {DataLabelComponent} from './data-label/data-label.component';
import {DataValueComponent} from './data-value/data-value.component';
import {AlertComponent} from './alert/alert.component';
import {SpriteIconComponent} from './sprite-icon/sprite-icon.component';
import {SvgIconComponent} from './svg-icon/svg-icon.component';
import {ButtonComponent} from './button/button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CardComponent,
    CardHeaderComponent,
    CardFooterComponent,
    CardContentComponent,
    DataComponent,
    DataLabelComponent,
    DataValueComponent,
    AlertComponent,
    SpriteIconComponent,
    SvgIconComponent,
    ButtonComponent
  ],
  exports: [
    CardComponent,
    CardHeaderComponent,
    CardFooterComponent,
    CardContentComponent,
    DataComponent,
    DataLabelComponent,
    DataValueComponent,
    AlertComponent,
    SpriteIconComponent,
    SvgIconComponent,
    ButtonComponent
  ],
})
export class ElementalModule {
}
