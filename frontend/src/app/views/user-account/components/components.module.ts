import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags/tags.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [TagsComponent],
  imports: [CommonModule, MaterialModule],
  providers: [],
  exports: [TagsComponent],
})
export class ComponentsModule {}
